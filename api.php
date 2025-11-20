<?php
// Đặt header để báo cho trình duyệt biết kết quả trả về là JSON
header('Content-Type: application/json; charset=utf-8');

// 1. Lấy URL từ tham số gửi lên
$url = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($url)) {
    echo json_encode(["error" => "Lỗi: Vui lòng cung cấp URL."]);
    exit;
}

// 2. Cấu hình lệnh chạy Python trên Linux (aaPanel)
// Lưu ý: Dùng 'python3' thay vì 'python'
// escapeshellarg giúp bảo mật, tránh người dùng nhập lệnh nguy hiểm
$command = "python3 scraper.py " . escapeshellarg($url) . " 2>&1";

// 3. Thực thi lệnh
$output = shell_exec($command);

// 4. Kiểm tra kết quả
if ($output === null) {
    echo json_encode(["error" => "Lỗi Server: Không thể gọi lệnh Python (Hàm shell_exec có thể bị tắt)."]);
} else {
    // Trả về nguyên văn những gì Python in ra (JSON)
    echo $output;
}
?>