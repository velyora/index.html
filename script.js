const images = ["product1.jpg", "product2.jpg", "product3.jpg"];
let currentIndex = 0;

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
});

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
});

function updateImage() {
    document.getElementById("productImage").src = images[currentIndex];
}

function changeImage(imageSrc) {
    document.getElementById("productImage").src = imageSrc;
}
