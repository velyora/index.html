document.addEventListener("DOMContentLoaded", function () {
    const orderForm = document.getElementById("orderForm");
    const countrySelect = document.getElementById("country");
    const countryCode = document.getElementById("country-code");
    const quantitySelect = document.getElementById("quantity");

    // ✅ قائمة أسعار المنتجات لكل دولة
    const prices = {
        "sa": 39, // السعودية - بالريال
        "qa": 35, // قطر - بالريال القطري
        "ae": 36, // الإمارات - بالدرهم
        "kw": 3, // الكويت - بالدينار
        "om": 4, // عمان - بالريال العماني
        "bh": 4, // البحرين - بالدينار البحريني
        "eg": 250, // مصر - بالجنيه
        "jo": 28, // الأردن - بالدينار
        "iq": 40000, // العراق - بالدينار العراقي
        "lb": 500000, // لبنان - بالليرة اللبنانية
    };

    // ✅ قائمة عملات لكل دولة
    const currencies = {
        "sa": "ريال سعودي",
        "qa": "ريال قطري",
        "ae": "درهم إماراتي",
        "kw": "دينار كويتي",
        "om": "ريال عماني",
        "bh": "دينار بحريني",
        "eg": "جنيه مصري",
        "jo": "دينار أردني",
        "iq": "دينار عراقي",
        "lb": "ليرة لبنانية",
    };

    // ✅ تحديث مفتاح الدولة والسعر عند تغيير الدولة
    countrySelect.addEventListener("change", function () {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const code = selectedOption.getAttribute("data-code");
        if (code) {
            countryCode.textContent = code;
        }
    });

    // ✅ إرسال الطلب عند الضغط على زر الدفع عند الاستلام
    orderForm.addEventListener("submit", function(event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        let name = document.getElementById("name").value;
        let countryCodeValue = countryCode.textContent;
        let country = document.getElementById("country");
        let countryName = country.options[country.selectedIndex].text;
        let phone = document.getElementById("phone").value;
        let city = document.getElementById("city").value;
        let address = document.getElementById("address").value;
        let postalCode = document.getElementById("postalCode").value;
        let quantity = parseInt(document.getElementById("quantity").value);
        let countryCodeKey = country.value;

        // ✅ حساب السعر حسب الدولة والكمية
        let pricePerPiece = prices[countryCodeKey] || 0;
        let currency = currencies[countryCodeKey] || "";
        let totalPrice = pricePerPiece * quantity;

        // 📦 **تنسيق الرسالة المرسلة إلى تيليجرام**
        let message = `📢 *طلب جديد!* 🚀\n\n` +
                      `👤 *الاسم:* ${name}\n` +
                      `🌍 *الدولة:* ${countryName}\n` +
                      `🏙️ *المدينة:* ${city}\n` +
                      `📍 *العنوان:* ${address}\n` +
                      `📬 *الرمز البريدي:* ${postalCode}\n` +
                      `📞 *رقم الجوال:* ${countryCodeValue} ${phone}\n` +
                      `🛒 *الكمية المطلوبة:* ${quantity} قطعة\n` +
                      `💰 *السعر:* ${totalPrice} ${currency}\n` +
                      `🚚 *مدة الشحن:* من 1 إلى 7 أيام\n\n` +
                      `✅ *تم إرسال الطلب بنجاح!*`;

        let telegramBotToken = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A"; 
        let telegramChatId = "-1002290156309"; 

        let telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showSuccessMessage();
            } else {
                alert("⚠️ حدث خطأ أثناء إرسال الطلب إلى تيليجرام.");
            }
        })
        .catch(error => {
            console.error("❌ خطأ أثناء إرسال الطلب إلى تيليجرام:", error);
            alert("❌ تعذر إرسال الطلب. تحقق من الاتصال بالإنترنت.");
        });
    });

    // ✅ **عرض رسالة النجاح وتغيير لون الزر**
    function showSuccessMessage() {
        let button = document.querySelector(".btn-glow");
        button.innerHTML = "✅ تم إرسال الطلب بنجاح";
        button.style.background = "linear-gradient(to right, #16a085, #27ae60)";
        button.style.transition = "background 0.5s ease-in-out";

        // ✅ **إخفاء الرسالة بعد 3 ثوانٍ**
        setTimeout(() => {
            button.innerHTML = "🚀 اطلب الآن والدفع عند الاستلام";
            button.style.background = "linear-gradient(to right, #f7971e, #ff4500)";
            
            // 🔹 **إعادة تعيين النموذج**
            document.getElementById("orderForm").reset();
        }, 3000);
    }
});
