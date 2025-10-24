import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// --- Konfigurasi Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyClBErlyRv20HwMf_zQC7REsZEknaFjs_8",
  authDomain: "website-61783.firebaseapp.com",
  projectId: "website-61783",
  storageBucket: "website-61783.appspot.com",
  messagingSenderId: "437361977695",
  appId: "1:437361977695:web:7e1069062bfaca0f02aeea",
  measurementId: "G-0X5NV4YK2V"
};

// --- Inisialisasi Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Jalankan otomatis ---
(async () => {
  let perangkat = {}, lokasi = {}, browser = {}, layar = {};
  const zonaWaktu = Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    // --- Deteksi perangkat ---
    if (navigator.userAgentData) {
      const info = await navigator.userAgentData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion"
      ]);
      perangkat = {
        model: info.model || "Tidak diketahui",
        os: info.platform + " " + info.platformVersion
      };
    } else {
      perangkat = {
        model: "Tidak diketahui",
        os: navigator.platform || "Tidak diketahui"
      };
    }

    // --- Data browser & layar ---
    browser = {
      userAgent: navigator.userAgent,
      bahasa: navigator.language
    };
    layar = {
      resolusi: `${window.screen.width}x${window.screen.height}`,
      pixelRatio: window.devicePixelRatio || 1
    };

    // --- Ambil lokasi dari API eksternal ---
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    lokasi = {
      ip: data.ip,
      negara: data.country_name,
      kota: data.city,
      isp: data.org,
      kode_pos: data.postal,
      kode_negara: data.country,
      benua: data.continent_code,
      timezone: data.timezone
    };

    // --- Simpan data ke Firestore ---
    await addDoc(collection(db, "pengunjung"), {
      model: perangkat.model,
      os: perangkat.os,
      browser: browser.userAgent,
      bahasa: browser.bahasa,
      layar: layar.resolusi,
      pixelRatio: layar.pixelRatio,
      ip: lokasi.ip,
      negara: lokasi.negara,
      kode_negara: lokasi.kode_negara,
      kota: lokasi.kota,
      kode_pos: lokasi.kode_pos,
      benua: lokasi.benua,
      isp: lokasi.isp,
      timezone: lokasi.timezone,
      zonaWaktuPerangkat: zonaWaktu,
      waktu: serverTimestamp() // 🕒 waktu Firestore server
    });

    console.log("✅ Data pengunjung tersimpan dengan waktu server Firestore");
  } catch (err) {
    console.error("❌ Gagal menyimpan data:", err);
  }
})();
