// تحديث معلومات الشحن ومفتاح الدولة عند تغيير الدولة
function updateShippingInfo() {
    var country = document.getElementById("country");
    var selectedOption = country.options[country.selectedIndex];
    var countryCode = selectedOption.getAttribute("data-code");
    var shippingText = document.getElementById("shipping-text");

    // تحديث مفتاح الدولة
    document.getElementById("country-code").innerText = countryCode;

    // تحديث مدة الشحن بناءً على الدولة
    if (["sa", "qa", "ae", "kw", "om", "bh"].includes(country.value)) {
        shippingText.innerText = "🚚 شحن سريع من 1 إلى 7 أيام.";
    } else if (country.value === "eg") {
        shippingText.innerText = "🚚 شحن سريع من 1 إلى 7 أيام.";
    } else {
        shippingText.innerText = "🚚 شحن سريع من 1 إلى 10 أيام.";
    }
}

// إرسال الطلب إلى تيليجرام + عرض رسالة تأكيد دون مسح البيانات
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;
    let postalCode = document.getElementById("postalCode").value;
    let quantity = document.getElementById("quantity").value;
    let country = document.getElementById("country").options[document.getElementById("country").selectedIndex].text;

    let message = `📦 *طلب جديد:*\n\n👤 *الاسم:* ${name}\n📍 *الدولة:* ${country}\n🏙️ *المدينة:* ${city}\n📮 *الرمز البريدي:* ${postalCode}\n📞 *رقم الجوال:* ${phone}\n🏠 *العنوان:* ${address}\n🔢 *الكمية المطلوبة:* ${quantity} قطعة\n🚚 *مدة الشحن:* ${document.getElementById("shipping-text").innerText}`;

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
            let orderButton = document.querySelector(".btn-glow");
            orderButton.textContent = "✅ تم استلام طلبك!";
            orderButton.classList.remove("bg-blue-500");
            orderButton.classList.add("bg-green-500");

            let confirmationMessage = document.createElement("p");
            confirmationMessage.textContent = "📦 تم استلام طلبك، سيتم التواصل معك في أسرع وقت!";
            confirmationMessage.classList.add("text-green-600", "mt-4", "font-bold", "text-lg");

            document.getElementById("orderForm").appendChild(confirmationMessage);
        } else {
            alert("⚠️ حدث خطأ أثناء إرسال الطلب إلى تيليجرام.");
        }
    })
    .catch(error => {
        console.error("❌ خطأ أثناء إرسال الطلب إلى تيليجرام:", error);
        alert("❌ تعذر إرسال الطلب. تحقق من الاتصال بالإنترنت.");
    });
});
