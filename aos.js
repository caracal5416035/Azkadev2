
document.addEventListener("DOMContentLoaded", function () {
    const typingText = document.getElementById("typing");
    const words = ["Halo, Nama Saya adalah", "Muhammad Azka Arrodhi"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500); // jeda sebelum mulai mengetik ulang
                return;
            }
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 1000); // jeda sebelum mulai menghapus
                return;
            }
        }
        setTimeout(type, isDeleting ? 50 : 100); // kecepatan hapus / ketik
    }

    type();
});
