const images = ["product1.jpeg", "product2.jpeg", "product3.jpeg"];
let currentIndex = 0;

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
});

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
});

function updateImage() {
    document.getElementById("productImage").src = images[currentIndex];
}

function changeImage(imageSrc) {
    document.getElementById("productImage").src = imageSrc;
}

// إرسال الطلب إلى تيليجرام
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let quantity = document.getElementById("quantity").value;

    let message = `📦 طلب جديد:\n\n👤 الاسم: ${name}\n📞 رقم الجوال: ${phone}\n🔢 الكمية المطلوبة: ${quantity} قطعة\n🚚 الشحن: من 1 إلى 7 أيام`;

    let telegramBotToken = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A"; // استبدل بمفتاح البوت الخاص بك
    let telegramChatId = "-1002290156309"; // معرف تيليجرام الخاص بك

    let url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                document.getElementById("orderForm").style.display = "none";
                document.getElementById("confirmationMessage").classList.remove("hidden");
            } else {
                alert("حدث خطأ أثناء إرسال الطلب.");
            }
        })
        .catch(error => {
            console.error("خطأ:", error);
            alert("تعذر إرسال الطلب إلى تيليجرام.");
        });
});
// إرسال الطلب إلى تيليجرام (كودك الحالي)
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

// تفعيل Swiper.js للسلايدر
var swiper = new Swiper(".mySwiper", {
    loop: true, // جعل الصور تدور باستمرار
    autoplay: {
        delay: 3000, // الانتقال التلقائي كل 3 ثواني
        disableOnInteraction: false,
    },
    slidesPerView: 1, // عرض صورة واحدة في كل مرة
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
