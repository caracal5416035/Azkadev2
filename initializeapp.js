
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
function showContactPopup(message, type = "success") {
  const popup = document.getElementById("contact-popup");
  const title = document.getElementById("contact-popup-title");
  const icon = document.getElementById("contact-popup-icon");
  const msg = document.getElementById("contact-popup-message");

  msg.innerText = message;

  if (type === "success") {
    title.innerText = "Berhasil!";
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="green" width="48" height="48">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>`;
  } else {
    title.innerText = "Oops...";
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="red" width="48" height="48">
      <line x1="5" y1="5" x2="19" y2="19" stroke="red" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="5" x2="5" y2="19" stroke="red" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  popup.classList.remove("hidden");
}

function closeContactPopup() {
  document.getElementById("contact-popup").classList.add("hidden");
      }
