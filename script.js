document.addEventListener("DOMContentLoaded", function () {
    // ✅ API Configuration
    const TELEGRAM_BOT_TOKEN = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A";
    const TELEGRAM_CHAT_ID = "-1002290156309";

    // ✅ Product prices per country
    const prices = {
        "sa": 37, "qa": 35, "ae": 36, "kw": 3, "om": 3.7, "bh": 3.8,
        "eg": 300, "jo": 7, "iq": 14500, "lb": 900000, "us": 10, "gb": 8,
        "de": 9, "fr": 9.5, "tr": 200
    };

    // ✅ Currency per country
    const currencies = {
        "sa": "SAR", "qa": "QAR", "ae": "AED", "kw": "KWD", "om": "OMR",
        "bh": "BHD", "eg": "EGP", "jo": "JOD", "iq": "IQD", "lb": "LBP",
        "us": "USD", "gb": "GBP", "de": "EUR", "fr": "EUR", "tr": "TRY"
    };

    // ✅ Get elements from the page
    let countrySelect = document.getElementById("country");
    let phoneCode = document.getElementById("country-code");
    let quantitySelect = document.getElementById("quantity");
    let priceDisplay = document.getElementById("priceDisplay");
    let orderForm = document.getElementById("orderForm");
    let orderNumberContainer = document.getElementById("orderNumberContainer");
    let orderNumberElement = document.getElementById("orderNumber");

    // ✅ Update country code when changing country
    countrySelect.addEventListener("change", function () {
        let selectedOption = countrySelect.options[countrySelect.selectedIndex];
        let countryCode = selectedOption.getAttribute("data-code");
        phoneCode.textContent = countryCode;
        updatePrice();
    });

    // ✅ Update price when changing country or quantity
    function updatePrice() {
        let country = countrySelect.value;
        let quantity = parseInt(quantitySelect.value) || 1;
        let pricePerPiece = prices[country] || 0;
        let currency = currencies[country] || "USD";
        let totalPrice = pricePerPiece * quantity;

        priceDisplay.textContent = `💰 Price: ${totalPrice.toLocaleString()} ${currency}`;
    }

    quantitySelect.addEventListener("change", updatePrice);
    updatePrice();

    // ✅ Handle order submission
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
            alert("❌ Please fill in all required fields.");
            return;
        }

        // ✅ Hide the form and show success message with order number
        orderForm.classList.add("hidden");
        orderNumberElement.textContent = `✅ Your Order Number: ${orderNumber}`;
        orderNumberContainer.classList.remove("hidden");

        // ✅ Reset form and hide message after 100 seconds
        setTimeout(() => {
            orderNumberContainer.classList.add("hidden");
            orderForm.reset();
            orderForm.classList.remove("hidden");
            updatePrice();
        }, 100000);

        // ✅ Send order details to Telegram
        let message = `📢 *New Order!* 🚀\n\n` +
                      `🔢 *Order Number:* ${orderNumber}\n` +
                      `👤 *Name:* ${name}\n` +
                      `🌍 *Country:* ${countryName}\n` +
                      `🏙️ *City:* ${city}\n` +
                      `📍 *Address:* ${address}\n` +
                      `📬 *Postal Code:* ${postalCode}\n` +
                      `📞 *Phone:* ${phone}\n` +
                      `🛒 *Quantity:* ${quantity} pcs\n` +
                      `${totalPrice}`;

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        }).catch(error => console.error("Telegram API error:", error));
    });
});
