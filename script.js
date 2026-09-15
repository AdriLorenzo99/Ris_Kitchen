/* =========================================================
   RIS KITCHEN
   Main JavaScript — lightweight static-site interactions
========================================================= */

/* =========================================================
   1. CENTRAL PRODUCT + ORDER CONFIG
========================================================= */

const WHATSAPP_GENERAL = "6285780664567";
const WHATSAPP_UNJ = "6285711544265";

const products = [
    {
        id: "thai-tea",
        name: "Thai Tea",
        price: "Rp 15.000",
        colorClass: "bg-white",
        images: ["assets/Thai Tea 1.jpg", "assets/Thai tea 2.jpg"],
        description: "Thai tea creamy dengan rasa teh yang khas dan menyegarkan.",
        link: "thai-tea.html"
    },
    {
        id: "green-tea",
        name: "Green Tea",
        price: "Rp 15.000",
        colorClass: "bg-white",
        images: ["assets/Green Tea 1.jpg", "assets/Green Tea 2.jpg"],
        description: "Green tea ringan dan fresh untuk menemani hari kamu.",
        link: "green-tea.html"
    },
    {
        id: "cincau-gula-aren",
        name: "Cincau Gula Aren",
        price: "Rp 13.000",
        colorClass: "bg-white",
        images: ["assets/Cincau 1.jpg", "assets/Cincau 2.jpg"],
        description: "Perpaduan cincau yang lembut dengan manisnya gula aren.",
        link: "cincau-gula-aren.html"
    },
    {
        id: "kelapa-pandan",
        name: "Kelapa Pandan",
        price: "Rp 13.000",
        colorClass: "bg-white",
        images: ["assets/Kelapa 1.jpg", "assets/Kelapa Pandan 2.jpg"],
        description: "Kesegaran kelapa dengan aroma pandan yang lembut.",
        link: "kelapa-pandan.html"
    },
    {
        id: "jus-semangka-nanas",
        name: "Cold Pressed Juice (Semangka & Nanas)",
        price: "Rp 20.000",
        colorClass: "bg-white",
        images: ["assets/Jus Semangka Nanas.jpg", "assets/Jus Semangka Nanas 2.jpg"],
        description: "Perpaduan segarnya semangka dan nanas dalam cold pressed juice.",
        link: "jus-semangka-nanas.html"
    },
    {
        id: "jus-pear-nanas",
        name: "Cold Pressed Juice (Pear & Nanas)",
        price: "Rp 20.000",
        colorClass: "bg-white",
        images: ["assets/Jus Pear Nanas 1.jpg", "assets/Jus Pear Nanas2.jpg"],
        description: "Perpaduan pear dan nanas yang ringan, fresh, dan menyegarkan.",
        link: "jus-pear-nanas.html"
    }
];

function getProduct(id) {
    return products.find((product) => product.id === id) || null;
}

function getPageProduct() {
    return getProduct(document.body?.dataset.productId);
}

/* =========================================================
   2. CART SYSTEM
========================================================= */

const CART_STORAGE_KEY = "riskitchen_cart_v1";

let cartState = [];

function parsePrice(priceString) {
    return parseInt(String(priceString).replace(/[^\d]/g, ""), 10) || 0;
}

function formatPrice(amount) {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function loadCart() {
    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(
            (entry) => entry && getProduct(entry.id) && Number(entry.qty) > 0
        );
    } catch (error) {
        return [];
    }
}

function saveCart() {
    try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (error) {
    }
}

function getCartEntry(id) {
    return cartState.find((entry) => entry.id === id) || null;
}

function addToCart(id, qty = 1) {
    if (!getProduct(id)) {
        return;
    }

    const entry = getCartEntry(id);

    if (entry) {
        entry.qty += qty;
    } else {
        cartState.push({ id, qty });
    }

    saveCart();
    renderCartDrawer();
    updateCartBadges();
}

function increaseCartQty(id) {
    const entry = getCartEntry(id);

    if (!entry) {
        return;
    }

    entry.qty += 1;
    saveCart();
    renderCartDrawer();
    updateCartBadges();
}

function decreaseCartQty(id) {
    const entry = getCartEntry(id);

    if (!entry) {
        return;
    }

    entry.qty = Math.max(1, entry.qty - 1);
    saveCart();
    renderCartDrawer();
    updateCartBadges();
}

