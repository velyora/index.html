const imageInput = document.getElementById('image-input');
const removeBgButton = document.getElementById('remove-bg');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const downloadButton = document.getElementById('download');
const loadingDiv = document.getElementById('loading');

// عنصر جديد لعرض الأخطاء في الصفحة
const errorDiv = document.createElement("div");
errorDiv.style.color = "red";
errorDiv.style.textAlign = "center";
errorDiv.style.marginTop = "10px";
document.body.appendChild(errorDiv);

// تفعيل الزر فقط عند تحديد صورة
imageInput.addEventListener('change', () => {
  removeBgButton.disabled = !imageInput.files.length;
});

removeBgButton.addEventListener('click', async () => {
  const file = imageInput.files[0];
  if (!file) return;

  // إخفاء الأخطاء السابقة
  errorDiv.innerText = "";
  
  // عرض مؤشر التحميل
  loadingDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
  removeBgButton.disabled = true;

  try {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': '9kHcnd5Nq8CDGKYxkZP8tatj', // استخدم مفتاح API الخاص بك
      },
      body: formData,
    });

    // إذا كان هناك خطأ في الاستجابة
    if (!response.ok) {
      const errorData = await response.json();
      errorDiv.innerText = `❌ خطأ في API: ${errorData.errors[0].title}`;
      throw new Error(errorData.errors[0].title);
    }

    // استعراض الصورة الناتجة
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    resultImage.src = url;
    resultDiv.classList.remove('hidden');

    // إعداد زر التحميل
    downloadButton.onclick = () => {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'no-background.png';
      a.click();
    };
  } catch (error) {
    errorDiv.innerText = `⚠️ حدث خطأ: ${error.message}`;
  } finally {
    loadingDiv.classList.add('hidden');
    removeBgButton.disabled = false;
  }
});
