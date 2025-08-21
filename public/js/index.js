// // โหลด navbar.html แล้วแทรกลงใน div#navbar
// fetch("/navbar")
//   .then((response) => response.text())
//   .then((html) => {
//     document.getElementById("navbar").innerHTML = html;
//     setupSmoothScroll(); // ผูก event หลังโหลด navbar เสร็จ
//   })
//   .catch((err) => console.error("โหลด navbar ไม่ได้:", err));

// ทำ smooth scroll แบบ delegation สำหรับลิงก์ใน navbar
function setupSmoothScroll() {
  const navbar = document.getElementById("navbar");

  navbar.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) {
      event.preventDefault();
      const targetId = anchor.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// // โหลด footer.html แล้วแทรกลงใน div#footer
// fetch("/footer")
//   .then((response) => response.text())
//   .then((html) => {
//     document.getElementById("footer").innerHTML = html;
//     // ถ้าต้องการผูก event smooth scroll ให้ footer ด้วย ให้เรียกฟังก์ชันนี้อีกครั้ง (ถ้ามีลิงก์)
//     // setupSmoothScrollFooter();
//   })
//   .catch((err) => console.error("โหลด footer ไม่ได้:", err));

// ฟังก์ชันที่ใช้กับปุ่มใน Hero (ถ้าต้องการ)
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const navbar = await fetch("/navbar");
  const footer = await fetch("/footer");
  const navhtml = await navbar.text();
  const foothtml = await footer.text();
  if (navbar) {
    document.getElementById("navbar").innerHTML = navhtml;
    setupSmoothScroll();
  }
  if (footer) {
    document.getElementById("footer").innerHTML = foothtml;
  }

  const btn = document.getElementById("authBtn");
  console.log(btn);
  if (!btn) return; // button not found

  try {
    const res = await fetch("/session-status");
    if (!res.ok) throw new Error("Failed to fetch session");
    const data = await res.json();
    console.log(data);

    if (data.user) {
      btn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      btn.onclick = async () => {
        await fetch("/logout", { method: "POST" });
        location.reload();
      };
    } else {
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      btn.onclick = () => (location.href = "/login");
    }
  } catch (err) {
    console.error("Error fetching session:", err);
  }
});

const fetchSession = async () => {
  const res = await fetch(`/session-status`);
  if (res.ok) {
    const data = await res.json();
    console.log(data);

    if (data.user) {
      btn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      btn.onclick = () => {
        fetch("/logout", { method: "POST" }).then(() => location.reload());
      };
    } else {
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      btn.onclick = () => (location.href = "/login");
    }
  } else {
    console.log("Failed");
  }
};