function removeFromCart(id) {
    cartState = cartState.filter((entry) => entry.id !== id);
    saveCart();
    renderCartDrawer();
    updateCartBadges();
}

function clearCart() {
    cartState = [];
    saveCart();
    renderCartDrawer();
    updateCartBadges();
}

function getCartDetails() {
    return cartState
        .map((entry) => {
            const product = getProduct(entry.id);

            if (!product) {
                return null;
            }

            const unitPrice = parsePrice(product.price);

            return {
                product,
                qty: entry.qty,
                unitPrice,
                lineTotal: unitPrice * entry.qty
            };
        })
        .filter(Boolean);
}

function getCartCount() {
    return cartState.reduce((total, entry) => total + entry.qty, 0);
}

function getCartTotal() {
    return getCartDetails().reduce((total, item) => total + item.lineTotal, 0);
}

function updateCartBadges() {
    const count = getCartCount();

    document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
        badge.textContent = String(count);
        badge.classList.toggle("is-visible", count > 0);
    });
}

function addCartBadges() {
    document.querySelectorAll(".nav-order, .mobile-menu [data-order]").forEach((trigger) => {
        if (trigger.querySelector("[data-cart-badge]")) {
            return;
        }

        const badge = document.createElement("span");
        badge.className = "cart-badge";
        badge.setAttribute("data-cart-badge", "");
        badge.textContent = "0";
        trigger.appendChild(badge);
    });
}

/* -------- Cart drawer UI -------- */

let cartDrawer;
let cartDrawerLastTrigger;

function renderCartItemRow(item) {
    const image = item.product.images?.[0] || "";

    return `
        <div class="cart-item" data-cart-item="${item.product.id}">
            <img class="cart-item-image" src="${image}" alt="${item.product.name}" loading="lazy">
            <div class="cart-item-info">
                <h4>${item.product.name}</h4>
                <span class="cart-item-unit-price">${formatPrice(item.unitPrice)} / item</span>
                <div class="cart-item-qty">
                    <button type="button" class="cart-qty-button" data-cart-decrease="${item.product.id}" aria-label="Kurangi jumlah ${item.product.name}">−</button>
                    <span class="cart-item-qty-value">${item.qty}</span>
                    <button type="button" class="cart-qty-button" data-cart-increase="${item.product.id}" aria-label="Tambah jumlah ${item.product.name}">+</button>
                </div>
            </div>
            <div class="cart-item-side">
                <span class="cart-item-line-total">${formatPrice(item.lineTotal)}</span>
                <button type="button" class="cart-item-trash" data-cart-remove="${item.product.id}" aria-label="Hapus ${item.product.name} dari keranjang"><img alt="trash" src="assets/trash.png" style="width: 16px; height: auto;"></button>
            </div>
        </div>
    `;
}

function renderCartDrawer() {
    if (!cartDrawer) {
        return;
    }

    const items = getCartDetails();
    const body = cartDrawer.querySelector("[data-cart-body]");
    const footer = cartDrawer.querySelector("[data-cart-footer]");
    const totalEl = cartDrawer.querySelector("[data-cart-total]");

    if (items.length === 0) {
        body.innerHTML = `
            <div class="cart-empty"
            style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            ">
                <p>Keranjang kamu masih kosong.</p>
                <a href="index.html#menu" class="secondary-button">Lihat Menu</a>
            </div>
        `;
        footer.hidden = true;
        return;
    }

    body.innerHTML = items.map(renderCartItemRow).join("");
    footer.hidden = false;
    totalEl.textContent = formatPrice(getCartTotal());
}

