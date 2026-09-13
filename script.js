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
        colorClass: "bg-orange",
        images: ["assets/Thai Tea 1.jpg", "assets/Thai tea 2.jpg"],
        description: "Thai tea creamy dengan rasa teh yang khas dan menyegarkan.",
        link: "thai-tea.html"
    },
    {
        id: "green-tea",
        name: "Green Tea",
        price: "Rp 15.000",
        colorClass: "bg-green",
        images: ["assets/Green Tea 1.jpg", "assets/Green Tea 2.jpg"],
        description: "Green tea ringan dan fresh untuk menemani hari kamu.",
        link: "green-tea.html"
    },
    {
        id: "cincau-gula-aren",
        name: "Cincau Gula Aren",
        price: "Rp 13.000",
        colorClass: "bg-yellow",
        images: ["assets/Cincau 1.jpg", "assets/Cincau 2.jpg"],
        description: "Perpaduan cincau yang lembut dengan manisnya gula aren.",
        link: "cincau-gula-aren.html"
    },
    {
        id: "kelapa-pandan",
        name: "Kelapa Pandan",
        price: "Rp 13.000",
        colorClass: "bg-green",
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
        colorClass: "bg-yellow",
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
   2. ORDER MODAL
========================================================= */

let orderModal;
let orderModalLastTrigger;

function getOrderProduct(trigger) {
    if (trigger?.dataset.product) {
        return {
            name: trigger.dataset.product,
            price: trigger.dataset.price || ""
        };
    }

    const pageProduct = getPageProduct();

    return pageProduct
        ? { name: pageProduct.name, price: pageProduct.price }
        : null;
}

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
                    <span>Area Umum</span>
                    <span>↗</span>
                </button>
                <button type="button" class="order-area-button" data-order-area="unj">
                    <span>Area UNJ</span>
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

function openOrderModal(trigger) {
    createOrderModal();

    orderModalLastTrigger = trigger || document.activeElement;

    const product = getOrderProduct(trigger);
    orderModal.dataset.productName = product?.name || "";
    orderModal.dataset.productPrice = product?.price || "";

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

function submitOrder(area) {
    const number = area === "unj" ? WHATSAPP_UNJ : WHATSAPP_GENERAL;
    const areaName = area === "unj" ? "Area UNJ" : "Area Umum";
    const productName = orderModal?.dataset.productName;
    const productPrice = orderModal?.dataset.productPrice;

    const lines = [
        "Halo RIS Kitchen!",
        "",
        productName
            ? `Saya ingin order:
Produk: ${productName}
Harga: ${productPrice}
Area: ${areaName}`
            : `Saya ingin order.
Area: ${areaName}`,
        "",
        "Terima kasih!"
    ];

    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;

    closeOrderModal();
    window.open(url, "_blank", "noopener,noreferrer");
}

function initOrderSystem() {
    createOrderModal();

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-order]");
        if (!trigger) {
            return;
        }

        event.preventDefault();
        openOrderModal(trigger);
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
                button.dataset.order = "";
                button.dataset.product = pageProduct.name;
                button.dataset.price = pageProduct.price;
                button.removeAttribute("href");
                button.removeAttribute("target");
            });
    }
}

/* =========================================================
   3. PRODUCT MENU
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

                    <a href="${product.link}" class="product-view-button">
                        Lihat Produk ↗
                    </a>
                </div>
            </div>
        </article>
    `).join("");
}

/* =========================================================
   4. REUSABLE CAROUSEL
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
   5. MOBILE MENU
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
   6. NAVBAR ACTIVE LINK
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
   7. SCROLL REVEAL
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
   8. IMAGE HANDLING
========================================================= */

function initImageHandling() {
    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");
        });
    });
}

/* =========================================================
   9. PRODUCT CARD IMAGE ROTATION
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
   10. PRODUCT CARD HOVER
========================================================= */

function initProductCards() {
    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
        card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"));
    });
}

/* =========================================================
   11. SMOOTH ANCHOR LINKS
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
   12. CURRENT YEAR
========================================================= */

function initYear() {
    const currentYear = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = currentYear;
    });
}

/* =========================================================
   13. INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
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
