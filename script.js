const images = ["product1.jpg", "product2.jpg", "product3.jpg"];
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
    let telegramChatId = "@Quran_K_bot"; // معرف تيليجرام الخاص بك

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
