// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.className = 'fas fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    eyeIcon.className = 'fas fa-eye';
  }
});

// Form Submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    showNotification('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 'error');
    return;
  }

  // Show loading
  showLoading();

  // Simulate login process
  setTimeout(() => {
    hideLoading();

    // Simulate success (ในแอปจริงให้เชื่อม API)
    if (username && password) {
      showNotification('เข้าสู่ระบบสำเร็จ!', 'success');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      showNotification('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
  }, 2000);
});

// Loading Functions
function showLoading() {
  document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const bgColor =
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const icon =
    type === 'success'
      ? 'fa-check-circle'
      : type === 'error'
      ? 'fa-exclamation-circle'
      : 'fa-info-circle';

  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
  notification.innerHTML = `
      <div class="flex items-center space-x-3">
          <i class="fas ${icon}"></i>
          <span>${message}</span>
      </div>
  `;

  document.body.appendChild(notification);

  // Slide in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Input Focus Effects
const inputs = document.querySelectorAll('input');
inputs.forEach((input) => {
  input.addEventListener('focus', function () {
    this.parentElement.classList.add('scale-105');
  });

  input.addEventListener('blur', function () {
    this.parentElement.classList.remove('scale-105');
  });
});

// Keyboard Shortcuts
document.addEventListener('keydown', function (e) {
  // Enter to submit form
  if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
  }

  // Escape to clear form
  if (e.key === 'Escape') {
    document.getElementById('loginForm').reset();
  }
});

// Parallax Effect for Background Floating Elements
document.addEventListener('mousemove', function (e) {
  const floatingElements = document.querySelectorAll('.floating');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  floatingElements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - 0.5) * speed * 20;
    const y = (mouseY - 0.5) * speed * 20;

    element.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// Auto-focus on first input
window.addEventListener('load', function () {
  document.getElementById('username').focus();
});

// Form validation styling
function validateInput(input) {
  if (input.validity.valid) {
    input.classList.remove('border-red-500');
    input.classList.add('border-green-500');
  } else {
    input.classList.remove('border-green-500');
    input.classList.add('border-red-500');
  }
}

inputs.forEach((input) => {
  input.addEventListener('input', function () {
    validateInput(this);
  });
});
