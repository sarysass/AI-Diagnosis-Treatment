// js/welcome.js

document.getElementById('start-btn').addEventListener('click', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = 'personal-info.html';
    }, 1000);
});