function createCartDrawer() {
    if (document.getElementById("cartDrawer")) {
        cartDrawer = document.getElementById("cartDrawer");
        return;
    }

    const drawer = document.createElement("div");
    drawer.className = "cart-drawer";
    drawer.id = "cartDrawer";
    drawer.hidden = true;
    drawer.innerHTML = `
        <div class="cart-drawer-overlay" data-cart-close></div>
        <aside
            class="cart-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cartDrawerTitle"
        >
            <div class="cart-drawer-header">
                <h2 id="cartDrawerTitle">Keranjang</h2>
                <button
                    class="cart-drawer-close"
                    type="button"
                    aria-label="Tutup keranjang"
                    data-cart-close
                >×</button>
            </div>

            <div class="cart-drawer-body" data-cart-body></div>

            <div class="cart-drawer-footer" data-cart-footer hidden>
                <div class="cart-drawer-total">
                    <span>Total</span>
                    <strong data-cart-total>Rp 0</strong>
                </div>
                <button type="button" class="primary-button cart-drawer-order" data-cart-order>
                    Order via WhatsApp <span>↗</span>
                </button>
            </div>
        </aside>
    `;

    document.body.appendChild(drawer);
    cartDrawer = drawer;

    drawer.addEventListener("click", (event) => {
        if (event.target.closest("[data-cart-close]")) {
            closeCartDrawer();
            return;
        }

        const increaseButton = event.target.closest("[data-cart-increase]");
        if (increaseButton) {
            increaseCartQty(increaseButton.dataset.cartIncrease);
            return;
        }

        const decreaseButton = event.target.closest("[data-cart-decrease]");
        if (decreaseButton) {
            decreaseCartQty(decreaseButton.dataset.cartDecrease);
            return;
        }

        const removeButton = event.target.closest("[data-cart-remove]");
        if (removeButton) {
            removeFromCart(removeButton.dataset.cartRemove);
            return;
        }

        const orderButton = event.target.closest("[data-cart-order]");
        if (orderButton) {
            closeCartDrawer();
            openOrderModal();
        }
    });

    renderCartDrawer();
}

function openCartDrawer() {
    createCartDrawer();
    renderCartDrawer();

    cartDrawerLastTrigger = document.activeElement;

    cartDrawer.hidden = false;
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
        cartDrawer.classList.add("is-open");
        cartDrawer.querySelector(".cart-drawer-close")?.focus();
    });
}

function closeCartDrawer() {
    if (!cartDrawer) {
        return;
    }

    cartDrawer.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    window.setTimeout(() => {
        if (cartDrawer) {
            cartDrawer.hidden = true;
        }
        cartDrawerLastTrigger?.focus?.();
    }, 180);
}

function flashAddedFeedback(button) {
    if (!button) {
        return;
    }

    const originalText = button.dataset.originalText || button.textContent.trim();
    button.dataset.originalText = originalText;

    button.classList.add("is-added");
    button.textContent = "Ditambahkan ✓";

    window.clearTimeout(button._addedTimeout);
    button._addedTimeout = window.setTimeout(() => {
        button.classList.remove("is-added");
        button.textContent = originalText;
    }, 1100);
}

function initCartSystem() {
    cartState = loadCart();
    createCartDrawer();
    addCartBadges();
    updateCartBadges();

    document.addEventListener("click", (event) => {
        const addButton = event.target.closest("[data-add-to-cart]");

        if (!addButton) {
            return;
        }

        event.preventDefault();
        addToCart(addButton.dataset.addToCart, 1);
        flashAddedFeedback(addButton);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && cartDrawer && !cartDrawer.hidden) {
            closeCartDrawer();
        }
    });
}

let orderModal;
let orderModalLastTrigger;

/* =========================================================
   3. ORDER MODAL (area selection + WhatsApp handoff)
========================================================= */

function createOrderModal() {
    if (document.getElementById("orderModal")) {
        orderModal = document.getElementById("orderModal");
        return;
    }

    const modal = document.createElement("div");
    modal.className = "order-modal";
    modal.id = "orderModal";
    modal.hidden = true;
    modal.innerHTML = `
        <div class="order-modal-overlay" data-order-close></div>
        <section
            class="order-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="orderModalTitle"
        >
            <button
                class="order-modal-close"
                type="button"
                aria-label="Tutup pilihan area"
                data-order-close
            >×</button>

            <span class="section-eyebrow">RIS KITCHEN ORDER</span>
            <h2 id="orderModalTitle">Order di Mana?</h2>
            <p>Pilih area pemesanan:</p>

            <div class="order-modal-options">
                <button type="button" class="order-area-button" data-order-area="general">
                    <span>Umum</span>
                    <span>↗</span>
                </button>
                <button type="button" class="order-area-button" data-order-area="unj">
                    <span>Kampus UNJ (Rawamangun)</span>
                    <span>↗</span>
                </button>
            </div>

            <button type="button" class="order-modal-cancel" data-order-close>
                Tutup
            </button>
        </section>
    `;

    document.body.appendChild(modal);
    orderModal = modal;

    modal.addEventListener("click", (event) => {
        const closeTarget = event.target.closest("[data-order-close]");
        if (closeTarget) {
            closeOrderModal();
            return;
        }

        const areaButton = event.target.closest("[data-order-area]");
        if (areaButton) {
            submitOrder(areaButton.dataset.orderArea);
        }
    });
}

