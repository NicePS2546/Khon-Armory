const intitialUserData = {
  username: "",
  email: "",
  password: "",
};
let currentStep = 1;
const totalSteps = 3;
let userData = intitialUserData;

const setUserData = (data) => {
  userData = data;
  checkPasswordStrength(userData.password);
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
document.getElementById("email").addEventListener("input", handleChange);
document.getElementById("password").addEventListener("input", handleChange);

// Step Navigation
document.getElementById("nextBtn").addEventListener("click", nextStep);
document.getElementById("prevBtn").addEventListener("click", prevStep);

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
      updateProgress();
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgress();
  }
}

function showStep(step) {
  document.querySelectorAll(".step-content").forEach((content) => {
    content.classList.add("hidden");
  });

  document.getElementById(`step-${step}`).classList.remove("hidden");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  prevBtn.classList.toggle("hidden", step === 1);

  if (step === totalSteps) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

function updateProgress() {
  document.getElementById("current-step").textContent = currentStep;

  document.querySelectorAll(".step-indicator").forEach((indicator, index) => {
    indicator.classList.toggle("step-active", index + 1 <= currentStep);
  });
}

function validateStep(step) {
  const stepElement = document.getElementById(`step-${step}`);
  const inputs = stepElement.querySelectorAll(
    'input[required]:not([type="hidden"]):not([disabled])'
  );
  let isValid = true;

  // เคลียร์ error class และ error message ก่อน validate
  inputs.forEach((input) => {
    input.classList.remove(
      "border-red-500",
      "animate-shake",
      "border-green-500"
    );
    const errorSpan = input.parentElement.querySelector(".error-message");
    if (errorSpan) errorSpan.classList.add("hidden");
  });

  inputs.forEach((input) => {
    if (!validateInput(input)) {
      isValid = false;
      // Debug log
      console.log("Invalid input:", input.id, input.value);
    }
  });

  return isValid;
}

function validateInput(input) {
  // หา error-message ที่อยู่ใน div เดียวกับ input
  const errorSpan = input
    .closest(".space-y-2")
    ?.querySelector(".error-message");
  let isValid = true;
  let errorMessage = "";

  input.classList.remove("border-red-500", "animate-shake");
  if (errorSpan) errorSpan.classList.add("hidden");

  if (input.hasAttribute("required") && !input.value.trim()) {
    isValid = false;
    errorMessage = "กรุณากรอกข้อมูล";
  }

  // ...validation เฉพาะ field...

  if (!isValid) {
    input.classList.add("border-red-500", "animate-shake");
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      errorSpan.classList.remove("hidden");
    }
  } else {
    input.classList.remove("border-red-500", "animate-shake");
    if (errorSpan) errorSpan.classList.add("hidden");
  }

  return isValid;
}

// Password Strength Checker
function checkPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthElement = document.getElementById("password-strength");
  const scoreElement = document.getElementById("password-score");
  const indicators = document.querySelectorAll(".step-content .h-2");

  indicators.forEach((indicator) => {
    indicator.className = "h-2 w-full bg-gray-600 rounded";
  });

  if (score <= 2) {
    strengthElement.textContent = "อ่อน";
    strengthElement.className = "strength-weak";
    scoreElement.textContent = "อ่อน";
    for (let i = 0; i < Math.min(score, 2); i++) {
      indicators[i].classList.add("bg-red-500");
    }
  } else if (score <= 3) {
    strengthElement.textContent = "ปานกลาง";
    strengthElement.className = "strength-medium";
    scoreElement.textContent = "ปานกลาง";
    for (let i = 0; i < Math.min(score, 4); i++) {
      indicators[i].classList.add("bg-yellow-500");
    }
  } else {
    strengthElement.textContent = "แข็งแกร่ง";
    strengthElement.className = "strength-strong";
    scoreElement.textContent = "แข็งแกร่ง";
    for (let i = 0; i < Math.min(score, 4); i++) {
      indicators[i].classList.add("bg-green-500");
    }
  }
}

document.getElementById("password").addEventListener("input", function () {});
document.getElementById("idNumber").addEventListener("input", function () {
  // เอาแต่ตัวเลข 13 หลัก
  this.value = this.value.replace(/\D/g, "").substr(0, 13);
});

