document.addEventListener("DOMContentLoaded", function () {
    // ✅ تعريف متغيرات API
    const JSONBIN_API = "https://api.jsonbin.io/v3/b/67b25350acd3cb34a8e4bf28";
    const JSONBIN_SECRET = "$2a$10$cR8U3fnhRtMfoC722GP31eOWZghfYOja3xo8ZR0OxFM/MbMyG2viq";
    const TELEGRAM_BOT_TOKEN = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A";
    const TELEGRAM_CHAT_ID = "-1002290156309";

    // ✅ تعريف أسعار المنتج لكل دولة
    const prices = {
        "sa": 37, "qa": 35, "ae": 36, "kw": 3, "om": 3.7, "bh": 3.8,
        "eg": 300, "jo": 7, "iq": 14500, "lb": 900000
    };

    const currencies = {
        "sa": "ريال", "qa": "ريال", "ae": "درهم", "kw": "دينار", "om": "ريال",
        "bh": "دينار", "eg": "جنيه", "jo": "دينار", "iq": "دينار", "lb": "ليرة"
    };

    // ✅ جلب عناصر الصفحة
    let countrySelect = document.getElementById("country");
    let phoneCode = document.getElementById("country-code");
    let quantitySelect = document.getElementById("quantity");
    let priceDisplay = document.getElementById("priceDisplay");
    let orderForm = document.getElementById("orderForm");
    let orderNumberContainer = document.getElementById("orderNumberContainer");
    let orderNumberElement = document.getElementById("orderNumber");
    let successMessage = document.getElementById("successMessage");

    // ✅ تحديث مفتاح الدولة عند تغيير الدولة
    countrySelect.addEventListener("change", function () {
        let selectedOption = countrySelect.options[countrySelect.selectedIndex];
        let countryCode = selectedOption.getAttribute("data-code");
        phoneCode.textContent = countryCode;
        updatePrice();
    });

    // ✅ تحديث السعر عند تغيير الدولة أو الكمية
    function updatePrice() {
        let country = countrySelect.value;
        let quantity = parseInt(quantitySelect.value) || 1;
        let pricePerPiece = prices[country] || 0;
        let currency = currencies[country] || "";
        let totalPrice = pricePerPiece * quantity;

        priceDisplay.textContent = `💰 السعر: ${totalPrice.toLocaleString()} ${currency}`;
    }

    quantitySelect.addEventListener("change", updatePrice);
    updatePrice();

    // ✅ إرسال الطلب
    orderForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let countryName = countrySelect.options[countrySelect.selectedIndex].text;
        let phone = document.getElementById("phone").value.trim();
        let city = document.getElementById("city").value.trim();
        let address = document.getElementById("address").value.trim();
        let postalCode = document.getElementById("postalCode").value.trim();
        let quantity = quantitySelect.value;
        let totalPrice = priceDisplay.textContent;
        let orderNumber = Math.floor(100000 + Math.random() * 900000);

        if (!name || !phone || !city || !address || !postalCode) {
            alert("❌ يرجى تعبئة جميع الحقول المطلوبة.");
            return;
        }

        // ✅ إخفاء النموذج وإظهار رسالة النجاح
        orderForm.classList.add("hidden");
        successMessage.classList.remove("hidden");
        orderNumberElement.textContent = `✅ رقم طلبك: ${orderNumber}`;
        orderNumberContainer.classList.remove("hidden");

        // ✅ إخفاء الرسالة بعد 100 ثانية وإعادة إظهار النموذج
        setTimeout(() => {
            orderNumberContainer.classList.add("hidden");
            successMessage.classList.add("hidden");
            orderForm.classList.remove("hidden");
        }, 100000);

        // ✅ إرسال الطلب إلى تيليجرام
        let message = `📢 *طلب جديد!* 🚀\n\n` +
                      `🔢 *رقم الطلب:* ${orderNumber}\n` +
                      `👤 *الاسم:* ${name}\n` +
                      `🌍 *الدولة:* ${countryName}\n` +
                      `🏙️ *المدينة:* ${city}\n` +
                      `📍 *العنوان:* ${address}\n` +
                      `📬 *الرمز البريدي:* ${postalCode}\n` +
                      `📞 *رقم الجوال:* ${phone}\n` +
                      `🛒 *الكمية المطلوبة:* ${quantity} قطع\n` +
                      `${totalPrice}`;

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        });
    });
});
