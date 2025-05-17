import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

  const firebaseConfig = {apiKey: "AIzaSyClBErlyRv20HwMf_zQC7REsZEknaFjs_8", authDomain: "website-61783.firebaseapp.com", projectId: "website-61783", storageBucket: "website-61783.firebasestorage.app", messagingSenderId: "437361977695", appId: "1:437361977695:web:7e1069062bfaca0f02aeea", measurementId: "G-0X5NV4YK2V"
  };
function escapeHTML(str) {
    const lines = str.split('\n');

    // Hapus baris kosong di awal
    while (lines.length && lines[0].trim() === '') {
        lines.shift();
    }

    // Hapus baris kosong di akhir
    while (lines.length && lines[lines.length - 1].trim() === '') {
        lines.pop();
    }

    // Proses dan escape, dengan hanya satu baris kosong di antara
    const result = [];
    let lastEmpty = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === '') {
            if (!lastEmpty) {
                result.push(''); // Simpan satu baris kosong
                lastEmpty = true;
            }
            // Jika sudah baris kosong sebelumnya, lewati
        } else {
            result.push(
                line
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;")
            );
            lastEmpty = false;
        }
    }

    return result.join('<br>');
}
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Menampilkan komentar realtime
  const tampilData = () => {
    const container = document.getElementById("data-container");
    const q = query(collection(db, "uploads"), orderBy("waktu", "desc"));
    onSnapshot(q, (snapshot) => {
      container.innerHTML = "";
      if (snapshot.empty) {
        container.innerHTML = `<p class="text-center text-gray-400" style="margin-top: 10px;">Belum ada komentar.</p>`;
        return;
      }

      snapshot.forEach(doc => {
        const item = doc.data();
        container.innerHTML += `
       <div class="bg-card p-3 rounded-2xl relative group transition-transform duration-200" style="border-radius: 5px; border-left: 4px solid #8b5cf6; box-shadow: 0px 1px 15px rgba(0,0,0,0.2); background-color: #2C3842">
            ${!item.pinned ? `
              <div class="absolute top-3 right-4 text-gray-400 rotate-45" style="font-size: 17px;">

              </div>` : ""
            }
            <div class="flex items-center gap-4 text-xl font-semibold text-accent mb-2">
              <div class="flex items-center gap-1" style="font-family: 'Roboto Slab', serif;">
<span style="margin-left: 8px;">${escapeHTML(item.nama.slice(0, 15))}</span>
                ${item.admin ? `<img src="https://azkaarrodhi.vercel.app/cb.png" alt="centang" width="33">` : ""}
                ${item.bahaya ? `<span onclick="openPrompt()" title="Pesan berbahaya" class="text-red-500" style="font-size: 15px; margin-top: 1.5px; margin-left: 2px;"><i class="fas fa-exclamation-circle"></i></span>` : ""}
              </div>
            </div>
<p style="margin-left: 10px; color: #fff; font-family: 'calibri',sans-serif; font-size: 20px; line-height: 1.1; overflow-wrap: anywhere;">
  ${escapeHTML(item.pesan)}
</p>
          <div class="mt-4 text-xs text-gray-400 text-right" style="margin-bottom: -5px;">${item.waktu}</div>
          </div>
        `;
      });
    });
  };

  tampilData();