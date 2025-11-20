document.addEventListener('DOMContentLoaded', () => {
    const scrapeForm = document.getElementById('scrapeForm');
    const urlInput = document.getElementById('urlInput');
    const scrapeBtn = document.getElementById('scrapeBtn');
    const btnText = scrapeBtn.querySelector('.btn-text');
    const spinner = scrapeBtn.querySelector('.spinner');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');
    const resultsList = document.getElementById('resultsList');

    scrapeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();

        // Reset trạng thái cũ
        errorMessage.classList.add('hidden');
        resultsSection.classList.add('hidden');
        resultsList.innerHTML = '';
        
        // Bật trạng thái Loading
        setLoading(true);

        try {
            // Gửi yêu cầu đến api.php
            const response = await fetch(`api.php?url=${encodeURIComponent(url)}`);
            
            // Kiểm tra nếu server lỗi (500, 404...)
            if (!response.ok) {
                throw new Error(`Lỗi kết nối: ${response.status} ${response.statusText}`);
            }

            // Đọc dữ liệu JSON trả về
            let data;
            try {
                const text = await response.text(); // Đọc dạng text trước để debug nếu cần
                data = JSON.parse(text); // Thử chuyển sang JSON
            } catch (jsonError) {
                console.error("Lỗi JSON:", jsonError);
                throw new Error("Dữ liệu trả về từ Python không đúng định dạng JSON.");
            }

            // Kiểm tra nếu Python báo lỗi
            if (data.error) {
                throw new Error(data.error);
            }

            // Hiển thị kết quả thành công
            displayResult(data);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            scrapeBtn.disabled = true;
            urlInput.disabled = true;
            btnText.textContent = "Đang xử lý...";
            spinner.classList.remove('hidden');
        } else {
            scrapeBtn.disabled = false;
            urlInput.disabled = false;
            btnText.textContent = "Bắt đầu Scrape";
            spinner.classList.add('hidden');
        }
    }

    function displayResult(data) {
        resultsSection.classList.remove('hidden');
        
        // Tạo thẻ HTML hiển thị kết quả
        const html = `
            <div class="card result-card">
                <div class="card-header">
                    <h3 class="result-title">${data.title || 'Không có tiêu đề'}</h3>
                    <a href="${data.url}" target="_blank" class="result-link">${data.url}</a>
                </div>
                <div class="card-content">
                    <div class="result-row">
                        <strong>Mô tả:</strong>
                        <p>${data.description || 'Không có mô tả'}</p>
                    </div>
                    <div class="result-row">
                        <strong>Nội dung chính:</strong>
                        <div class="content-box">${data.content || 'Không lấy được nội dung'}</div>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="badge">Thời gian: ${data.scrapedAt}</span>
                </div>
            </div>
        `;
        resultsList.innerHTML = html;
    }
});