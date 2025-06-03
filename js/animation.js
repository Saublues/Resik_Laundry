// js/animations.js

// Bungkus fungsi dalam objek global atau langsung buat fungsi global
// Opsi 1: Buat fungsi global (lebih sederhana untuk kasus ini)
window.initializeFadeInObserver = function() { // Gunakan window. untuk membuatnya global
  const animatedElements = document.querySelectorAll('.fade-in-section:not(.is-visible)');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
};

// Panggil observer untuk elemen statis saat DOM sudah siap
// Ini akan tetap mengurus elemen fade-in-section yang ada di HTML dari awal
document.addEventListener("DOMContentLoaded", window.initializeFadeInObserver);