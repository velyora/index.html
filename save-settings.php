<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// ✅ إنشاء مجلد التخزين إذا لم يكن موجودًا
$uploadDir = "uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// ✅ دالة لحفظ الملفات والتأكد من نجاح التحميل
function uploadFile($fileKey, $uploadDir) {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]["error"] !== UPLOAD_ERR_OK) {
        return null; // لم يتم تحميل الملف
    }
    
    $fileName = basename($_FILES[$fileKey]["name"]);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES[$fileKey]["tmp_name"], $targetPath)) {
        return $targetPath; // ✅ تم التحميل بنجاح
    }
    
    return null; // ❌ فشل التحميل
}

// ✅ تحميل الملفات
$videoPath = uploadFile("videoFile", $uploadDir);
$image1Path = uploadFile("image1File", $uploadDir);
$image2Path = uploadFile("image2File", $uploadDir);

// ✅ استقبال البيانات النصية
$videoTitle = $_POST["videoTitle"] ?? "";
$videoDescription = $_POST["videoDescription"] ?? "";
$image1Title = $_POST["image1Title"] ?? "";
$image1Description = $_POST["image1Description"] ?? "";
$image2Title = $_POST["image2Title"] ?? "";
$image2Description = $_POST["image2Description"] ?? "";
$productID = $_POST["productID"] ?? "";

// ✅ الاتصال بقاعدة البيانات
$conn = new mysqli("localhost", "root", "", "your_database");
if ($conn->connect_error) {
    echo json_encode(["message" => "❌ فشل الاتصال بقاعدة البيانات"]);
    exit;
}

// ✅ تحديث البيانات في الجدول `settings`
$sql = "UPDATE settings SET 
        video_url = IFNULL(NULLIF('$videoPath', ''), video_url), 
        video_title = '$videoTitle', 
        video_description = '$videoDescription',
        image1_url = IFNULL(NULLIF('$image1Path', ''), image1_url), 
        image1_title = '$image1Title', 
        image1_description = '$image1Description',
        image2_url = IFNULL(NULLIF('$image2Path', ''), image2_url), 
        image2_title = '$image2Title', 
        image2_description = '$image2Description',
        product_id = '$productID' 
        WHERE id = 1";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "✅ تم تحديث الإعدادات بنجاح"]);
} else {
    echo json_encode(["message" => "❌ خطأ في تحديث البيانات: " . $conn->error]);
}

$conn->close();
?>
