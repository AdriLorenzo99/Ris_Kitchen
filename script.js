/* =========================================================
   RIS KITCHEN
   Main JavaScript
========================================================= */


/* =========================================================
   1. PRODUCT DATA
========================================================= */

const products = [
    {
        id: 1,
        name: "Cincau Gula Aren",
        price: "Rp 13.000",
        priceNumber: "13,000",
        colorClass: "bg-yellow",
        images: ["assets/Cincau Gula Aren.webp", "assets/Cincau Gula Aren2.webp"],
        description: "Perpaduan cincau yang lembut dengan manisnya gula aren.",
        link: "cincau-gula-aren.html"
    },

    {
        id: 2,
        name: "Thai Tea",
        price: "Rp 15.000",
        priceNumber: "15,000",
        colorClass: "bg-orange",
        images: ["assets/Thai Tea.webp", "assets/Thai Tea2.webp"],
        description: "Thai tea creamy dengan rasa teh yang khas dan menyegarkan.",
        link: "thai-tea.html"
    },

    {
        id: 3,
        name: "Green Tea",
        price: "Rp 15.000",
        priceNumber: "15,000",
        colorClass: "bg-green",
        images: ["assets/Green Tea.webp", "assets/Green Tea 2.webp"],
        description: "Green tea ringan dan fresh untuk menemani hari kamu.",
        link: "green-tea.html"
    },

    {
        id: 4,
        name: "Cold Pressed Juice (Semangka & Nanas)",
        price: "Rp 20.000",
        priceNumber: "20,000",
        colorClass: "bg-white",

        /*
         * Tidak mengganti atau membuat aset baru.
         * Untuk produk yang belum memiliki foto khusus,
         * gunakan visual yang sudah tersedia di project.
         */
        images: ["assets/3 Menu.webp", "assets/3 Menu 2.webp"],

        description: "Perpaduan segarnya semangka dan nanas dalam cold pressed juice.",
        link: "cold-pressed-semangka-nanas.html"
    },

    {
        id: 5,
        name: "Cold Pressed Juice (Pear & Nanas)",
        price: "Rp 20.000",
        priceNumber: "20,000",
        colorClass: "bg-yellow",

        /*
         * Mempertahankan aset yang sudah ada.
         */
        images: ["assets/3 Menu 2.webp", "assets/3 Menu.webp"],

        description: "Perpaduan pear dan nanas yang ringan, fresh, dan menyegarkan.",
        link: "cold-pressed-pear-nanas.html"
    },

    {
        id: 6,
        name: "Kelapa Pandan",
        price: "Rp 13.000",
        priceNumber: "13,000",
        colorClass: "bg-green",

        /*
         * Mempertahankan aset yang sudah ada.
         */
        images: ["assets/Green Tea.webp", "assets/Green Tea 2.webp"],

        description: "Kesegaran kelapa dengan aroma pandan yang lembut.",
        link: "kelapa-pandan.html"
    }
];


/* =========================================================
   2. WHATSAPP
========================================================= */

const WHATSAPP_NUMBER = "6285711544265";


function orderWhatsApp(productName, productPrice) {

    const message =
        `Halo RIS Kitchen, saya ingin order ${productName} seharga ${productPrice}.`;

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
}


/* =========================================================
   3. RENDER PRODUCT MENU
========================================================= */

