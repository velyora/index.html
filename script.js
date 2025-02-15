document.addEventListener("DOMContentLoaded", function () {
    // ✅ العناصر الأساسية
    let countrySelect = document.getElementById("country");
    let phoneCode = document.getElementById("country-code");
    let quantitySelect = document.getElementById("quantity");
    let priceDisplay = document.getElementById("priceDisplay");
    let reviewTrack = document.getElementById("reviewTrack");
    let reviewForm = document.getElementById("reviewForm");
    let orderForm = document.getElementById("orderForm");

    // ✅ التأكد من أن العناصر موجودة قبل تشغيل أي كود
    if (!orderForm) {
        console.error("❌ خطأ: لم يتم العثور على `orderForm`. تأكد من أن لديك `id='orderForm'` في HTML.");
        return;
    }

    if (!reviewTrack) {
        console.error("❌ خطأ: لم يتم العثور على `reviewTrack`. تأكد من أن لديك `id='reviewTrack'` في HTML.");
        return;
    }

    // 🔹 **أسعار المنتج لكل دولة (بالعملة المحلية)**
    const prices = {
        "sa": "٣٧", "qa": "٣٥", "ae": "٣٦", "kw": "٣", "om": "٣٫٧",
        "bh": "٣٫٨", "eg": "٣٠٠", "jo": "٧", "iq": "١٤٥٠٠", "lb": "٩٠٠٠٠٠"
    };

    // 🔹 **رموز العملات لكل دولة**
    const currencies = {
        "sa": "ريال", "qa": "ريال", "ae": "درهم", "kw": "دينار",
        "om": "ريال", "bh": "دينار", "eg": "جنيه", "jo": "دينار",
        "iq": "دينار", "lb": "ليرة"
    };

    // ✅ **تحديث مفتاح الدولة عند تغيير الدولة**
    countrySelect.addEventListener("change", function() {
        let selectedOption = countrySelect.options[countrySelect.selectedIndex];
        let countryCode = selectedOption.getAttribute("data-code");
        phoneCode.textContent = countryCode;
        updatePrice();
    });

    // ✅ **تحديث السعر عند تغيير الدولة أو الكمية**
    function updatePrice() {
        let country = countrySelect.value;
        let quantity = parseInt(quantitySelect.value);
        let pricePerPiece = prices[country] || "٠";
        let currency = currencies[country] || "";
        let totalPrice = parseFloat(pricePerPiece.replace("٫", ".").replace(",", ".")) * quantity;

        // 🔹 عرض السعر المحدث
        priceDisplay.textContent = `💰 السعر: ${totalPrice.toLocaleString("ar-EG")} ${currency}`;
    }

    quantitySelect.addEventListener("change", updatePrice);
    updatePrice(); // تحديث السعر عند تحميل الصفحة

    // ✅ **إرسال الطلب عند النقر على الزر**
    orderForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let countryName = countrySelect.options[countrySelect.selectedIndex].text;
        let phone = document.getElementById("phone").value;
        let city = document.getElementById("city").value;
        let address = document.getElementById("address").value;
        let postalCode = document.getElementById("postalCode").value;
        let quantity = quantitySelect.value;
        let totalPrice = priceDisplay.textContent;
        let orderNumber = Math.floor(100000 + Math.random() * 900000); // توليد رقم طلب عشوائي

        // 📢 **تنسيق الرسالة المرسلة إلى تيليجرام**
        let message = `📢 *طلب جديد!* 🚀\n\n` +
                      `🔢 *رقم الطلب:* ${orderNumber}\n` +
                      `👤 *الاسم:* ${name}\n` +
                      `🌍 *الدولة:* ${countryName}\n` +
                      `🏙️ *المدينة:* ${city}\n` +
                      `📍 *العنوان:* ${address}\n` +
                      `📬 *الرمز البريدي:* ${postalCode}\n` +
                      `📞 *رقم الجوال:* ${phone}\n` +
                      `🛒 *الكمية المطلوبة:* ${quantity} قطع\n` +
                      `${totalPrice}\n` +
                      `🚚 *مدة الشحن:* من ١ إلى ٧ أيام\n\n` +
                      `✅ *تم إرسال الطلب بنجاح!*`;

        let telegramBotToken = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A"; 
        let telegramChatId = "-1002290156309"; 

        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
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
                showSuccessMessage(orderNumber);
            } else {
                alert("⚠️ حدث خطأ أثناء إرسال الطلب إلى تيليجرام.");
            }
        })
        .catch(error => {
            console.error("❌ خطأ أثناء إرسال الطلب إلى تيليجرام:", error);
            alert("❌ تعذر إرسال الطلب. تحقق من الاتصال بالإنترنت.");
        });
    });

    // ✅ **عرض رسالة النجاح وتغيير المحتوى لرقم الطلب**
    function showSuccessMessage(orderNumber) {
        document.getElementById("orderForm").classList.add("hidden");
        document.getElementById("orderNumber").textContent = orderNumber;
        document.getElementById("orderNumberContainer").classList.remove("hidden");

        setTimeout(() => {
            document.getElementById("orderForm").reset();
            document.getElementById("orderForm").classList.remove("hidden");
            document.getElementById("orderNumberContainer").classList.add("hidden");
            updatePrice();
        }, 100000);
    }

    // ✅ **إضافة تقييم جديد**
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.getElementById("reviewerName").value;
        let rating = document.getElementById("reviewRating").value;
        let comment = document.getElementById("reviewText").value;

        let newReview = document.createElement("div");
        newReview.classList.add("review-item");
        newReview.textContent = `${rating} ${name}: ${comment}`;

        reviewTrack.appendChild(newReview);
        reviewForm.reset();
    });

});
