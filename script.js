document.addEventListener("DOMContentLoaded", function () {
    const orderForm = document.getElementById("orderForm");
    const orderButton = document.querySelector(".btn-glow");

    orderForm.addEventListener("submit", function (event) {
        event.preventDefault(); // إيقاف إعادة تحميل الصفحة

        // تغيير لون الزر
        orderButton.style.backgroundColor = "#28a745";
        orderButton.textContent = "✅ تم إرسال الطلب بنجاح";

        // عرض رسالة نجاح
        alert("✅ تم إرسال الطلب بنجاح! سيتم التواصل معك في أسرع وقت ممكن.");
    });
});
