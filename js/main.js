
document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra và xóa đơn hàng cũ nếu có
    const existingOrder = localStorage.getItem('currentOrder');
    if (existingOrder) {
        try {
            const orderData = JSON.parse(existingOrder);
            console.log('Đã xóa đơn hàng cũ:', orderData.orderId);
        } catch (e) {
            console.log('Đã xóa dữ liệu đơn hàng không hợp lệ');
        }
        localStorage.removeItem('currentOrder');
    }
})
// Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const sidebarClose = document.getElementById('sidebarClose');

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Hide header on scroll down
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('hide');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('hide')) {
        header.classList.add('hide');
    } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
        header.classList.remove('hide');
    }

    lastScroll = currentScroll;
});

// Banner Slider
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);

// Document Type Selection
const documentTypes = document.querySelectorAll('.document-type');
const contentOptions = {
    textbook: document.getElementById('textbookOptions'),
    thesis: document.getElementById('thesisOptions'),
    research: document.getElementById('researchOptions'),
    exam: document.getElementById('examOptions'),
    note: document.getElementById('noteOptions'),
    other: document.getElementById('otherOptions')
};

documentTypes.forEach(type => {
    type.addEventListener('click', () => {
        // Remove active class from all types
        documentTypes.forEach(t => t.classList.remove('active'));

        // Add active class to clicked type
        type.classList.add('active');

        // Hide all content options
        Object.values(contentOptions).forEach(option => {
            option.classList.remove('active');
        });

        // Show selected content options
        const selectedType = type.getAttribute('data-type');
        contentOptions[selectedType].classList.add('active');

        // Update transaction details
        document.getElementById('docTypeDisplay').textContent = type.querySelector('h4').textContent;

        // Reset content selection
        document.getElementById('contentTypeDisplay').textContent = 'Chưa chọn';
        document.getElementById('priceDisplay').textContent = '0đ';
        document.getElementById('totalPriceDisplay').textContent = '0đ';

        // Disable checkout button until all required fields are filled
        document.getElementById('checkoutBtn').disabled = true;
    });
});

// Content Option Selection
Object.values(contentOptions).forEach(optionGroup => {
    const options = optionGroup.querySelectorAll('.content-option');

    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options in this group
            options.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            option.classList.add('active');

            // Update transaction details
            document.getElementById('contentTypeDisplay').textContent = option.querySelector('span:first-child').textContent;

            const price = option.getAttribute('data-price');
            document.getElementById('priceDisplay').textContent = parseInt(price).toLocaleString('vi-VN') + 'đ';
            document.getElementById('totalPriceDisplay').textContent = parseInt(price).toLocaleString('vi-VN') + 'đ';

            // Enable checkout button if payment method and email are also selected
            updateCheckoutButton();
        });
    });
});

// Payment Method Selection
const paymentMethods = document.querySelectorAll('.payment-method');

paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        // Remove active class from all methods
        paymentMethods.forEach(m => m.classList.remove('active'));

        // Add active class to clicked method
        method.classList.add('active');

        // Update transaction details
        document.getElementById('paymentMethodDisplay').textContent = method.querySelector('h4').textContent;

        // Enable checkout button if content and email are also selected
        updateCheckoutButton();
    });
});

// Email Input
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    document.getElementById('emailDisplay').textContent = email || 'Chưa có';

    // Enable checkout button if content and payment method are also selected
    updateCheckoutButton();
});

// Update Checkout Button State
function updateCheckoutButton() {
    const docTypeSelected = document.querySelector('.document-type.active');
    const contentSelected = document.querySelector('.content-option.active');
    const paymentSelected = document.querySelector('.payment-method.active');
    const emailValid = emailInput.value.trim().length > 0 && emailInput.checkValidity();

    document.getElementById('checkoutBtn').disabled = !(docTypeSelected && contentSelected && paymentSelected && emailValid);
}

// Checkout Button


// Form validation
emailInput.addEventListener('blur', () => {
    if (!emailInput.checkValidity()) {
        emailInput.style.borderColor = 'var(--secondary-color)';
    } else {
        emailInput.style.borderColor = '#e0e0e0';
    }
});



document.getElementById('checkoutBtn').addEventListener('click', function () {
    // Kiểm tra email hợp lệ
    const email = document.getElementById('emailDisplay').textContent;
    if (email === 'Chưa có') {
        alert('Vui lòng nhập email hợp lệ trước khi thanh toán');
        return;
    }
    // Tạo ID đơn hàng
    const orderId = generateOrderId();
    console.log(document.getElementById('priceDisplay').textContent
        .replace('đ', '')
        .replace(/\./g, '')
        .replace(/,/g, ''))
    // Lấy thông tin đơn hàng
    const orderData = {
        orderId: orderId,
        docType: document.getElementById('docTypeDisplay').textContent,
        docContent: document.getElementById('contentTypeDisplay').textContent,
        price: document.getElementById('priceDisplay').textContent
            .replace('đ', '')
            .replace(/\./g, '')
            .replace(/,/g, ''),
        email: email,
        paymentMethod: document.getElementById('paymentMethodDisplay').textContent,
        total: document.getElementById('totalPriceDisplay').textContent
            .replace('đ', '')
            .replace(/\./g, '')
            .replace(/,/g, '')
    };

    // Lưu vào localStorage với key là orderId
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    processPayment(orderId)

    // // Chuyển hướng sang trang thanh toán với orderId
    // window.location.href = `thanh-toan.html?order=${orderId}`;
});

function generateOrderId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length));

    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');

    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return randomLetters + datePart + randomNum;
}

async function processPayment(orderId) {
    const loadingOverlay = document.getElementById('loadingOverlay');

    const orderData = {
        orderId: orderId,
        customerEmail: document.getElementById('emailDisplay').textContent,
        docType: document.getElementById('docTypeDisplay').textContent,
        docContent: document.getElementById('contentTypeDisplay').textContent,
        amount: document.getElementById('priceDisplay').textContent,
        paymentMethod: document.getElementById('paymentMethodDisplay').textContent,
        sheetName: "Chưa thanh toán", // Sheet cho đơn chưa xác nhận
        status: "Chưa xác nhận"
    };

    try {
        loadingOverlay.style.display = 'flex';

        const response = await fetch('https://script.google.com/macros/s/AKfycbxHwZ0YERDx82U1AGJnlZ7NnxvfVrkjGy6ZqI-TsFKhDneZUbs2gJ6pW7Yd87fkspdgVQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: "no-cors",
            body: JSON.stringify(orderData)
        });
        loadingOverlay.style.display = 'none';

        // const result = await response.json();
        // if (result.success) {
        //     // Chuyển hướng đến trang thanh toán với thông tin đơn hàng
        const queryString = new URLSearchParams(orderData).toString();
        window.location.href = `thanh-toan.html?${queryString}`;
        // }
    } catch (error) {
        loadingOverlay.style.display = 'none';

        console.error('Error:', error);
        alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');

    }
}
