const imageInput = document.getElementById('image-input');
const removeBgButton = document.getElementById('remove-bg');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const downloadButton = document.getElementById('download');
const loadingDiv = document.getElementById('loading');

// تفعيل الزر فقط عند تحديد صورة
imageInput.addEventListener('change', () => {
  removeBgButton.disabled = !imageInput.files.length;
});

removeBgButton.addEventListener('click', async () => {
  const file = imageInput.files[0];
  if (!file) return;

  // عرض مؤشر التحميل
  loadingDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
  removeBgButton.disabled = true;

  try {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto'); // تحسين جودة الصورة بعد إزالة الخلفية

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': '9kHcnd5Nq8CDGKYxkZP8tatj', // مفتاح API الصحيح
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('خطأ في API:', errorData);
      throw new Error('فشل في إزالة الخلفية: ' + errorData.errors[0].title);
    }

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
    alert('حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.');
    console.error('تفاصيل الخطأ:', error);
  } finally {
    loadingDiv.classList.add('hidden');
    removeBgButton.disabled = false;
  }
});
