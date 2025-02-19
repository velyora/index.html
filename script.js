document.addEventListener("DOMContentLoaded", function () {
    // ✅ إعدادات API
    const TELEGRAM_BOT_TOKEN = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A";
    const TELEGRAM_CHAT_ID = "-1002290156309";

    // ✅ أسعار المنتجات حسب الدولة
    const prices = {
        "sa": 37, "qa": 35, "ae": 36, "kw": 3, "om": 3.7, "bh": 3.8
    };

    // ✅ العملات لكل دولة
    const currencies = {
        "sa": "SAR", "qa": "QAR", "ae": "AED", "kw": "KWD", "om": "OMR",
        "bh": "BHD"
    };

    // ✅ عناصر الصفحة
    let countrySelect = document.getElementById("country");
    let phoneCode = document.getElementById("country-code");
    let quantitySelect = document.getElementById("quantity");
    let priceDisplay = document.getElementById("priceDisplay");
    let orderForm = document.getElementById("orderForm");

    // ✅ تحديث السعر عند تغيير الدولة أو الكمية
    function updatePrice() {
        let country = countrySelect.value;
        let quantity = parseInt(quantitySelect.value) || 1;
        let pricePerPiece = prices[country] || 0;
        let currency = currencies[country] || "USD";
        let totalPrice = pricePerPiece * quantity;

        priceDisplay.textContent = `💰 Price: ${totalPrice.toLocaleString()} ${currency}`;
    }

    countrySelect.addEventListener("change", updatePrice);
    quantitySelect.addEventListener("change", updatePrice);
    updatePrice();

    // ✅ إرسال البيانات إلى تيليجرام
    function sendTelegramMessage(orderData, paymentMethod) {
        let message = `📢 *New Order via ${paymentMethod}!* 🚀\n\n` +
                      `🔢 *Order Number:* ${orderData.id}\n` +
                      `👤 *Name:* ${document.getElementById("name").value}\n` +
                      `🌍 *Country:* ${countrySelect.options[countrySelect.selectedIndex].text}\n` +
                      `🏙️ *City:* ${document.getElementById("city").value}\n` +
                      `📍 *Address:* ${document.getElementById("address").value}\n` +
                      `📬 *Postal Code:* ${document.getElementById("postalCode").value}\n` +
                      `📞 *Phone:* ${document.getElementById("phone").value}\n` +
                      `🛒 *Quantity:* ${quantitySelect.value} pcs\n` +
                      `💰 *Total Price:* ${priceDisplay.textContent}`;

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

    // ✅ إعداد PayPal
    paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: '10.00' }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('✅ تم الدفع بنجاح بواسطة PayPal: ' + details.payer.name.given_name);
                sendTelegramMessage(details, "PayPal");
            });
        }
    }).render('#paypal-button-container');

    // ✅ إعداد الدفع بالبطاقة
    paypal.CardFields().render('#card-container').then(function(card) {
        document.getElementById("card-button").disabled = false;
        document.getElementById("card-button").addEventListener("click", function() {
            card.submit().then(function(orderData) {
                alert("✅ تم الدفع بنجاح بالبطاقة!");
                sendTelegramMessage(orderData, "بطاقة الائتمان");
            });
        });
    });
});
