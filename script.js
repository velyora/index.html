document.addEventListener("DOMContentLoaded", function () {
    const orderForm = document.getElementById("orderForm");
    const countrySelect = document.getElementById("country");
    const countryCode = document.getElementById("country-code");
    const shippingText = document.getElementById("shipping-text");

    // تحديث مفتاح الدولة عند تغيير الدولة
    countrySelect.addEventListener("change", function () {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const code = selectedOption.getAttribute("data-code");
        countryCode.textContent = code;

        // تحديث مدة الشحن بناءً على الدولة
        if (["sa", "qa", "ae", "kw", "om", "bh"].includes(countrySelect.value)) {
            shippingText.textContent = "🚚 شحن سريع من 1 يوم إلى 7 أيام";
        } else if (countrySelect.value === "eg") {
            shippingText.textContent = "🚚 شحن سريع من 1 يوم إلى 7 أيام";
        } else {
            shippingText.textContent = "🚚 شحن سريع من 1 يوم إلى 10 أيام";
        }
    });

    // إرسال الطلب عند الضغط على زر الدفع عند الاستلام
    orderForm.addEventListener("submit", function (event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        let city = document.getElementById("city").value;
        let address = document.getElementById("address").value;
        let postalCode = document.getElementById("postalCode").value;
        let country = countrySelect.options[countrySelect.selectedIndex].text;
        let quantity = document.getElementById("quantity").value;

        if (!name || !phone || !city || !address || !postalCode || !quantity) {
            alert("⚠️ يرجى تعبئة جميع الحقول المطلوبة قبل إرسال الطلب.");
            return;
        }

        // 🔹 **تنسيق الرسالة لإرسالها إلى تيليجرام**
        let message = `📦 *طلب جديد!*\n\n`
            + `👤 *الاسم:* ${name}\n`
            + `📞 *رقم الجوال:* ${phone}\n`
            + `🏙 *المدينة:* ${city}\n`
            + `📍 *العنوان:* ${address}\n`
            + `📮 *الرمز البريدي:* ${postalCode}\n`
            + `🌍 *الدولة:* ${country}\n`
            + `🔢 *الكمية المطلوبة:* ${quantity} قطعة\n`
            + `🚚 *مدة الشحن:* ${shippingText.textContent}\n\n`
            + `🛍 *تم استلام طلب جديد عبر الموقع، يرجى المتابعة مع العميل.*`;

        let telegramBotToken = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A"; // 🔹 **استبدل بمفتاح البوت الخاص بك**
        let telegramChatId = "-1002290156309"; // 🔹 **استبدل بمعرف تيليجرام الخاص بك**

        let telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

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
                document.getElementById("orderForm").reset(); // 🔄 **إعادة تعيين النموذج**
                alert("✅ تم استلام طلبك! سيتم التواصل معك في أسرع وقت ممكن.");
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
