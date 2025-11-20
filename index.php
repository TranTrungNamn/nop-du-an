<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Scraping Refined</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>

    <header class="site-header">
        <div class="header-container">
            <div class="logo-area">
                <div class="logo-dot"></div>
                <h1 class="logo-text">Scraper Tool</h1>
            </div>
            <nav class="main-nav">
                <span class="badge">Version 1.0</span>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="hero-section">
            <h1 class="hero-title">Công Cụ Cào Dữ Liệu Web</h1>
            <p class="hero-description">
                Nhập đường dẫn URL bên dưới để hệ thống Python tự động trích xuất dữ liệu cho bạn.
            </p>
        </div>

        <div class="input-section">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Nhập URL cần xử lý</h2>
                </div>
                <div class="card-content">
                    <form id="scrapeForm" class="scrape-form">
                        <div class="input-group">
                            <input type="url" id="urlInput" placeholder="https://example.com" required class="form-input">
                            <button type="submit" id="scrapeBtn" class="btn btn-primary">
                                <span class="btn-text">Bắt đầu Scrape</span>
                                <span class="spinner hidden"></span>
                            </button>
                        </div>
                        <p id="errorMessage" class="error-text hidden"></p>
                    </form>
                </div>
            </div>
        </div>

        <div id="resultsSection" class="results-section hidden">
            <div class="results-header">
                <h2 class="results-title">Kết quả trả về từ Python</h2>
                <p class="results-count">Đã tìm thấy dữ liệu</p>
            </div>
            <div id="resultsList" class="results-list">
                </div>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>