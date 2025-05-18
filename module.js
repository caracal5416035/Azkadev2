import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyClBErlyRv20HwMf_zQC7REsZEknaFjs_8",
    authDomain: "website-61783.firebaseapp.com",
    projectId: "website-61783",
    storageBucket: "website-61783.appspot.com",
    messagingSenderId: "437361977695",
    appId: "1:437361977695:web:7e1069062bfaca0f02aeea",
    measurementId: "G-0X5NV4YK2V"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const form = document.getElementById('review-form');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const pesan = document.getElementById('b').value.trim();
    const warning = document.getElementById('warning');

    if (nama.length > 15) {
      warning.classList.remove('hidden');
      return;
    } else {
      warning.classList.add('hidden');
    }

    let perangkat = {};
    let lokasi = {};

    try {
      // Ambil info perangkat
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

      // Ambil lokasi IP
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      lokasi = {
        ip: data.ip,
        negara: data.country_name,
        kota: data.city,
        org: data.org
      };
    } catch (err) {
      console.warn("Gagal ambil perangkat/lokasi:", err);
    }

    try {
      await addDoc(collection(db, "uploads"), {
        nama,
        pesan,
        waktu: new Date().toLocaleString("id-ID"),
        pinned: false,
        admin: false,
        bahaya: false,
        perangkat,
        lokasi
      });
      form.reset();
    } catch (err) {
      console.error("Gagal kirim komentar:", err);
      alert("Gagal mengirim komentar.");
    }
  });