function openOrderModal() {
    createOrderModal();

    orderModalLastTrigger = document.activeElement;

    orderModal.hidden = false;
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
        orderModal.classList.add("is-open");
        orderModal.querySelector(".order-modal-close")?.focus();
    });
}

function closeOrderModal() {
    if (!orderModal) {
        return;
    }

    orderModal.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    window.setTimeout(() => {
        if (orderModal) {
            orderModal.hidden = true;
        }
        orderModalLastTrigger?.focus?.();
    }, 180);
}

function buildOrderMessage(areaName) {
    const items = getCartDetails();

    if (items.length === 0) {
        return [
            "Halo RIS Kitchen!",
            "",
            `Saya ingin order: [Nama Pesanan]`,
            `Jumlah: [Jumlah Pesanan]`,
            `Alamat Pengiriman: ${areaName}`,
            `Catatan:`,
            "",
            "Terima kasih!"
        ].join("\n");
    }

    const itemLines = items.map(
        (item) => `- ${item.qty}x ${item.product.name} (${formatPrice(item.unitPrice)}) = ${formatPrice(item.lineTotal)}`
    );

    return [
        "Halo RIS Kitchen!",
        "",
        "Saya ingin order:",
        ...itemLines,
        "",
        `Total: ${formatPrice(getCartTotal())}`,
        `Alamat Pengiriman: ${areaName}`,
        `Catatan:`,
        "",
        "Terima kasih!"
    ].join("\n");
}

function submitOrder(area) {
    const number = area === "unj" ? WHATSAPP_UNJ : WHATSAPP_GENERAL;
    const areaName = area === "unj" ? "Kampus UNJ (Rawamangun)" : "[Alamat]";

    const message = buildOrderMessage(areaName);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    closeOrderModal();
    window.open(url, "_blank", "noopener,noreferrer");

    // Order has been handed off to WhatsApp — start the next visit with a fresh cart.
    clearCart();
}

