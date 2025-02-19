function trackOrder() {
    let trackingNumber = document.getElementById("trackingNumber").value.trim();
    if (trackingNumber) {
        window.open(`https://www.17track.net/en/track?nums=${trackingNumber}`, "_blank");
    } else {
        document.getElementById("trackingResult").innerText = "❌ Please enter a valid tracking number.";
    }
}
