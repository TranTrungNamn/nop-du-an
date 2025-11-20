<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Scraping Tool</title>
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
                <span class="badge">Version 1.1 (English)</span>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="hero-section">
            <h1 class="hero-title">E-commerce Data Scraper</h1>
            <p class="hero-description">
                Enter a product category URL below to automatically extract product details, prices, and images.
            </p>
        </div>

        <div class="input-section">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Target URL</h2>
                </div>
                <div class="card-content">
                    <form id="scrapeForm" class="scrape-form">
                        <div class="input-group">
                            <input type="url" id="urlInput" placeholder="https://example.com/products..." required class="form-input">
                            <button type="submit" id="scrapeBtn" class="btn btn-primary">
                                <span class="btn-text">Start Scraping</span>
                                <span class="spinner hidden"></span>
                            </button>
                        </div>
                        <!-- Hiển thị thông tin trang web: -->
                        <a id="siteInfo" href="#" target="_blank" class="site-info hidden">
                            <img id="siteFavicon" src="" alt="Logo" class="site-favicon">
                            <span id="siteDomain" class="site-domain"></span>
                        </a>
                        <!------------------------------------------>
                        <p id="errorMessage" class="error-text hidden"></p>
                    </form>
                </div>
            </div>
        </div>

        <div id="resultsSection" class="results-section hidden">
            <div class="results-header">
                <h2 class="results-title">Scraped Products</h2>
                <p class="results-count">Found <span id="countValue">0</span> items</p>
            </div>
            <div id="resultsList" class="product-grid">
                </div>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>