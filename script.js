document.addEventListener("DOMContentLoaded", function () {
    // ✅ تعريف متغيرات API
    const JSONBIN_API = "https://api.jsonbin.io/v3/b/67b25350acd3cb34a8e4bf28";
    const JSONBIN_SECRET = "$2a$10$cR8U3fnhRtMfoC722GP31eOWZghfYOja3xo8ZR0OxFM/MbMyG2viq";
    const TELEGRAM_BOT_TOKEN = "6961886563:AAHZwl-UaAWaGgXwzyp1vazRu1Hf37FKX2A";
    const TELEGRAM_CHAT_ID = "-1002290156309";

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

    // ✅ التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    function checkAdminLogin() {
        let isAdmin = localStorage.getItem("isAdmin") === "true";
        logoutButton.classList.toggle("hidden", !isAdmin);
        loadReviews();
    }

    checkAdminLogin();

    // ✅ تحديث مفتاح الدولة عند تغيير الدولة
    countrySelect.addEventListener("change", function () {
        let selectedOption = countrySelect.options[countrySelect.selectedIndex];
        let countryCode = selectedOption.getAttribute("data-code");
        phoneCode.textContent = countryCode;
        updatePrice();
    });

    // ✅ إرسال الطلب
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
            alert("❌ يرجى تعبئة جميع الحقول المطلوبة.");
            return;
        }

        orderForm.classList.add("hidden");
        orderNumberElement.textContent = `رقم الطلب: ${orderNumber}`;
        orderNumberContainer.classList.remove("hidden");
        setTimeout(() => {
            orderNumberContainer.classList.add("hidden");
            orderForm.classList.remove("hidden");
        }, 100000);

        let message = `📢 *طلب جديد!* 🚀\n\n` +
                      `👤 *الاسم:* ${name}\n` +
                      `🌍 *الدولة:* ${countryName}\n` +
                      `🏙️ *المدينة:* ${city}\n` +
                      `📍 *العنوان:* ${address}\n` +
                      `📬 *الرمز البريدي:* ${postalCode}\n` +
                      `📞 *رقم الجوال:* ${phone}\n` +
                      `🛒 *الكمية:* ${quantity} قطع\n` +
                      `${totalPrice}`;

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        });
    });

    // ✅ تحميل التقييمات
    function loadReviews() {
        fetch(`${JSONBIN_API}/latest`, {
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
                    reviewElement.classList = "review p-3 shadow-md";
                    reviewElement.innerHTML = `<strong>${review.rating} ${review.name}:</strong> ${review.comment}`;
                    if (localStorage.getItem("isAdmin") === "true") {
                        let deleteButton = document.createElement("button");
                        deleteButton.textContent = "🗑️";
                        deleteButton.classList = "delete-review text-red-500 ml-2";
                        deleteButton.setAttribute("data-index", index);
                        reviewElement.appendChild(deleteButton);
                    }
                    reviewsList.appendChild(reviewElement);
                });
            }
        });
    }

    loadReviews();

    // ✅ تسجيل الدخول والخروج
    adminLoginButton.addEventListener("click", function () {
        let password = prompt("🔑 أدخل كلمة المرور:");
        if (password === ADMIN_PASSWORD) {
            alert("✅ تسجيل الدخول ناجح!");
            localStorage.setItem("isAdmin", "true");
            checkAdminLogin();
        } else {
            alert("❌ كلمة المرور غير صحيحة.");
        }
    });

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("isAdmin");
        checkAdminLogin();
        alert("🚪 تم تسجيل الخروج بنجاح.");
    });

    // ✅ إضافة التقييم إلى JSONBin
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("reviewerName").value.trim();
        let rating = document.getElementById("reviewRating").value;
        let comment = document.getElementById("reviewText").value.trim();

        if (!name || !comment) {
            alert("❌ يرجى إدخال الاسم والتعليق.");
            return;
        }

        fetch(`${JSONBIN_API}/latest`, {
            method: "GET",
            headers: { "X-Master-Key": JSONBIN_SECRET }
        })
        .then(response => response.json())
        .then(data => {
            let reviews = data.record.reviews || [];
            reviews.push({ name, rating, comment });

            return fetch(JSONBIN_API, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_SECRET },
                body: JSON.stringify({ reviews })
            });
        })
        .then(() => {
            alert("✅ تم حفظ التقييم بنجاح!");
            loadReviews();
            reviewForm.reset();
        });
    });

    // ✅ حذف تعليق معين
    reviewsList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-review")) {
            let index = event.target.getAttribute("data-index");
            fetch(`${JSONBIN_API}/latest`, {
                method: "GET",
                headers: { "X-Master-Key": JSONBIN_SECRET }
            })
            .then(response => response.json())
            .then(data => {
                let reviews = data.record.reviews || [];
                reviews.splice(index, 1);
                return fetch(JSONBIN_API, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_SECRET },
                    body: JSON.stringify({ reviews })
                });
            })
            .then(() => {
                alert("🗑️ تم حذف التقييم!");
                loadReviews();
            });
        }
    });
});
