const menuButton = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const backdrop = document.getElementById('side-nav-backdrop');
const links = sideMenu.querySelectorAll('a');
const menuIcon = document.getElementById('menu-icon');
    
function openMenu() {
  menuButton.setAttribute('aria-expanded', 'true');
  sideMenu.classList.add('active');
  sideMenu.setAttribute('aria-expanded', 'true');
  backdrop.classList.add('active');
//  links.forEach(link => link.tabIndex = 0);
//  links[0].focus();
  document.addEventListener('keydown', trapFocus);
  menuIcon.classList.remove('fa-bars');
  menuIcon.classList.add('fa-times');
  document.body.style.overflow = "hidden";
  // Tambahkan animasi shake ke semua <a><span>
  const spanLinks = sideMenu.querySelectorAll('a span');
  spanLinks.forEach(span => {
    span.style.display = 'inline-block'; // pastikan animasi transform bekerja
    setTimeout(() => {
      span.classList.remove('hidden');
      span.classList.add('shake');
    }, 0);
    span.addEventListener('animationend', () => {
      span.classList.remove('shake');
    }, { once: true });
  });

  // Tambahkan animasi fadein ke <img> pertama di sideMenu
  const menuImage = sideMenu.querySelector('img');
  if (menuImage) {
      setTimeout(() => {
    menuImage.classList.remove('hidden');
    menuImage.classList.add('fadein');
   }, 100);
    menuImage.classList.remove('fadeout'); // pastikan fadeout tidak aktif saat dibuka
  }
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  sideMenu.classList.remove('active');
  sideMenu.setAttribute('aria-expanded', 'false');
  backdrop.classList.remove('active');
  links.forEach(link => link.tabIndex = -1);
  document.removeEventListener('keydown', trapFocus);
  menuButton.focus();
  menuIcon.classList.remove('fa-times');
  menuIcon.classList.add('fa-bars');
  document.body.style.overflow = "auto";
  // Tambahkan animasi fadeout ke <img> saat menu ditutup
  const menuImage = sideMenu.querySelector('img');
  if (menuImage) {
    menuImage.classList.add('fadeout');
    menuImage.classList.remove('fadein'); // pastikan fadein tidak aktif saat ditutup
      menuImage.classList.add('hidden');
  }

  // Hapus animasi shake dari semua <a><span>
  const spanLinks = sideMenu.querySelectorAll('a span');
  spanLinks.forEach(span => {
    span.classList.remove('shake');
    span.classList.add('hidden');
  });
}
    
    function trapFocus(e) {
  if (!sideMenu.classList.contains('active')) return;

  const focusableElements = sideMenu.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
}

function toggleMenu() {
    if (sideMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
}

menuButton.addEventListener('click', e => {
    e.stopPropagation();
    toggleMenu();
});

backdrop.addEventListener('click', closeMenu);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
    }
});

document.addEventListener('click', (e) => {
    if (sideMenu.classList.contains('active') && !sideMenu.contains(e.target) && !menuButton.contains(e.target)) {
        closeMenu();
    }
});

links.forEach(link => link.tabIndex = -1);

const input = document.getElementById("nama");
  const warning = document.getElementById("warning");

  input.addEventListener("input", () => {
    if (input.value.length >= 15) {
      input.value = input.value.slice(0, 15); // Potong jika lewat
      warning.classList.remove("hidden");
    } else {
      warning.classList.add("hidden");
    }
  });

  input.addEventListener("click", () => {
    if (input.value.length >= 15) {
      warning.classList.remove("hidden");
    }
  });