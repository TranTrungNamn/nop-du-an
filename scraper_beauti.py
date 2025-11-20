# file: scraper_beauti.py

from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import logging
import re

def clean_price_value(text):
    """Hàm phụ trợ: Làm sạch chuỗi giá (vd: '2.090.000đ' -> 2090000)"""
    if not text:
        return None
    # Chỉ giữ lại số
    cleaned = re.sub(r"[^\d]", "", text)
    try:
        return int(cleaned) if cleaned else None
    except ValueError:
        return None

def extract_products(html_content, base_url):
    """
    Phân tích HTML dựa trên cấu trúc thẻ div.item-slide của SieuThiYTe
    """
    results = []
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Dựa trên HTML bạn gửi, mỗi sản phẩm nằm trong div có class "item-slide"
    product_items = soup.select("div.item-slide")
    
    logging.info(f"Found {len(product_items)} item-slide elements.")

    for item in product_items:
        try:
            # 1. LẤY LINK (Thẻ <a> bao quanh hoặc nằm trong div)
            link_tag = item.find('a', href=True)
            if not link_tag:
                continue
                
            product_link = urljoin(base_url, link_tag['href'])
            
            # 2. LẤY TIÊU ĐỀ (Thẻ <h3 class="title">)
            title_tag = item.select_one("h3.title")
            title = title_tag.get_text(strip=True) if title_tag else "No Title"

            # 3. LẤY ẢNH (Thẻ <img>)
            # Ưu tiên data-original > data-src > src theo code HTML lazyload
            img_tag = item.select_one("div.img img")
            image_url = None
            if img_tag:
                raw_img_url = (
                    img_tag.get('data-original') 
                    or img_tag.get('data-src') 
                    or img_tag.get('src')
                )
                if raw_img_url:
                    image_url = urljoin(base_url, raw_img_url)

            # 4. LẤY GIÁ (Thẻ <p class="price">)
            price_old = None
            price_new = None
            discount = None

            price_tag = item.select_one("p.price")
            if price_tag:
                # Giá cũ nằm trong thẻ <del> bên trong <span class="promotion">
                del_tag = price_tag.select_one("del")
                if del_tag:
                    price_old = clean_price_value(del_tag.get_text())
                
                # Giá mới là text còn lại trong thẻ p.price hoặc thẻ span kế tiếp
                # Cách an toàn: Lấy toàn bộ text của p.price, loại bỏ text của del, rồi parse số cuối cùng tìm thấy
                full_price_text = price_tag.get_text(strip=True)
                # Nếu có giá cũ, giá mới thường nằm sau. 
                # Ta dùng regex tìm tất cả số tiền, số nhỏ hơn thường là giá mới (hoặc số đứng sau)
                prices_found = re.findall(r"[\d\.]+", full_price_text)
                # Chuyển về int hết
                prices_int = [clean_price_value(p) for p in prices_found if clean_price_value(p)]
                
                if len(prices_int) >= 1:
                    # Giá thấp nhất thường là giá bán
                    price_new = min(prices_int) 
                    # Giá cao nhất thường là giá gốc (nếu có nhiều hơn 1 số)
                    if len(prices_int) > 1:
                         potential_old = max(prices_int)
                         if potential_old > price_new:
                             price_old = potential_old

            # Tính phần trăm giảm giá nếu chưa có
            if price_old and price_new and price_old > price_new:
                pct = int(((price_old - price_new) / price_old) * 100)
                discount = f"-{pct}%"
            
            # Nếu không tìm thấy giá trong p.price, thử fallback các chỗ khác (nếu cần)
            # Nhưng với HTML này thì p.price là chuẩn.

            results.append({
                "title": title,
                "link": product_link,
                "image": image_url,
                "price_old": price_old,
                "price_new": price_new,
                "discount": discount
            })

        except Exception as e:
            logging.error(f"Error parsing item: {e}")
            continue

    return results