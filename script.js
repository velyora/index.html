// تفعيل Swiper.js للسلايدر
var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// إرسال الطلب إلى تيليجرام
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let quantity = document.getElementById("quantity").value;

    let message = `📦 *طلب جديد:*\n\n👤 *الاسم:* ${name}\n📞 *رقم الجوال:* ${phone}\n🔢 *الكمية المطلوبة:* ${quantity} قطعة\n🚚 *الشحن:* من 1 إلى 7 أيام`;

    let telegramBotToken = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A";
    let telegramChatId = "-1002290156309";

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
            document.getElementById("orderForm").style.display = "none";
            document.getElementById("confirmationMessage").classList.remove("hidden");
        } else {
            alert("⚠️ حدث خطأ أثناء إرسال الطلب إلى تيليجرام.");
        }
    })
    .catch(error => {
        console.error("❌ خطأ أثناء إرسال الطلب إلى تيليجرام:", error);
        alert("❌ تعذر إرسال الطلب. تحقق من الاتصال بالإنترنت.");
    });
});
