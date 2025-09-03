// js/doctor-login.js
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = '1';
});

const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // 简单验证
    if (username === "doctor" && password === "123456") {
        window.location.href = "doctor-view.html";
    } else {
        errorMessage.style.display = "block";
    }
});
