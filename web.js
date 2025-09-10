
    import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
    import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyCarCeydm5a_LMfX4KZd33PcXNq1WDkXHk",
      authDomain: "kenalanapp-67f7c.firebaseapp.com",
      projectId: "kenalanapp-67f7c",
      storageBucket: "kenalanapp-67f7c.appspot.com",
      messagingSenderId: "378673436901",
      appId: "1:378673436901:web:5bfcf2467eb2de0d755c0c",
      measurementId: "G-TH1MDJKBES"
    };

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);

    document.querySelector('.btn').addEventListener('click', async () => {
      const nama = prompt("Siapa Namamu?");
      if (!nama) return;

      const wa = prompt("Nomor WA?");
      if (!wa) return alert("Nomor WA tidak boleh kosong.");

      let perangkat = {};
      let lokasi = {};

      // Ambil data perangkat
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

      // Ambil data lokasi
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
      } catch (e) {
        console.warn("Gagal ambil lokasi:", e);
      }

      // Gabungkan semua dan simpan ke Firestore
      try {
        await addDoc(collection(db, "kenalan"), {
          nama,
          wa,
          perangkat,
          lokasi,
          timestamp: new Date()
        });
        alert("Terima kasih, senang berkenalan denganmu! 😊");
      } catch (e) {
        console.error("Gagal mengirim:", e);
        alert("Gagal mengirim data.");
      }
    });
