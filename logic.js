 const u = new Date(), b = new Date(2011, 4, 5);
  let a = u.getFullYear() - b.getFullYear();
  if (u < new Date(u.getFullYear(), 4, 5)) a--;
  document.getElementById('txt').textContent = a;