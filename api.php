<?php
// Đặt header để báo cho trình duyệt biết kết quả trả về là JSON
header('Content-Type: application/json; charset=utf-8');

// 1. Lấy URL từ tham số gửi lên
$url = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($url)) {
    echo json_encode(["error" => "Lỗi: Vui lòng cung cấp URL."]);
    exit;
}

// --- FIX LỖI CHARMAP TRÊN WINDOWS ---
// Thiết lập biến môi trường để Python in ra UTF-8 thay vì encoding mặc định của Windows
putenv("PYTHONIOENCODING=utf-8");

// 2. Cấu hình lệnh chạy Python trên Linux (aaPanel)
// Chuyển hướng lỗi (2>&1) có thể làm lẫn lộn JSON trả về. 
// Tốt nhất chỉ lấy stdout, còn log lỗi nên ghi vào file riêng trong Python.
// Thêm 2>&1 để gộp lỗi vào output trả về
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