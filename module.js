import{initializeApp as i}from"https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import{getFirestore as g,collection as c,addDoc as a,serverTimestamp as st}from"https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const x={apiKey:"AIzaSyClBErlyRv20HwMf_zQC7REsZEknaFjs_8",
authDomain:"website-61783.firebaseapp.com",
projectId:"website-61783",
storageBucket:"website-61783.appspot.com",
messagingSenderId:"437361977695",
appId:"1:437361977695:web:7e1069062bfaca0f02aeea",
measurementId:"G-0X5NV4YK2V"};

const y=i(x),z=g(y),f=document.getElementById("review-form");

f.addEventListener("submit",async e=>{
  e.preventDefault();
  const n=document.getElementById("nama").value.trim(),
        m=document.getElementById("b").value.trim(),
        w=document.getElementById("warning");

  if(n.length>15){
    w.classList.remove("hidden");
    return;
  } else w.classList.add("hidden");

  let d={},l={};
  try{
    if(navigator.userAgentData){
      const u=await navigator.userAgentData.getHighEntropyValues(["model","platform","platformVersion","architecture","bitness","fullVersionList"]);
      d={model:u.model||null,platform:u.platform,platformVersion:u.platformVersion,architecture:u.architecture,bitness:u.bitness,browser:u.fullVersionList.map(b=>`${b.brand} ${b.version}`).join(", ")};
    } else d={userAgent:navigator.userAgent};

    const r=await fetch("https://ipapi.co/json/"),
          j=await r.json();
    l={ip:j.ip,negara:j.country_name,kota:j.city,org:j.org};
  }catch(_){}  

  try {
  await a(c(z,"uploads"), {
    nama:n,
    pesan:m,
    waktu:st(), // waktu server
    pinned:!1,
    admin:!1,
    bahaya:!1,
    perangkat:d,
    lokasi:l
  });
  f.reset();
} catch(err) {
  console.error("Error Firestore:", err);
  // fallback lokal kalau gagal koneksi karena waktu HP rusak
  try {
    await a(c(z,"uploads_backup"), {
      nama:n,
      pesan:m,
      waktu:new Date().toISOString(),
      perangkat:d,
      lokasi:l,
      info:"Fallback local time"
    });
  } catch(e2) {
    window.alert("Gagal mengirim data ke server. Periksa jam HP kamu!");
  }
  }
});
