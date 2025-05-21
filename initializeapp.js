
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyClBErlyRv20HwMf_zQC7REsZEknaFjs_8",
    authDomain: "website-61783.firebaseapp.com",
    projectId: "website-61783",
    storageBucket: "website-61783.appspot.com",
    messagingSenderId: "437361977695",
    appId: "1:437361977695:web:bc0b00847f6a562102aeea",
    measurementId: "G-510EVLJET1"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('form-status');

    // Reset error display
    document.getElementById('name-error').style.display = 'none';
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('message-error').style.display = 'none';

    if (!name || !email || !message) {
      if (!name) document.getElementById('name-error').style.display = 'block';
      if (!email) document.getElementById('email-error').style.display = 'block';
      if (!message) document.getElementById('message-error').style.display = 'block';
      return;
    }

    // Ambil data perangkat
    let perangkat = {};
    if (navigator.userAgentData) {
      const ua = await navigator.userAgentData.getHighEntropyValues([
        "model", "platform", "platformVersion", "architecture", "bitness", "fullVersionList"
      ]);
      perangkat = {
        model: ua.model || null,
        platform: ua.platform,
        platformVersion: ua.platformVersion,
        architecture: ua.architecture,
        bitness: ua.bitness,
        browser: ua.fullVersionList.map(b => `${b.brand} ${b.version}`).join(', ')
      };
    } else {
      perangkat = { userAgent: navigator.userAgent };
    }
    let lokasi = {};
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      lokasi = {
        ip: data.ip,
        negara: data.country_name,
        kodeNegara: data.country,
        kota: data.city,
        org: data.org
      };
    } catch (err) {
      console.warn("Gagal ambil lokasi:", err);
    }

    // Simpan ke Firestore
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        timestamp: new Date(),
        perangkat,
        lokasi
      });

      status.style.display = 'block';
      status.style.color = '#1976d2';
      showPopup("Pesan berhasil dikirim!", "success");
      document.getElementById('contact-form').reset();
    } catch (error) {
      console.error("Gagal kirim:", error);
      status.style.display = 'block';
      status.style.color = '#d32f2f';
      showPopup("Gagal mengirim pesan, silakan coba lagi nanti.", "error");
    }
  });
function showPopup(message, type = "success") {
  const popup = document.getElementById("popup-alert");
  const title = document.getElementById("popup-title");
  const icon = document.getElementById("popup-icon");
  const msg = document.getElementById("popup-message");

  msg.innerText = message;

  if (type === "success") {
    popup.classList.remove("error");
    popup.classList.add("success");
    icon.innerText = "✓";
    title.innerText = "Berhasil!";
  } else {
    popup.classList.remove("success");
    popup.classList.add("error");
    icon.innerHTML = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="20" x2="80" y2="80" stroke="#e53935" stroke-width="12" stroke-linecap="round"/>
  <line x1="80" y1="20" x2="20" y2="80" stroke="#e53935" stroke-width="12" stroke-linecap="round"/>
</svg>`;
    title.innerText = "Oops...";
  }

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup-alert").classList.add("hidden");
}
