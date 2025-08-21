const intitialUserData = {
  username: "",
  password: "",
};

const testFetch = async (str) => {
  const res = await fetch(`/validate?str=${encodeURIComponent(str)}`);
  if (res.ok) {
    const data = await res.json();
    console.log(data);
  } else {
    console.log("Failed to Fetch");
  }
};

testFetch("asdasd");
let userData = intitialUserData;
const setUserData = (data) => {
  userData = data;
};

const handleChange = (e) => {
  const { id, value } = e.target;
  setUserData({
    ...userData,
    [id]: value,
  });
};

// Toggle Password Visibility
document.getElementById("username").addEventListener("input", handleChange);
document.getElementById("password").addEventListener("input", handleChange);

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.className = "fas fa-eye-slash";
    } else {
      passwordInput.type = "password";
      eyeIcon.className = "fas fa-eye";
    }
  });
const onChange =
  // Form Submission
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = userData.username.trim();
      const password = userData.password.trim();

      if (!username || !password) {
        showNotification("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", "error");
        return;
      }

      // Show loading
      showLoading();
      const res = await fetch(`/login/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setTimeout(() => {
          hideLoading();
          showNotification("เข้าสู่ระบบสำเร็จ!", "success");
          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }, 2000);
      } else {
        hideLoading();
        const data = await res.json();
        console.log(data);
        showNotification("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "error");
      }
    });

// Loading Functions
function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";
  const icon =
    type === "success"
      ? "fa-check-circle"
      : type === "error"
      ? "fa-exclamation-circle"
      : "fa-info-circle";

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
    notification.classList.remove("translate-x-full");
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Input Focus Effects
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.classList.add("scale-105");
  });

  input.addEventListener("blur", function () {
    this.parentElement.classList.remove("scale-105");
  });
});

// Keyboard Shortcuts
document.addEventListener("keydown", function (e) {
  // Enter to submit form
  if (e.key === "Enter" && document.activeElement.tagName !== "BUTTON") {
    document.getElementById("loginForm").dispatchEvent(new Event("submit"));
  }

  // Escape to clear form
  if (e.key === "Escape") {
    document.getElementById("loginForm").reset();
  }
});

// Parallax Effect for Background Floating Elements
document.addEventListener("mousemove", function (e) {
  const floatingElements = document.querySelectorAll(".floating");
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
window.addEventListener("load", function () {
  document.getElementById("username").focus();
});

// Form validation styling
function validateInput(input) {
  if (input.validity.valid) {
    input.classList.remove("border-red-500");
    input.classList.add("border-green-500");
  } else {
    input.classList.remove("border-green-500");
    input.classList.add("border-red-500");
  }
}

inputs.forEach((input) => {
  input.addEventListener("input", function () {
    validateInput(this);
  });
});
