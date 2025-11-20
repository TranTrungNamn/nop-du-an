document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHAI BÁO CÁC ELEMENT ---
    const scrapeForm = document.getElementById('scrapeForm');
    const urlInput = document.getElementById('urlInput');
    const scrapeBtn = document.getElementById('scrapeBtn');
    const btnText = scrapeBtn.querySelector('.btn-text');
    const spinner = scrapeBtn.querySelector('.spinner');
    const errorMessage = document.getElementById('errorMessage');
    
    // Phần hiển thị kết quả (Grid)
    const resultsSection = document.getElementById('resultsSection');
    const resultsList = document.getElementById('resultsList');
    const countValue = document.getElementById('countValue');

    // Phần Logo & Link Website (Mới thêm)
    const siteInfo = document.getElementById('siteInfo');
    const siteFavicon = document.getElementById('siteFavicon');
    const siteDomain = document.getElementById('siteDomain');

    // --- 2. XỬ LÝ SỰ KIỆN NHẬP URL (HIỂN THỊ LOGO & TẠO LINK) ---
    urlInput.addEventListener('input', (e) => {
        const inputVal = e.target.value.trim();
        
        // Nếu ô trống, ẩn thẻ siteInfo đi
        if (!inputVal) {
            siteInfo.classList.add('hidden');
            return;
        }

        try {
            let fullUrl = inputVal;
            // Tự động thêm https:// nếu người dùng quên để URL object không bị lỗi
            if (!/^https?:\/\//i.test(fullUrl)) {
                fullUrl = 'https://' + fullUrl;
            }

            const urlObj = new URL(fullUrl);
            const domain = urlObj.hostname; // Lấy tên miền (vd: tiki.vn)

            if (domain.includes('.')) {
                // 1. Hiển thị tên miền
                siteDomain.textContent = domain;
                
                // 2. Lấy Favicon từ Google
                siteFavicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                
                // 3. Gán Link gốc (Origin) cho thẻ <a> để bấm vào được
                // urlObj.origin sẽ trả về "https://tiki.vn" thay vì link dài
                siteInfo.href = urlObj.origin; 
                
                // Hiển thị lên
                siteInfo.classList.remove('hidden');
            } else {
                siteInfo.classList.add('hidden');
            }
        } catch (err) {
            // Nếu URL chưa đúng định dạng (đang gõ dở), cứ ẩn đi
            siteInfo.classList.add('hidden');
        }
    });

    // --- 3. XỬ LÝ SỰ KIỆN SUBMIT FORM (BẮT ĐẦU SCRAPE) ---
    scrapeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();

        // Reset giao diện về trạng thái ban đầu
        errorMessage.classList.add('hidden');
        resultsSection.classList.add('hidden');
        resultsList.innerHTML = '';
        if(countValue) countValue.textContent = '0';
        
        // Bật trạng thái Loading
        setLoading(true);

        try {
            // Gọi file PHP trung gian
            const response = await fetch(`api.php?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                throw new Error(`Connection Error: ${response.status} ${response.statusText}`);
            }

            // Parse JSON trả về
            let data;
            try {
                const text = await response.text();
                data = JSON.parse(text);
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError);
                throw new Error("Invalid JSON format received from Python backend.");
            }

            // Kiểm tra lỗi từ Python gửi về
            if (data.error) {
                throw new Error(data.error);
            }

            // Hiển thị kết quả ra màn hình
            displayResult(data);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    });

    // --- 4. HÀM UTILS & HIỂN THỊ ---

    function setLoading(isLoading) {
        if (isLoading) {
            scrapeBtn.disabled = true;
            urlInput.disabled = true;
            btnText.textContent = "Processing...";
            spinner.classList.remove('hidden');
        } else {
            scrapeBtn.disabled = false;
            urlInput.disabled = false;
            btnText.textContent = "Start Scraping";
            spinner.classList.add('hidden');
        }
    }

    function formatCurrency(amount) {
        if (!amount) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    function displayResult(data) {
        resultsSection.classList.remove('hidden');
        
        // Kiểm tra dữ liệu có phải là mảng (List) không
        if (Array.isArray(data)) {
            // Cập nhật số lượng tìm thấy
            if(countValue) countValue.textContent = data.length;

            if (data.length === 0) {
                resultsList.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No products found matching the criteria.</p>';
                return;
            }

            // Map dữ liệu thành HTML (Dạng thẻ Card)
            const html = data.map(item => `
                <div class="product-card">
                    <div class="product-image-container">
                        ${item.discount ? `<span class="discount-tag">${item.discount}</span>` : ''}
                        <img src="${item.image || 'https://placehold.co/300x300?text=No+Image'}" 
                             alt="${item.title}" 
                             class="product-image"
                             onerror="this.src='https://placehold.co/300x300?text=Error'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title" title="${item.title}">${item.title}</h3>
                        <div class="price-box">
                            <span class="current-price">${formatCurrency(item.price_new)}</span>
                            ${item.price_old ? `<span class="old-price">${formatCurrency(item.price_old)}</span>` : ''}
                        </div>
                    </div>
                    <a href="${item.link}" target="_blank" class="view-btn">View Product</a>
                </div>
            `).join('');

            resultsList.innerHTML = html;
        } else {
            // Fallback nếu dữ liệu không đúng định dạng mảng
            resultsList.innerHTML = `<p class="error-text">Data format mismatch: Expected a list of products.</p>`;
        }
    }
});