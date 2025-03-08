<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$uploadDir = "uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$videoPath = isset($_FILES['videoFile']) ? $uploadDir . basename($_FILES['videoFile']['name']) : '';
$image1Path = isset($_FILES['image1File']) ? $uploadDir . basename($_FILES['image1File']['name']) : '';
$image2Path = isset($_FILES['image2File']) ? $uploadDir . basename($_FILES['image2File']['name']) : '';

if ($videoPath && move_uploaded_file($_FILES['videoFile']['tmp_name'], $videoPath)) {
    $videoPath = $videoPath;
}

if ($image1Path && move_uploaded_file($_FILES['image1File']['tmp_name'], $image1Path)) {
    $image1Path = $image1Path;
}

if ($image2Path && move_uploaded_file($_FILES['image2File']['tmp_name'], $image2Path)) {
    $image2Path = $image2Path;
}

$videoTitle = $_POST['videoTitle'] ?? '';
$videoDescription = $_POST['videoDescription'] ?? '';
$image1Title = $_POST['image1Title'] ?? '';
$image1Description = $_POST['image1Description'] ?? '';
$image2Title = $_POST['image2Title'] ?? '';
$image2Description = $_POST['image2Description'] ?? '';
$productID = $_POST['productID'] ?? '';

$conn = new mysqli("localhost", "root", "", "your_database");

if ($conn->connect_error) {
    die(json_encode(["message" => "❌ فشل الاتصال بقاعدة البيانات"]));
}

$sql = "UPDATE settings SET 
        video_url='$videoPath', video_title='$videoTitle', video_description='$videoDescription',
        image1_url='$image1Path', image1_title='$image1Title', image1_description='$image1Description',
        image2_url='$image2Path', image2_title='$image2Title', image2_description='$image2Description',
        product_id='$productID' WHERE id=1";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "✅ تم تحديث الإعدادات بنجاح"]);
} else {
    echo json_encode(["message" => "❌ خطأ في تحديث البيانات: " . $conn->error]);
}

$conn->close();
?>
