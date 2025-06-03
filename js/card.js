
fetch('js/data-card.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('layanan-container');
    let cardsHtml = ''; // Gunakan variabel string untuk menampung HTML

   data.forEach(item => {
  cardsHtml += `
    <div class="col-lg-3 col-md-6 fade-in-section">
      <div class="bg-white mb-4 shadow-sm rounded card-hover"
           data-img="${item.img}"
           data-desc="${item.desc}">
        <div class="p-5 d-flex align-items-center justify-content-center">
          <h1 class="text-${item.color} font-weight-normal">${item.icon}</h1>
          <h5 class="mx-3 text-muted font-weight-bold">${item.nama}</h5>
        </div>
      </div>
    </div>
  `;
});

    container.innerHTML = cardsHtml; // Set innerHTML sekali setelah loop selesai

 document.querySelectorAll('.card-hover').forEach(card => {
  card.style.position = 'relative';

  card.addEventListener('mouseenter', () => {
    if (!card.querySelector('.hover-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'hover-overlay';

      const img = card.getAttribute('data-img');
      const desc = card.getAttribute('data-desc');

      overlay.innerHTML = `
        <div class="card" style="width: 100%;">
          <img src="${img}" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">${desc}</p>
          </div>
        </div>
      `;

      card.appendChild(overlay);
    }
  });

  card.addEventListener('mouseleave', () => {
    const overlay = card.querySelector('.hover-overlay');
    if (overlay) overlay.remove();
  });
});




    // Panggil fungsi inisialisasi animasi setelah semua elemen baru ditambahkan
    if (typeof window.initializeFadeInObserver === 'function') {
      window.initializeFadeInObserver();
    } else {
      console.warn("initializeFadeInObserver() not found. Pastikan animations.js dimuat dengan benar.");
    }
  })
  .catch(err => console.error('Error fetching card data:', err));