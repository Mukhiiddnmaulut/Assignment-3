// JavaScript functionality can be added here
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any future interactive features
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('main-nav');
    const mobileLogoBtn = document.querySelector('.mobile-logo-btn');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
        // Optional: close menu when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    if (mobileLogoBtn && nav) {
        mobileLogoBtn.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
        // Optional: close menu when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }
}); 