function renderProducts() {

    const menuGrid = document.getElementById("menuGrid");

    if (!menuGrid) {
        return;
    }

    menuGrid.innerHTML = "";


    products.forEach((product) => {

        const card = document.createElement("article");

        card.className = `product-card ${product.colorClass}`;


        card.innerHTML = `
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

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>


                <div class="product-card-footer">

                    <span class="product-price">
                        ${product.price}
                    </span>

                    <a
                        href="${product.link}"
                        class="product-view-button"
                    >
                        Lihat Produk ↗
                    </a>

                </div>

            </div>
        `;


        menuGrid.appendChild(card);

    });
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
            slide.classList.toggle(
                "is-active",
                slideIndex === currentIndex
            );
        });

        if (!animate) {
            requestAnimationFrame(() => {
                track.classList.remove("no-transition");
            });
        }

        if (dotsContainer) {
            dotsContainer
                .querySelectorAll("button")
                .forEach((dot, dotIndex) => {
                    dot.classList.toggle(
                        "is-active",
                        dotIndex === currentIndex
                    );
                });
        }
    };

    const goTo = (index) => {
        render(index);
        restart();
    };

    const restart = () => {
        if (timer) {
            clearInterval(timer);
        }

        timer = setInterval(() => {
            render(currentIndex + 1);
        }, options.interval || 4500);
    };

    if (prevButton) {
        prevButton.addEventListener("click", () => {
            goTo(currentIndex - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            goTo(currentIndex + 1);
        });
    }

    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Tampilkan foto ${index + 1}`);

            dot.addEventListener("click", () => {
                goTo(index);
            });

            dotsContainer.appendChild(dot);
        });
    }

    let startX = 0;

    root.addEventListener(
        "touchstart",
        (event) => {
            startX = event.changedTouches[0].clientX;
        },
        { passive: true }
    );

    root.addEventListener(
        "touchend",
        (event) => {
            const endX = event.changedTouches[0].clientX;
            const distance = endX - startX;

            if (Math.abs(distance) < 45) {
                return;
            }

            goTo(currentIndex + (distance < 0 ? 1 : -1));
        },
        { passive: true }
    );

    root.addEventListener("mouseenter", () => {
        if (timer) {
            clearInterval(timer);
        }
    });

    root.addEventListener("mouseleave", restart);

    render(0, false);
    restart();
}


function initCarousels() {
    document
        .querySelectorAll("[data-carousel]")
        .forEach((carousel) => {
            initCarousel(carousel);
        });

    document
        .querySelectorAll("[data-product-carousel]")
        .forEach((carousel) => {
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


    button.addEventListener("click", () => {

        mobileMenu.classList.toggle("open");

    });


    /*
     * Tutup mobile menu ketika link diklik.
     */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");

        });

    });

}


/* =========================================================
   5. NAVBAR ACTIVE LINK
========================================================= */

function initNavbar() {

    const sections =
        document.querySelectorAll("main section[id]");

    const navLinks =
        document.querySelectorAll(".nav-link");


    if (!sections.length || !navLinks.length) {
        return;
    }


    function updateActiveLink() {

        let currentSection = "home";


        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop - 160;

            const sectionBottom =
                sectionTop + section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {

                currentSection = section.id;

            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");


            const href =
                link.getAttribute("href");


            if (href === `#${currentSection}`) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveLink,
        { passive: true }
    );


    updateActiveLink();

}


/* =========================================================
   6. SCROLL REVEAL
========================================================= */

function initScrollReveal() {

    /*
     * Tambahkan class reveal ke elemen
     * yang ingin dianimasikan.
     */

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".featured-card, " +
        ".product-card, " +
        ".about-image-wrapper, " +
        ".about-content, " +
        ".fruit-content, " +
        ".fruit-visual, " +
        ".contact-card"
    );


    revealElements.forEach((element) => {

        element.classList.add("reveal");

    });


    /*
     * Jika browser tidak mendukung
     * IntersectionObserver, tampilkan semuanya.
     */

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add("visible");


                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {

        observer.observe(element);

    });

}


/* =========================================================
   7. IMAGE ERROR HANDLING
========================================================= */

function initImageHandling() {

    const images =
        document.querySelectorAll("img");


    images.forEach((image) => {

        image.addEventListener("error", () => {

            /*
             * Jangan membuat gambar baru.
             * Jika aset benar-benar tidak ditemukan,
             * beri tampilan netral agar layout tidak rusak.
             */

            image.style.display = "none";

            const parent =
                image.closest(
                    ".product-card-image, " +
                    ".hero-image-main, " +
                    ".hero-image-secondary, " +
                    ".featured-image, " +
                    ".about-image-wrapper, " +
                    ".fruit-image-large"
                );


            if (parent) {

                parent.classList.add(
                    "image-error"
                );

            }

        });

    });

}


/* =========================================================
   9. PRODUCT CARD IMAGE ROTATION
========================================================= */

function initProductCardCarousels() {
    document
        .querySelectorAll("[data-product-card-carousel]")
        .forEach((carousel) => {
            const images = carousel.querySelectorAll("img");

            if (images.length < 2) {
                return;
            }

            let index = 0;

            setInterval(() => {
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

    const cards =
        document.querySelectorAll(".product-card");


    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.classList.add("is-hovered");

        });


        card.addEventListener("mouseleave", () => {

            card.classList.remove("is-hovered");

        });

    });

}


/* =========================================================
   9. SMOOTH ANCHOR LINKS
========================================================= */

function initSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetID =
                link.getAttribute("href");


            if (
                !targetID ||
                targetID === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetID);


            if (!target) {
                return;
            }


            event.preventDefault();


            const navbar =
                document.querySelector(".navbar");


            const navbarHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;


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
   10. WHATSAPP BUTTONS
========================================================= */

function initWhatsAppButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-whatsapp-product]"
        );


    buttons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();


            const productName =
                button.dataset.whatsappProduct ||
                "produk RIS Kitchen";


            const productPrice =
                button.dataset.whatsappPrice ||
                "";


            orderWhatsApp(
                productName,
                productPrice
            );

        });

    });

}


/* =========================================================
   11. CURRENT YEAR
========================================================= */

function initYear() {

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    const currentYear =
        new Date().getFullYear();


    yearElements.forEach((element) => {

        element.textContent =
            currentYear;

    });

}


/* =========================================================
   12. INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        initMobileMenu();

        initNavbar();

        initScrollReveal();

        initImageHandling();

        initProductCards();

        initCarousels();

        initProductCardCarousels();

        initSmoothLinks();

        initWhatsAppButtons();

        initYear();

    }
);