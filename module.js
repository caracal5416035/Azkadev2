import { initializeApp as i } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore as g,
  collection as c,
  addDoc as a
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const x = {
  apiKey: "AIzaSyClBErlyRv20HwMf_zQC7REsZEknaFjs_8",
  authDomain: "website-61783.firebaseapp.com",
  projectId: "website-61783",
  storageBucket: "website-61783.appspot.com",
  messagingSenderId: "437361977695",
  appId: "1:437361977695:web:7e1069062bfaca0f02aeea",
  measurementId: "G-0X5NV4YK2V"
};

const y = i(x);
const z = g(y);

const f = document.getElementById("review-form");

f.addEventListener("submit", async e => {
  e.preventDefault();
  
  const n = document.getElementById("nama").value.trim();
  const m = document.getElementById("b").value.trim();
  const w = document.getElementById("warning");

  if (n.length > 15) {
    w.classList.remove("hidden");
    return;
  } else {
    w.classList.add("hidden");
  }

  let d = {}, l = {};

  try {
    if (navigator.userAgentData) {
      const u = await navigator.userAgentData.getHighEntropyValues(["model","platform","platformVersion","architecture","bitness","fullVersionList"]);
      d = {
        model: u.model || null,
        platform: u.platform,
        platformVersion: u.platformVersion,
        architecture: u.architecture,
        bitness: u.bitness,
        browser: u.fullVersionList.map(b => `${b.brand} ${b.version}`).join(", ")
      };
    } else {
      d = { userAgent: navigator.userAgent };
    }

    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    l = { ip: j.ip, negara: j.country_name, kota: j.city, org: j.org };
  } catch (_) {}

  try {
    await a(c(z, "uploads"), {
      nama: n,
      pesan: m,
      pinned: false,
      admin: false,
      bahaya: false,
      perangkat: d,
      lokasi: l
      // Tidak ada field waktu — server akan isi otomatis (GMT+7)
    });

    f.reset();
    alert("Komentar berhasil dikirim!");
  } catch (_) {
    alert("Gagal mengirim komentar.");
  }
});
