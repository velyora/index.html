<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$telegramBotToken = "7569416193:AAF8Nr7RWGGuhjhUkWrR-oFlDWaiYEVQBmM";
$chatID = "-1001664466794";
$message = $_POST['message'] ?? 'رسالة افتراضية';

$url = "https://api.telegram.org/bot$telegramBotToken/sendMessage?chat_id=$chatID&text=" . urlencode($message);
$response = file_get_contents($url);

echo json_encode(["response" => $response]);
?>