document.getElementById("phone").addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");
  if (value.length > 0) {
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = value.substr(0, 3) + "-" + value.substr(3);
    } else {
      value =
        value.substr(0, 3) +
        "-" +
        value.substr(3, 3) +
        "-" +
        value.substr(6, 4);
    }
    this.value = value;
  }
});

document
  .getElementById("profilePicture")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("profile-preview");
        const defaultAvatar = document.getElementById("default-avatar");

        preview.src = e.target.result;
        preview.classList.remove("hidden");
        defaultAvatar.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

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

document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", function () {
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const eyeIconConfirm = document.getElementById("eyeIconConfirm");

    if (confirmPasswordInput.type === "password") {
      confirmPasswordInput.type = "text";
      eyeIconConfirm.className = "fas fa-eye-slash";
    } else {
      confirmPasswordInput.type = "password";
      eyeIconConfirm.className = "fas fa-eye";
    }
  });

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", function () {
    if (this.value) {
      validateInput(this);
    }
  });

  input.addEventListener("input", function () {
    if (this.classList.contains("border-red-500")) {
      validateInput(this);
    }
  });
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (validateStep(1) && validateStep(2) && validateStep(3)) {
      showLoading();
      userData.username = userData.username.trim();
      userData.password = userData.password.trim();

      console.log(userData);
      const res = await fetch(`/register/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          showNotification(
            "สมัครสมาชิกสำเร็จ! กำลังนำทางไปหน้าเข้าสู่ระบบ...",
            "success"
          );

          setTimeout(() => {
            window.location.href = "/login.html";
          }, 2000);
        }, 3000);
      } else {
        const data = await res.json();
        console.log(data);
        setTimeout(() => {
          hideLoading();
          showNotification("สมัครสมาชิกไม่สำเร็จ!", "error");
        }, 3000);
      }
    } else {
      showNotification("กรุณาตรวจสอบข้อมูลให้ครบถ้วน", "error");
    }
  });

function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
}

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

  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 max-w-sm`;
  notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas ${icon} text-xl"></i>
            <span class="text-sm">${message}</span>
        </div>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    if (currentStep < totalSteps) {
      nextStep();
    } else {
      document
        .getElementById("registerForm")
        .dispatchEvent(new Event("submit"));
    }
  }
});

window.addEventListener("load", function () {
  document.getElementById("firstName").focus();
  updateProgress();
});

document.getElementById("birthDate").addEventListener("change", function () {
  const birthDate = new Date(this.value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (age < 20) {
    showNotification(
      "คำเตือน: คุณต้องมีอายุอย่างน้อย 20 ปีเพื่อสมัครสมาชิก Khon Armory",
      "error"
    );
  }
});

let usernameTimeout;
document.getElementById("username").addEventListener("input", function () {
  clearTimeout(usernameTimeout);
  const username = this.value;

  if (username.length >= 4) {
    usernameTimeout = setTimeout(() => {
      const isAvailable = Math.random() > 0.3;

      if (isAvailable) {
        showNotification("ชื่อผู้ใช้พร้อมใช้งาน", "success");
      } else {
        showNotification("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว", "error");
        this.classList.add("border-red-500");
      }
    }, 1000);
  }
});

document.getElementById("email").addEventListener("blur", function () {
  const email = this.value;
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setTimeout(() => {
      const isDuplicate = Math.random() > 0.8;
      if (isDuplicate) {
        showNotification("อีเมลนี้ถูกใช้งานแล้ว", "error");
        this.classList.add("border-red-500");
      }
    }, 500);
  }
});

const helpTexts = {
  firstName: "กรอกชื่อจริงตามบัตรประจำตัวประชาชน",
  lastName: "กรอกนามสกุลตามบัตรประจำตัวประชาชน",
  email: "อีเมลนี้จะใช้สำหรับการยืนยันตัวตนและรับข่าวสาร",
  phone: "เบอร์โทรศัพท์ที่สามารถติดต่อได้",
  idNumber: "เลขบัตรประจำตัวประชาชน 13 หลัก",
  username: "ชื่อที่ใช้สำหรับเข้าสู่ระบบ ต้องไม่ซ้ำกับผู้อื่น",
  password: "รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร",
};

Object.keys(helpTexts).forEach((id) => {
  const input = document.getElementById(id);
  if (input) {
    input.setAttribute("title", helpTexts[id]);
  }
});
