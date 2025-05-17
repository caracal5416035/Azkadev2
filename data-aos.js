const overlay = document.getElementById("customOverlay");
  const alertBox = document.getElementById("alertBox");
  const passwordInput = document.getElementById("passwordInput");
  const errorMsg = document.getElementById("errorMsg");

  function openPrompt() {
    overlay.style.display = 'flex';
    passwordInput.value = '';
    errorMsg.style.display = 'none';
    alertBox.classList.add("scale-in");
    document.body.style.overflow = 'hidden';
  }

  function closePrompt() {
    alertBox.classList.remove('scale-in');
    alertBox.classList.add('scale-out');
    setTimeout(() => {
      overlay.style.display = 'none';
      alertBox.classList.remove('scale-out');
      document.body.style.overflow = 'auto';
    }, 90);
  }

