<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 📌 تحميل التقييمات
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $reviews = file_get_contents("reviews.json");
    echo $reviews;
    exit;
}

// 📌 إضافة تقييم جديد
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['name']) || !isset($data['rating']) || !isset($data['comment'])) {
        echo json_encode(["error" => "جميع الحقول مطلوبة"]);
        exit;
    }

    // جلب التقييمات القديمة
    $reviews = json_decode(file_get_contents("reviews.json"), true);
    $reviews[] = $data;

    // حفظ التقييمات الجديدة
    file_put_contents("reviews.json", json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode(["message" => "تم حفظ التقييم بنجاح"]);
    exit;
}
?>
