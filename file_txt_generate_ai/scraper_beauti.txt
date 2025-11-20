# scrape_beauti.py
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import logging

# Thiết lập Selector CSS dựa trên cấu trúc HTML đã cung cấp
PRODUCT_CONTAINER_SELECTOR = ".product-item" 
IMAGE_SELECTOR = "div.img img" 

def extract_images_and_titles(html_content, base_url):
    """
    Sử dụng Beautiful Soup để phân tích HTML (tĩnh) được cung cấp, trích xuất link hình ảnh và 
    sử dụng thuộc tính ALT làm key đối chiếu (image_map).
    
    Args:
        html_content (str): HTML đã được Selenium render.
        base_url (str): URL cơ sở để xử lý đường dẫn tương đối.
        
    Returns:
        dict: {title_alt: image_url, ...}
    """
    # Khởi tạo logger riêng cho module này nếu cần, hoặc dùng logger chính
    # logging.info("Starting Beautiful Soup analysis for image extraction in separate file.")
    image_map = {}
    
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 1. Tìm các container sản phẩm
        product_containers = soup.select(PRODUCT_CONTAINER_SELECTOR)
        # logging.info(f"BS found {len(product_containers)} potential product containers.")

        for container in product_containers:
            title_key = None
            image_url = None
            
            # 2. Trích xuất Ảnh và Key đối chiếu (ALT)
            image_tag = container.select_one(IMAGE_SELECTOR)
            
            if image_tag:
                # Lấy Tiêu đề từ thuộc tính ALT (Key đối chiếu)
                title_key = image_tag.get('alt', '').strip()
                
                # Lấy URL (Ưu tiên data-src theo lazy-loading)
                image_url = image_tag.get('data-src') or image_tag.get('data-original') or image_tag.get('src')
                
                if image_url:
                    # Đảm bảo URL tuyệt đối
                    image_url = urljoin(base_url, image_url) 
            
            # 3. Lưu vào map
            if title_key and image_url:
                image_map[title_key] = image_url
                
    except Exception as e:
        logging.error(f"Error during Beautiful Soup parsing: {e}")

    logging.info(f"Beautiful Soup analysis finished. Found {len(image_map)} image links.")
    return image_map