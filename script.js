document.addEventListener("DOMContentLoaded", function () {
    // ✅ تفعيل القائمة الجانبية
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const closeMenu = document.querySelector(".close-menu");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.add("active");
        });

        if (closeMenu) {
            closeMenu.addEventListener("click", function () {
                sidebar.classList.remove("active");
            });
        }

        document.addEventListener("click", function (event) {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                sidebar.classList.remove("active");
            }
        });
    }

    // ✅ إشعارات ديناميكية في شريط التنبيه العلوي
    const notificationText = document.getElementById("notification-text");
    if (notificationText) {
        const notifications = [
            "🚀 New Orders Are Being Placed Right Now!",
            "🔥 Limited Stock Available – Order Now!",
            "💰 Huge Discounts On Selected Items!",
            "📦 Fast Shipping Available Worldwide!",
            "⭐ Customer Rated 4.9/5 – Shop with Confidence!"
        ];
        let index = 0;
        setInterval(() => {
            notificationText.textContent = notifications[index];
            index = (index + 1) % notifications.length;
        }, 4000);
    }

    // ✅ إرسال الطلب إلى تيليجرام عند تقديم الطلب
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

    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
        orderForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name")?.value.trim();
            let phone = document.getElementById("phone")?.value.trim();
            let country = document.getElementById("country")?.value.trim();
            let city = document.getElementById("city")?.value.trim();
            let address = document.getElementById("address")?.value.trim();
            let postalCode = document.getElementById("postalCode")?.value.trim();
            let quantity = document.getElementById("quantity")?.value;
            let totalPrice = document.getElementById("total-price")?.textContent;

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
    }

    // ✅ تتبع الطلب باستخدام 17Track
    function trackOrder() {
        let trackingNumber = document.getElementById("trackingNumber")?.value.trim();
        if (trackingNumber) {
            window.open(`https://www.17track.net/en/track?nums=${trackingNumber}`, "_blank");
        } else {
            const trackingResult = document.getElementById("trackingResult");
            if (trackingResult) {
                trackingResult.innerText = "❌ Please enter a valid tracking number.";
            }
        }
    }

    const trackButton = document.getElementById("trackButton");
    if (trackButton) {
        trackButton.addEventListener("click", trackOrder);
    }

    // ✅ تفعيل العداد التنازلي وأكواد الخصم
    const discountCodes = ["SAVE10", "FLASH20", "DEAL30", "OFFER15"];
    const randomCode = discountCodes[Math.floor(Math.random() * discountCodes.length)];
    const discountCodeElement = document.getElementById("discount-code");
    if (discountCodeElement) {
        discountCodeElement.textContent = randomCode;
    }

    // ✅ تحديد وقت انتهاء العرض
    const countdownTime = new Date().getTime() + (24 * 60 * 60 * 1000);

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = countdownTime - now;
        const countdownElement = document.getElementById("countdown-timer");

        if (countdownElement) {
            if (timeLeft <= 0) {
                countdownElement.textContent = "EXPIRED!";
            } else {
                const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
                const seconds = Math.floor((timeLeft / 1000) % 60);

                countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