function initOrderSystem() {
    createOrderModal();

    document.addEventListener("click", (event) => {
        const areaTrigger = event.target.closest("[data-open-area-modal]");
        if (areaTrigger) {
            event.preventDefault();
            openOrderModal();
            return;
        }

        const trigger = event.target.closest("[data-order]");
        if (!trigger) {
            return;
        }

        event.preventDefault();
        openCartDrawer();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && orderModal && !orderModal.hidden) {
            closeOrderModal();
        }
    });

    document.querySelectorAll("[data-whatsapp-general]").forEach((link) => {
        link.href = `https://wa.me/${WHATSAPP_GENERAL}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    const pageProduct = getPageProduct();

    if (pageProduct) {
        document
            .querySelectorAll(".product-detail-actions .primary-button")
            .forEach((button) => {
                button.dataset.addToCart = pageProduct.id;
                button.removeAttribute("data-order");
                button.removeAttribute("href");
                button.removeAttribute("target");
                button.innerHTML = "+ Tambah ke Keranjang <span>↗</span>";
            });
    }
}

/* =========================================================
   4. PRODUCT MENU
========================================================= */

function renderProducts() {
    const menuGrid = document.getElementById("menuGrid");

    if (!menuGrid) {
        return;
    }

    menuGrid.innerHTML = products.map((product) => `
        <article class="product-card ${product.colorClass}">
            <a
                href="${product.link}"
                class="product-card-image"
                aria-label="Lihat detail ${product.name}"
            >
                <div
                    class="product-card-carousel"
                    data-product-card-carousel
                    aria-label="Galeri ${product.name}"
                >
                    <div class="product-card-carousel-track">
                        ${product.images.map((image, index) => `
                            <img
                                src="${image}"
                                alt="${product.name} RIS Kitchen ${index + 1}"
                                loading="lazy"
                                class="${index === 0 ? "is-active" : ""}"
                            >
                        `).join("")}
                    </div>
                    <span class="product-card-dots" aria-hidden="true"></span>
                </div>
            </a>

            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-card-footer">
                    <span class="product-price">${product.price}</span>

                    <button
                        type="button"
                        class="product-add-button"
                        data-add-to-cart="${product.id}"
                    >
                        + Tambah
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

/* =========================================================
   5. REUSABLE CAROUSEL
========================================================= */

function initCarousel(root, options = {}) {
    const track = root.querySelector(
        ".hero-carousel-track, .product-carousel-track"
    );
    const slides = root.querySelectorAll(
        ".hero-carousel-slide, .product-carousel-slide"
    );

    if (!track || slides.length < 2) {
        return;
    }

    const prevButton = root.querySelector("[data-carousel-prev]");
    const nextButton = root.querySelector("[data-carousel-next]");
    const dotsContainer = root.querySelector("[data-carousel-dots]");

    let currentIndex = 0;
    let timer = null;

    const render = (index, animate = true) => {
        currentIndex = (index + slides.length) % slides.length;

        if (!animate) {
            track.classList.add("no-transition");
        }

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === currentIndex);
        });

        dotsContainer?.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === currentIndex);
        });

        if (!animate) {
            requestAnimationFrame(() => track.classList.remove("no-transition"));
        }
    };

    const restart = () => {
        window.clearInterval(timer);
        timer = window.setInterval(
            () => render(currentIndex + 1),
            options.interval || 4500
        );
    };

    prevButton?.addEventListener("click", () => {
        render(currentIndex - 1);
        restart();
    });

    nextButton?.addEventListener("click", () => {
        render(currentIndex + 1);
        restart();
    });

    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Tampilkan foto ${index + 1}`);
            dot.addEventListener("click", () => {
                render(index);
                restart();
            });
            dotsContainer.appendChild(dot);
        });
    }

    let startX = 0;

    root.addEventListener("touchstart", (event) => {
        startX = event.changedTouches[0].clientX;
    }, { passive: true });

    root.addEventListener("touchend", (event) => {
        const distance = event.changedTouches[0].clientX - startX;

        if (Math.abs(distance) < 45) {
            return;
        }

        render(currentIndex + (distance < 0 ? 1 : -1));
        restart();
    }, { passive: true });

    root.addEventListener("mouseenter", () => window.clearInterval(timer));
    root.addEventListener("mouseleave", restart);

    render(0, false);
    restart();
}

function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
        initCarousel(carousel);
    });

    document.querySelectorAll("[data-product-carousel]").forEach((carousel) => {
        initCarousel(carousel, { interval: 4000 });
    });
}

/* =========================================================
   6. MOBILE MENU
========================================================= */

function initMobileMenu() {
    const button = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!button || !mobileMenu) {
        return;
    }

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        });
    });
}

/* =========================================================
   7. NAVBAR ACTIVE LINK
========================================================= */

function initNavbar() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) {
        return;
    }

    function updateActiveLink() {
        let currentSection = "home";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 160;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`
            );
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
}

/* =========================================================
   8. SCROLL REVEAL
========================================================= */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".section-heading, .featured-card, .product-card, " +
        ".about-image-wrapper, .about-content, .fruit-content, " +
        ".fruit-visual, .contact-card"
    );

    revealElements.forEach((element) => element.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
}

/* =========================================================
   9. IMAGE HANDLING
========================================================= */

function initImageHandling() {
    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");
        });
    });
}

/* =========================================================
   10. PRODUCT CARD IMAGE ROTATION
========================================================= */

function initProductCardCarousels() {
    document.querySelectorAll("[data-product-card-carousel]").forEach((carousel) => {
        const images = carousel.querySelectorAll("img");

        if (images.length < 2) {
            return;
        }

        let index = 0;

        window.setInterval(() => {
            images[index].classList.remove("is-active");
            index = (index + 1) % images.length;
            images[index].classList.add("is-active");
        }, 4200);
    });
}

/* =========================================================
   11. PRODUCT CARD HOVER
========================================================= */

function initProductCards() {
    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
        card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"));
    });
}

/* =========================================================
   12. SMOOTH ANCHOR LINKS
========================================================= */

function initSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#" || targetID === "#order-modal") {
                return;
            }

            const target = document.querySelector(targetID);

            if (!target) {
                return;
            }

            event.preventDefault();

            const navbar = document.querySelector(".navbar");
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}

/* =========================================================
   13. CURRENT YEAR
========================================================= */

function initYear() {
    const currentYear = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = currentYear;
    });
}

/* =========================================================
   14. INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    initCartSystem();
    initOrderSystem();
    initMobileMenu();
    initNavbar();
    initScrollReveal();
    initImageHandling();
    initProductCards();
    initCarousels();
    initProductCardCarousels();
    initSmoothLinks();
    initYear();
});