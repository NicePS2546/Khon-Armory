// โหลด navbar.html แล้วแทรกลงใน div#navbar
fetch('/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
        setupSmoothScroll();  // ผูก event หลังโหลด navbar เสร็จ
    })
    .catch(err => console.error('โหลด navbar ไม่ได้:', err));

// ทำ smooth scroll แบบ delegation สำหรับลิงก์ใน navbar
function setupSmoothScroll() {
    const navbar = document.getElementById('navbar');

    navbar.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href^="#"]');
        if (anchor) {
            event.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// โหลด footer.html แล้วแทรกลงใน div#footer
fetch('/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
        // ถ้าต้องการผูก event smooth scroll ให้ footer ด้วย ให้เรียกฟังก์ชันนี้อีกครั้ง (ถ้ามีลิงก์)
        // setupSmoothScrollFooter();
    })
    .catch(err => console.error('โหลด footer ไม่ได้:', err));

// ฟังก์ชันที่ใช้กับปุ่มใน Hero (ถ้าต้องการ)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
