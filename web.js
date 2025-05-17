
 // Import Firebase SDK
  import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

  // Konfigurasi Firebase kamu
  const firebaseConfig = {
    apiKey: "AIzaSyCarCeydm5a_LMfX4KZd33PcXNq1WDkXHk",
    authDomain: "kenalanapp-67f7c.firebaseapp.com",
    projectId: "kenalanapp-67f7c",
    storageBucket: "kenalanapp-67f7c.firebasestorage.app",
    messagingSenderId: "378673436901",
    appId: "1:378673436901:web:5bfcf2467eb2de0d755c0c",
    measurementId: "G-TH1MDJKBES"
  };

  // Cegah duplikasi inisialisasi
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  // Logika tombol Kenalan
  document.querySelector('.btn').addEventListener('click', async () => {
    const nama = prompt("Siapa Namamu?");
    if (!nama) return;

    const wa = prompt("Nomor WA?");
    if (!wa) return alert("Nomor WA tidak boleh kosong.");

    try {
      await addDoc(collection(db, "kenalan"), {
        nama: nama,
        wa: wa,
        timestamp: new Date()
      });
      alert("Terimakasih, senang berkenalan denganmu! 😊");
    } catch (e) {
      console.error("Gagal kirim:", e);
      alert("Gagal mengirim data.");
    }
  });
