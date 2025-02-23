function trackOrder() {
    let trackingNumber = document.getElementById("trackingNumber").value.trim();
    if (trackingNumber) {
        window.open(`https://www.17track.net/en/track?nums=${trackingNumber}`, "_blank");
    } else {
        document.getElementById("trackingResult").innerText = "❌ Please enter a valid tracking number.";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const TELEGRAM_BOT_TOKEN = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A";
    const TELEGRAM_CHAT_ID = "-1002290156309";

    function sendToTelegram(message) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        }).catch(error => console.error("Telegram API error:", error));
    }

    // 🔹 إرسال طلب الشراء عند الدفع
    document.getElementById("orderForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let country = document.getElementById("country").value.trim();
        let city = document.getElementById("city").value.trim();
        let address = document.getElementById("address").value.trim();
        let postalCode = document.getElementById("postalCode").value.trim();
        let quantity = document.getElementById("quantity").value;
        let totalPrice = document.getElementById("total-price").textContent;

        if (!name || !phone || !city || !address || !postalCode) {
            alert("❌ Please fill in all required fields.");
            return;
        }

        let orderMessage = `📢 *New Order Received!* 🚀\n\n` +
                           `👤 *Name:* ${name}\n` +
                           `📍 *Country:* ${country}\n` +
                           `🏙️ *City:* ${city}\n` +
                           `📌 *Address:* ${address}\n` +
                           `📬 *Postal Code:* ${postalCode}\n` +
                           `📞 *Phone:* ${phone}\n` +
                           `🛒 *Quantity:* ${quantity}\n` +
                           `💰 *Total Price:* ${totalPrice}`;

        sendToTelegram(orderMessage);
        alert("✅ Your order has been placed successfully!");
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const notifications = [
        "🚀 New Orders Are Being Placed Right Now!",
        "🔥 Limited Stock Available – Order Now!",
        "💰 Huge Discounts On Selected Items!",
        "📦 Fast Shipping Available Worldwide!",
        "⭐ Customer Rated 4.9/5 – Shop with Confidence!"
    ];

    let index = 0;
    setInterval(() => {
        document.getElementById("notification-text").textContent = notifications[index];
        index = (index + 1) % notifications.length;
    }, 4000); // تغيير الإشعار كل 4 ثواني
});
document.addEventListener("DOMContentLoaded", function () {
    // 🔹 تفعيل زر تتبع الطلب
    const trackLink = document.querySelector(".track-link");
    if (trackLink) {
        trackLink.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector("#tracking-section").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    // 🔹 تفعيل زر القائمة في الجوال
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", function () {
            mobileNav.classList.toggle("active");
            document.body.classList.toggle("no-scroll"); // منع تمرير الصفحة عند فتح القائمة
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });
});
