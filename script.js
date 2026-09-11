// Data Produk 
const products = [
    { name: 'Cincau Gula Aren', price: 'IDR 13,000.00', colorClass: 'bg-yellow', image: 'assets/Cincau Gula Aren.webp', link: 'cincau-gula-aren.html' },
    { name: 'Thai Tea', price: 'IDR 15,000.00', colorClass: 'bg-orange', image: 'assets/Thai Tea.webp', link: 'thai-tea.html' },
    { name: 'Green Tea', price: 'IDR 15,000.00', colorClass: 'bg-green', image: 'assets/Green Tea.webp', link: 'green-tea.html' },
    { name: 'Cold Pressed Juice (Semangka & Nanas)', price: 'IDR 20,000.00', colorClass: 'bg-white', image: null, link: '#' },
    { name: 'Cold Pressed Juice (Pear & Nanas)', price: 'IDR 20,000.00', colorClass: 'bg-yellow', image: null, link: '#' },
    { name: 'Kelapa Pandan', price: 'IDR 13,000.00', colorClass: 'bg-green', image: null, link: '#' }
];

const WHATSAPP_NUMBER = '6285711544265';

// 1. Fungsi Render Menu di Homepage
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    if(!menuGrid) return;
    menuGrid.innerHTML = ''; 
    
    products.forEach((product, index) => {
        const delay = index * 100;
        const card = document.createElement('div');
        card.className = `menu-card neo-box ${product.colorClass} reveal`;
        card.style.transitionDelay = `${delay}ms`;
        
        card.onclick = () => { if(product.link !== '#') window.location.href = product.link; };
        
        let imageHTML = '';
        if(product.image) {
            imageHTML = `<img src="${product.image}" alt="${product.name}">`;
        } else {
            imageHTML = `<div class="no-image-placeholder">FOTO<br>COMING SOON</div>`;
        }

        card.innerHTML = `
            <div class="menu-img-placeholder">${imageHTML}</div>
            <h3 style="margin-top: 15px;">${product.name}</h3>
            <p class="price">${product.price}</p>
            <button class="btn neo-btn bg-brand-blue text-white" onclick="event.stopPropagation(); orderWhatsApp('${product.name}', '${product.price}')">Order Langsung</button>
        `;
        menuGrid.appendChild(card);
    });
}

// 2. Animasi HERO SLIDER (Fit in Box, Manual & Auto)
let heroSlideIdx = 0;
let heroInterval;

function changeHeroSlide(direction) {
    const wrapper = document.getElementById('hero-slider-wrapper');
    if(!wrapper) return;
    const images = wrapper.getElementsByTagName('img');
    if(images.length === 0) return;

    heroSlideIdx += direction;
    if (heroSlideIdx < 0) heroSlideIdx = images.length - 1;
    else if (heroSlideIdx >= images.length) heroSlideIdx = 0;

    wrapper.style.transform = `translateX(-${heroSlideIdx * 100}%)`;
    resetHeroInterval(); // Reset timer saat digeser manual
}

function resetHeroInterval() {
    clearInterval(heroInterval);
    heroInterval = setInterval(() => changeHeroSlide(1), 3000); // 3 Detik auto geser
}


// 3. Animasi SLIDER FEATURED (Hari Ini Pick)
let featuredSlideIdx = 0;
let featuredInterval;

function changeFeaturedSlide(direction) {
    const wrapper = document.getElementById('featured-slider-wrapper');
    if(!wrapper) return;
    const images = wrapper.getElementsByTagName('img');
    if(images.length === 0) return;

    featuredSlideIdx += direction;
    if (featuredSlideIdx < 0) featuredSlideIdx = images.length - 1;
    else if (featuredSlideIdx >= images.length) featuredSlideIdx = 0;

    wrapper.style.transform = `translateX(-${featuredSlideIdx * 100}%)`;
    resetFeaturedInterval();
}

function resetFeaturedInterval() {
    clearInterval(featuredInterval);
    featuredInterval = setInterval(() => changeFeaturedSlide(1), 5000); // 5 Detik auto geser
}

// 4. Animasi SLIDER DETAIL PRODUK (Halaman Produk)
let productSlideIdx = 0;
let productInterval;

function changeProductSlide(direction) {
    const wrapper = document.getElementById('product-slider-wrapper');
    if(!wrapper) return;
    const images = wrapper.getElementsByTagName('img');
    if(images.length === 0) return;

    productSlideIdx += direction;
    if (productSlideIdx < 0) productSlideIdx = images.length - 1;
    else if (productSlideIdx >= images.length) productSlideIdx = 0;

    wrapper.style.transform = `translateX(-${productSlideIdx * 100}%)`;
    resetProductInterval();
}

function resetProductInterval() {
    clearInterval(productInterval);
    productInterval = setInterval(() => changeProductSlide(1), 4000); // 4 Detik auto geser
}

// ==========================================
// UTILITIES
// ==========================================
function orderWhatsApp(productName, productPrice) {
    const message = `Halo RIS Kitchen, saya ingin order ${productName} seharga ${productPrice}.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navbar = document.getElementById('navbar');

    if(hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, revealOptions);
    reveals.forEach(reveal => observer.observe(reveal));
}

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    
    // Inisialisasi Auto Slider berdasarkan keberadaan ID
    if(document.getElementById('hero-slider-wrapper')) resetHeroInterval();
    if(document.getElementById('featured-slider-wrapper')) resetFeaturedInterval();
    if(document.getElementById('product-slider-wrapper')) resetProductInterval();

    initNavbar();
    setTimeout(initScrollReveal, 100);
});