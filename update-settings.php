<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$mysqli = new mysqli("localhost", "root", "password", "database_name");

if ($mysqli->connect_error) {
    die(json_encode(["success" => false, "message" => "❌ Database connection failed"]));
}

$stmt = $mysqli->prepare("UPDATE settings SET video_url=?, video_title=?, video_description=?, image1_url=?, image1_title=?, image1_description=?, image2_url=?, image2_title=?, image2_description=?, product_id=? WHERE id=1");
$stmt->bind_param("ssssssssss",
    $data["video_url"], $data["video_title"], $data["video_description"],
    $data["image1_url"], $data["image1_title"], $data["image1_description"],
    $data["image2_url"], $data["image2_title"], $data["image2_description"],
    $data["product_id"]
);

$stmt->execute();
$stmt->close();
$mysqli->close();

echo json_encode(["success" => true, "message" => "✅ التحديث تم بنجاح!"]);
?>
