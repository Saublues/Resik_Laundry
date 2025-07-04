// Data storage untuk menyimpan pesanan laundry
let laundryOrders = [];

// Google Sheets Configuration (UBAH SESUAI DENGAN GOOGLE SHEETS ANDA)
const GOOGLE_SHEETS_CONFIG = {
    // Ganti dengan Web App URL dari Google Apps Script
    scriptURL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
    // Atau gunakan Google Sheets API
    apiKey: 'YOUR_GOOGLE_SHEETS_API_KEY_HERE',
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
    range: 'Sheet1!A:H'
};

// DOM Elements
const form = document.getElementById('laundryForm');
const successMessage = document.getElementById('successMessage');
const dataDisplay = document.getElementById('dataDisplay');
const dataList = document.getElementById('dataList');

// Load existing data saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadExistingData();
});

// Event listener untuk form submit
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Tampilkan loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span>Mengirim...';
    
    try {
        // Ambil data dari form
        const formData = getFormData();
        
        // Validasi data
        if (!validateFormData(formData)) {
            throw new Error('Data tidak valid. Mohon periksa kembali form.');
        }
        
        // Tambah timestamp dan ID
        formData.id = generateOrderId();
        formData.timestamp = new Date().toLocaleString('id-ID');
        formData.status = 'Pesanan Diterima';
        
        // Simpan ke array lokal
        laundryOrders.push(formData);
        
        // Kirim ke Google Sheets
        await sendToGoogleSheets(formData);
        
        // Tampilkan pesan sukses
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Update tampilan data
        displayOrders();
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error.message);
    } finally {
        // Kembalikan tombol ke kondisi normal
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Fungsi untuk mengambil data dari form
function getFormData() {
    return {
        customerName: document.getElementById('customerName').value.trim(),
        deliveryMethod: document.querySelector('input[name="deliveryMethod"]:checked')?.value,
        timeSchedule: document.getElementById('timeSchedule').value,
        serviceType: document.getElementById('serviceType').value,
        itemType: document.getElementById('itemType').value.trim(),
        address: document.getElementById('address').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        notes: document.getElementById('notes').value.trim()
    };
}

// Fungsi validasi data
function validateFormData(data) {
    // Validasi field yang wajib diisi
    const requiredFields = ['customerName', 'deliveryMethod', 'timeSchedule', 'serviceType', 'itemType', 'address', 'phoneNumber'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            return false;
        }
    }
    
    // Validasi format nomor HP
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(data.phoneNumber.replace(/\s+/g, ''))) {
        return false;
    }
    
    return true;
}

// Generate ID pesanan unik
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `LND-${timestamp}-${random}`;
}

// Fungsi untuk mengirim data ke Google Sheets (DISABLED - menggunakan download JSON)
async function sendToGoogleSheets(data) {
    // Function disabled - menggunakan download JSON sebagai gantinya
    console.log('Data yang akan disimpan:', data);
    
    // Auto download JSON setelah 3 detik (opsional)
    setTimeout(() => {
        if (confirm('Apakah Anda ingin mendownload data sebagai file JSON?')) {
            exportToJSON();
        }
    }, 1000);
}

// Fungsi untuk memuat data yang sudah ada
function loadExistingData() {
    // Dalam implementasi nyata, ini akan memuat data dari Google Sheets
    // Untuk saat ini, kita gunakan data lokal
    displayOrders();
}

