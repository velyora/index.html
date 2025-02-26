const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ffmpeg = FFmpeg.createFFmpeg({ log: true });
const pexelsVideo = document.getElementById("pexelsVideo");
const errorMsg = document.getElementById("errorMsg");

// ✅ مفتاح API من Pexels (تأكد من أنه مفعل وصحيح)
const PEXELS_API_KEY = "tgNsoLFJcxLOaI6li871yIXckVae2iBVn9eZEVE5nA3t6KXuNUjrb8s8";

// 🖼️ جلب فيديو من Pexels وتحسين عرض الأخطاء
async function fetchPexelsVideo() {
    const query = "nature"; // يمكنك تغييره إلى "mosque" أو أي كلمة أخرى
    errorMsg.style.display = "none"; // إخفاء أي خطأ سابق

    try {
        console.log("⏳ جاري تحميل الفيديو من Pexels API...");

        // إرسال الطلب إلى Pexels API
        const response = await fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=1`, {
            headers: { Authorization: PEXELS_API_KEY }
        });

        if (!response.ok) {
            throw new Error(`❌ خطأ في API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.videos.length > 0) {
            const videoUrl = data.videos[0].video_files[0].link;
            console.log("✅ تم العثور على فيديو:", videoUrl);

            // تحديث الفيديو في الصفحة
            pexelsVideo.src = videoUrl;
            pexelsVideo.load();
            pexelsVideo.style.display = "block";

        } else {
            throw new Error("⚠️ لم يتم العثور على فيديو، جرب كلمة مفتاحية أخرى.");
        }
    } catch (error) {
        console.error("❌ خطأ أثناء جلب الفيديو:", error);
        errorMsg.innerText = error.message;
        errorMsg.style.display = "block";
    }
}

// 🎬 إنشاء فيديو نهائي
async function generateVideo() {
    const verseText = document.getElementById("verseText").value;
    const audioFile = document.getElementById("audioFile").files[0];

    if (!verseText || !audioFile || !pexelsVideo.src) {
        alert("⚠️ يرجى إدخال الآية، اختيار ملف الصوت، وجلب فيديو خلفية!");
        return;
    }

    // التأكد من تحميل الفيديو قبل معالجته
    pexelsVideo.onloadeddata = async function () {
        console.log("✅ الفيديو جاهز للمعالجة");

        // 🖼️ رسم الآية على صورة
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText(verseText, canvas.width / 2, canvas.height / 2);

        const imageUrl = canvas.toDataURL("image/png");
        const imageBlob = await fetch(imageUrl).then(res => res.blob());
        const imageFile = new File([imageBlob], "overlay.png", { type: "image/png" });

        try {
            // 🎵 تحميل FFmpeg.js
            console.log("⏳ تحميل FFmpeg.js...");
            await ffmpeg.load();

            ffmpeg.FS("writeFile", "overlay.png", new Uint8Array(await imageFile.arrayBuffer()));
            ffmpeg.FS("writeFile", "audio.mp3", new Uint8Array(await audioFile.arrayBuffer()));

            // 🏞️ تحميل فيديو Pexels وحفظه في FFmpeg.js
            console.log("⏳ تحميل الفيديو...");
            const videoResponse = await fetch(pexelsVideo.src);
            const videoBlob = await videoResponse.blob();
            const videoFile = new File([videoBlob], "background.mp4", { type: "video/mp4" });

            ffmpeg.FS("writeFile", "background.mp4", new Uint8Array(await videoFile.arrayBuffer()));

            // 🎬 دمج الفيديو مع الصوت وإضافة النص كصورة متراكبة
            console.log("⏳ دمج الفيديو مع الصوت...");
            await ffmpeg.run(
                "-i", "background.mp4",
                "-i", "overlay.png",
                "-filter_complex", "[0:v][1:v] overlay=W/4:H/2",
                "-i", "audio.mp3",
                "-c:v", "libx264", "-c:a", "aac",
                "-shortest", "output.mp4"
            );

            // 📥 استخراج الفيديو النهائي
            console.log("✅ الفيديو جاهز!");
            const videoData = ffmpeg.FS("readFile", "output.mp4");
            const finalVideoBlob = new Blob([videoData.buffer], { type: "video/mp4" });
            const finalVideoUrl = URL.createObjectURL(finalVideoBlob);

            // 🔗 عرض رابط التحميل
            const downloadLink = document.getElementById("downloadLink");
            downloadLink.href = finalVideoUrl;
            downloadLink.download = "quran_video.mp4";
            downloadLink.innerText = "⬇️ تحميل الفيديو";
            downloadLink.style.display = "block";

        } catch (error) {
            console.error("❌ خطأ أثناء إنشاء الفيديو:", error);
            errorMsg.innerText = "حدث خطأ أثناء معالجة الفيديو.";
            errorMsg.style.display = "block";
        }
    };
}
