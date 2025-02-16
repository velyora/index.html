document.addEventListener("DOMContentLoaded", function () {
    // ✅ تعريف متغيرات API
    const JSONBIN_API = "https://api.jsonbin.io/v3/b/67b25350acd3cb34a8e4bf28";
    const JSONBIN_SECRET = "$2a$10$cR8U3fnhRtMfoC722GP31eOWZghfYOja3xo8ZR0OxFM/MbMyG2viq"; // مفتاح JSONBin
    const TELEGRAM_BOT_TOKEN = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A"; // توكين تيليجرام
    const TELEGRAM_CHAT_ID = "-1002290156309"; // معرف تيليجرام

    // ✅ جلب عناصر الصفحة
    let countrySelect = document.getElementById("country");
    let phoneCode = document.getElementById("country-code");
    let quantitySelect = document.getElementById("quantity");
    let priceDisplay = document.getElementById("priceDisplay");
    let reviewForm = document.getElementById("reviewForm");
    let reviewsList = document.getElementById("reviewsList");
    let orderForm = document.getElementById("orderForm");
    let adminLoginButton = document.getElementById("adminLoginFooter");
    let logoutButton = document.getElementById("logoutAdmin");
    let orderNumberContainer = document.getElementById("orderNumberContainer");
    let orderNumberElement = document.getElementById("orderNumber");
    
    const ADMIN_PASSWORD = "123456"; // كلمة مرور المالك

    // ✅ أسعار المنتج لكل دولة
    const prices = {
        "sa": 37, "qa": 35, "ae": 36, "kw": 3, "om": 3.7, "bh": 3.8,
        "eg": 300, "jo": 7, "iq": 14500, "lb": 900000
    };

    const currencies = {
        "sa": "ريال", "qa": "ريال", "ae": "درهم", "kw": "دينار", "om": "ريال",
        "bh": "دينار", "eg": "جنيه", "jo": "دينار", "iq": "دينار", "lb": "ليرة"
    };

    // ✅ تحديث السعر عند تغيير الدولة أو الكمية
    function updatePrice() {
        let country = countrySelect.value;
        let quantity = parseInt(quantitySelect.value) || 1;
        let pricePerPiece = prices[country] || 0;
        let currency = currencies[country] || "";
        let totalPrice = pricePerPiece * quantity;
        priceDisplay.textContent = `💰 السعر: ${totalPrice.toLocaleString()} ${currency}`;
    }

    countrySelect.addEventListener("change", function () {
        let selectedOption = countrySelect.options[countrySelect.selectedIndex];
        let countryCode = selectedOption.getAttribute("data-code");
        phoneCode.textContent = countryCode;
        updatePrice();
    });

    quantitySelect.addEventListener("change", updatePrice);
    updatePrice();

    // ✅ إرسال الطلب إلى تيليجرام
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
        let orderNumber = Math.floor(100000 + Math.random() * 900000); // توليد رقم الطلب

        if (!name || !phone || !city || !address || !postalCode) {
            alert("❌ يرجى تعبئة جميع الحقول المطلوبة.");
            return;
        }

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
                      `🚚 *مدة الشحن:* من 1 إلى 7 أيام\n\n` +
                      `✅ *تم إرسال الطلب بنجاح!*`;

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        }).then(response => response.json())
          .then(data => {
              if (data.ok) {
                  orderForm.classList.add("hidden");
                  orderNumberElement.textContent = orderNumber;
                  orderNumberContainer.classList.remove("hidden");
              } else {
                  alert("⚠️ حدث خطأ أثناء إرسال الطلب.");
              }
          })
          .catch(error => console.error("❌ خطأ:", error));
    });

    // ✅ تحميل التقييمات من JSONBin
    function loadReviews() {
        fetch(JSONBIN_API + "/latest", {
            method: "GET",
            headers: { "X-Master-Key": JSONBIN_SECRET }
        })
        .then(response => response.json())
        .then(data => {
            let reviews = data.record.reviews || [];
            reviewsList.innerHTML = "";
            if (reviews.length === 0) {
                reviewsList.innerHTML = `<p class="text-gray-700">لا توجد تقييمات بعد.</p>`;
            } else {
                reviews.forEach((review, index) => {
                    let reviewElement = document.createElement("div");
                    reviewElement.classList = "review bg-white p-3 rounded-lg shadow-md mt-2";
                    reviewElement.innerHTML = `
                        <span><strong>${review.rating} ${review.name}:</strong> ${review.comment}</span>
                    `;
                    reviewsList.appendChild(reviewElement);
                });
            }
        })
        .catch(error => console.error("❌ خطأ في تحميل التقييمات:", error));
    }

    loadReviews();

    // ✅ إضافة التقييمات إلى JSONBin
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("reviewerName").value.trim();
        let rating = document.getElementById("reviewRating").value;
        let comment = document.getElementById("reviewText").value.trim();

        if (!name || !comment) {
            alert("❌ يرجى إدخال الاسم والتعليق.");
            return;
        }

        fetch(JSONBIN_API + "/latest", {
            method: "GET",
            headers: { "X-Master-Key": JSONBIN_SECRET }
        })
        .then(response => response.json())
        .then(data => {
            let reviews = data.record.reviews || [];
            reviews.push({ name, rating, comment });

            return fetch(JSONBIN_API, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": JSONBIN_SECRET
                },
                body: JSON.stringify({ reviews })
            });
        })
        .then(() => {
            alert("✅ تم حفظ التقييم بنجاح!");
            loadReviews();
            reviewForm.reset();
        })
        .catch(error => console.error("❌ خطأ في إضافة التقييم:", error));
    });

    // ✅ تسجيل الدخول للمالك
    adminLoginButton.addEventListener("click", function () {
        let password = prompt("🔑 أدخل كلمة المرور:");
        if (password === ADMIN_PASSWORD) {
            alert("✅ تسجيل الدخول ناجح!");
            logoutButton.classList.remove("hidden");
        } else {
            alert("❌ كلمة المرور غير صحيحة.");
        }
    });

    // ✅ تسجيل الخروج للمالك
    logoutButton.addEventListener("click", function () {
        logoutButton.classList.add("hidden");
        alert("🚪 تم تسجيل الخروج بنجاح.");
    });
});