// Fungsi untuk menampilkan pesan sukses
function showSuccessMessage() {
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Fungsi untuk menampilkan pesan error
function showErrorMessage(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        successMessage.parentNode.insertBefore(errorDiv, successMessage.nextSibling);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Fungsi untuk menampilkan daftar pesanan
function displayOrders() {
    if (laundryOrders.length === 0) {
        dataDisplay.style.display = 'none';
        return;
    }
    
    dataDisplay.style.display = 'block';
    dataList.innerHTML = '';
    
    laundryOrders.forEach((order, index) => {
        const orderElement = createOrderElement(order, index);
        dataList.appendChild(orderElement);
    });
}




// Fungsi untuk membuat elemen pesanan
function createOrderElement(order, index) {
    const div = document.createElement('div');
    div.className = 'data-item';
    
    div.innerHTML = `
        <h4>Pesanan #${order.id}</h4>
        <p><strong>Nama:</strong> ${order.customerName}</p>
        <p><strong>Metode:</strong> ${order.deliveryMethod === 'dijemput' ? '🚗 Dijemput' : '🚶 Antar Sendiri'}</p>
        <p><strong>Waktu:</strong> ${new Date(order.timeSchedule).toLocaleString('id-ID')}</p>
        <p><strong>Layanan:</strong> ${getServiceTypeName(order.serviceType)}</p>
        <p><strong>Barang:</strong> ${order.itemType}</p>
        <p><strong>Alamat:</strong> ${order.address}</p>
        <p><strong>No HP:</strong> ${order.phoneNumber}</p>
        ${order.notes ? `<p><strong>Catatan:</strong> ${order.notes}</p>` : ''}
        <p><strong>Status:</strong> <span style="color: #4CAF50;">${order.status}</span></p>
        <p><strong>Waktu Pesanan:</strong> ${order.timestamp}</p>
        <button type="button" class="download-btn" onclick="exportToStrukByIndex(${index})">📥 Download Struk</button>
    `;
    
    return div;
}


function exportToStruk(order) {
  // Buat string struk dengan format vertikal, rapi seperti struk kasir
  const strukLines = [
    `===== PESANAN #${order.id} =====`,
    `Nama          : ${order.customerName}`,
    `Metode        : ${order.deliveryMethod === 'dijemput' ? '🚗 Dijemput' : '🚶 Antar Sendiri'}`,
    `Waktu         : ${new Date(order.timeSchedule).toLocaleString('id-ID')}`,
    `Layanan       : ${getServiceTypeName(order.serviceType)}`,
    `Barang        : ${order.itemType}`,
    `Alamat        : ${order.address}`,
    `No HP         : ${order.phoneNumber}`,
    order.notes ? `Catatan       : ${order.notes}` : '',
    `Status        : ${order.status}`,
    `Waktu Pesanan : ${order.timestamp}`,
    `==============================`
  ];

  // Filter untuk hapus baris kosong (jika notes kosong)
  const strukText = strukLines.filter(line => line).join('\n');

  // Buat Blob dan link untuk download file .txt
  const blob = new Blob([strukText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `struk_pesanan_${order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// Fungsi untuk mendapatkan nama layanan
function getServiceTypeName(serviceType) {
    const serviceNames = {
        'cuci_kering': 'Cuci Kering',
        'cuci_setrika': 'Cuci + Setrika',
        'dry_cleaning': 'Dry Cleaning',
        'setrika_saja': 'Setrika Saja',
        'cuci_sepatu': 'Cuci Sepatu',
        'cuci_karpet': 'Cuci Karpet'
    };
    return serviceNames[serviceType] || serviceType;
}

function exportToStrukByIndex(index) {
    if (index >= 0 && index < laundryOrders.length) {
        exportToStruk(laundryOrders[index]);
    } else {
        alert('Data pesanan tidak ditemukan!');
    }
}

// Fungsi untuk export data ke JSON (untuk backup/debugging)
function exportToJSON() {
    if (laundryOrders.length === 0) {
        alert('Tidak ada data untuk diexport!');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalOrders: laundryOrders.length,
        orders: laundryOrders,
        summary: generateOrderSummary()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `laundry-orders-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccessMessage('Data berhasil didownload sebagai file JSON!');
}

// Fungsi untuk generate summary data
function generateOrderSummary() {
    const summary = {
        ordersByMethod: {},
        ordersByService: {},
        ordersByStatus: {},
        recentOrders: laundryOrders.slice(-5) // 5 pesanan terakhir
    };
    
    laundryOrders.forEach(order => {
        // Summary berdasarkan metode
        const method = order.deliveryMethod;
        summary.ordersByMethod[method] = (summary.ordersByMethod[method] || 0) + 1;
        
        // Summary berdasarkan layanan
        const service = order.serviceType;
        summary.ordersByService[service] = (summary.ordersByService[service] || 0) + 1;
        
        // Summary berdasarkan status
        const status = order.status;
        summary.ordersByStatus[status] = (summary.ordersByStatus[status] || 0) + 1;
    });
    
    return summary;
}

// Fungsi auto-save ke JSON setiap ada pesanan baru
function autoDownloadJSON() {
    if (laundryOrders.length > 0) {
        exportToJSON();
    }
}

// Tambahkan event listener untuk keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + E untuk export JSON
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportToJSON();
    }
    
    // Ctrl + S untuk save/download JSON
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportToJSON();
    }
});
