<?php
// ✅ استبدل التوكن ومعرف الشات بمعلوماتك الحقيقية
$telegramBotToken = "7569416193:AAF8Nr7RWGGuhjhUkWrR-oFlDWaiYEVQBmM";
$chatID = "-1001664466794";
$message = "✅ اختبار إرسال من PHP إلى تيليجرام";

// ✅ رابط API تيليجرام
$url = "https://api.telegram.org/bot$telegramBotToken/sendMessage?chat_id=$chatID&text=" . urlencode($message);

// ✅ تنفيذ الطلب
$response = file_get_contents($url);

// ✅ طباعة النتيجة لمساعدتك في التأكد من نجاح الإرسال
echo "Telegram Response: " . $response;
?>
