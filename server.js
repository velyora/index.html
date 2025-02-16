const express = require("express");
const fs = require("fs");
const cors = require("cors"); // السماح بالوصول من المتصفح
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// ✅ تحميل جميع التقييمات من `reviews.json`
app.get("/reviews", (req, res) => {
    fs.readFile("reviews.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "❌ خطأ في تحميل التقييمات" });
        }
        res.json(JSON.parse(data));
    });
});

// ✅ إضافة تقييم جديد إلى `reviews.json`
app.post("/reviews", (req, res) => {
    fs.readFile("reviews.json", "utf8", (err, data) => {
        let reviews = [];
        if (!err && data) {
            reviews = JSON.parse(data);
        }
        reviews.push(req.body);

        fs.writeFile("reviews.json", JSON.stringify(reviews, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "❌ خطأ في حفظ التقييم" });
            }
            res.json({ message: "✅ تم حفظ التقييم بنجاح!" });
        });
    });
});

// ✅ حذف تقييم معين باستخدام `index`
app.delete("/reviews/:index", (req, res) => {
    fs.readFile("reviews.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "❌ خطأ في تحميل التقييمات" });
        }
        let reviews = JSON.parse(data);
        reviews.splice(req.params.index, 1);

        fs.writeFile("reviews.json", JSON.stringify(reviews, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "❌ خطأ في حذف التقييم" });
            }
            res.json({ message: "🗑️ تم حذف التقييم بنجاح!" });
        });
    });
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`));
