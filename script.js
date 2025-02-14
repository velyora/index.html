document.addEventListener("DOMContentLoaded", function() {
    const orderForm = document.getElementById("orderForm");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const countrySelect = document.getElementById("country");
    const countryCodeSpan = document.getElementById("country-code");
    const shippingText = document.getElementById("shipping-text");

    // تحديث مفتاح الدولة عند تغيير الدولة
    countrySelect.addEventListener("change", function() {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const countryCode = selectedOption.getAttribute("data-code");
        countryCodeSpan.textContent = countryCode;

        // تحديث نص الشحن بناءً على الدولة المختارة
        const gulfCountries = ["sa", "qa", "ae", "kw", "om", "bh"];
        if (gulfCountries.includes(selectedOption.value)) {
            shippingText.textContent = "🚚 شحن سريع من 1 إلى 7 أيام";
        } else if (selectedOption.value === "eg") {
            shippingText.textContent = "🚚 شحن سريع من 1 إلى 7 أيام";
        } else {
            shippingText.textContent = "🚚 شحن سريع من 1 إلى 10 أيام";
        }
    });

    // إرسال الطلب إلى تيليجرام
    orderForm.addEventListener("submit", function(event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        // جلب بيانات المستخدم
        const name = document.getElementById("name").value;
        const country = countrySelect.options[countrySelect.selectedIndex].text;
        const city = document.getElementById("city").value;
        const address = document.getElementById("address").value;
        const postalCode = document.getElementById("postalCode").value;
        const phone = document.getElementById("phone").value;
        const quantity = document.getElementById("quantity").value;
        const shippingInfo = shippingText.textContent;

        // التحقق من عدم ترك الحقول فارغة
        if (!name || !phone || !city || !address || !postalCode) {
            alert("⚠️ يرجى ملء جميع الحقول المطلوبة.");
            return;
        }

        // تنسيق الرسالة لإرسالها إلى تيليجرام
        const message = `📦 *طلب جديد:*\n\n` +
                        `👤 *الاسم:* ${name}\n` +
                        `🌍 *الدولة:* ${country}\n` +
                        `🏙 *المدينة:* ${city}\n` +
                        `📍 *العنوان:* ${address}\n` +
                        `📬 *الرمز البريدي:* ${postalCode}\n` +
                        `📞 *رقم الجوال:* ${phone}\n` +
                        `🔢 *الكمية المطلوبة:* ${quantity} قطعة\n` +
                        `🚚 *مدة الشحن:* ${shippingInfo}`;

        // إعداد بيانات الطلب
        const telegramBotToken = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A"; // ضع التوكن الخاص بك هنا
        const telegramChatId = "-1002290156309"; // ضع معرف القناة أو المجموعة الخاصة بك هنا
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        // إرسال الطلب إلى تيليجرام
        fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                confirmationMessage.classList.remove("hidden");
                confirmationMessage.textContent = "✅ تم استلام طلبك! سيتم التواصل معك في أسرع وقت ممكن.";
                orderForm.reset(); // إعادة تعيين النموذج بعد الإرسال
            } else {
                alert("⚠️ حدث خطأ أثناء إرسال الطلب إلى تيليجرام.");
            }
        })
        .catch(error => {
            console.error("❌ خطأ أثناء إرسال الطلب إلى تيليجرام:", error);
            alert("❌ تعذر إرسال الطلب. تحقق من الاتصال بالإنترنت.");
        });
    });
});
