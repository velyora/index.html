<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ✅ بيانات تيليجرام
$telegramBotToken = "7569416193:AAF8Nr7RWGGuhjhUkWrR-oFlDWaiYEVQBmM";
$chatID = "-1001664466794";
$message = isset($_POST['message']) ? $_POST['message'] : "رسالة افتراضية";

// ✅ إرسال الطلب إلى تيليجرام باستخدام `file_get_contents`
$url = "https://api.telegram.org/bot$telegramBotToken/sendMessage?chat_id=$chatID&text=" . urlencode($message) . "&parse_mode=Markdown";
$response = file_get_contents($url);

// ✅ إرسال الرد كـ JSON
echo json_encode(["ok" => true, "response" => $response]);
?>
