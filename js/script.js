document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle — uses CSS class instead of inline styles
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close menu when a nav link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    });

    // Reset mobile menu state on resize past breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('mobile-open');
            if (mobileMenu) mobileMenu.classList.remove('active');
        }
    });

    // 2. Active Link & Navbar Scrolled State (debounced via rAF)
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    let scrollTicking = false;

    function onScroll() {
        // Navbar shrink on scroll
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.id;
            }
        });

        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href').slice(1) === current);
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(onScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    // 3. Contact Form Submission Handling (with Formspree and reCAPTCHA)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check reCAPTCHA
            if (typeof grecaptcha !== 'undefined') {
                const response = grecaptcha.getResponse();
                if (!response) {
                    alert("Please complete the reCAPTCHA.");
                    return;
                }
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = "Sending...";
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert("Thank you! Your message has been sent successfully.");
                    contactForm.reset();
                    if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            } catch (error) {
                alert("Oops! There was a problem submitting your form.");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // 4. Scroll Reveal Animations
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Staggered card animations
    const cards = document.querySelectorAll('.card, .sub-card, .about-card, .method-step, .contact-card');
    const delays = ['', 'delay-100', 'delay-200', 'delay-300'];

    cards.forEach((card, index) => {
        card.classList.add('fade-up');
        const delayClass = delays[index % delays.length];
        if (delayClass) {
            card.classList.add(delayClass);
        }
        observer.observe(card);
    });

    // Section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('fade-up');
        observer.observe(title);
    });

    // Category headers
    document.querySelectorAll('.category-header').forEach(header => {
        header.classList.add('fade-up');
        observer.observe(header);
    });

    // Badge items (Certifications)
    document.querySelectorAll('.badge-item').forEach((badge, index) => {
        badge.classList.add('fade-up');
        const delayClass = delays[index % delays.length];
        if (delayClass) {
            badge.classList.add(delayClass);
        }
        observer.observe(badge);
    });

    // Hero entrance animation (always in view on load)
    setTimeout(() => {
        document.querySelectorAll('.hero-content h1, .hero-content p, .hero-btns').forEach((el, index) => {
            el.classList.add('fade-up');
            setTimeout(() => el.classList.add('visible'), index * 200 + 100);
        });

        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.classList.add('fade-up');
            setTimeout(() => heroVisual.classList.add('visible'), 500);
        }
    }, 100);

    // 5. Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = localStorage.getItem('site_lang') || 'en';

    function setLanguage(lang) {
        if (typeof translations === 'undefined' || !translations[lang]) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const text = translations[lang][el.getAttribute('data-i18n')];
            if (text) el.innerHTML = text;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const text = translations[lang][el.getAttribute('data-i18n-placeholder')];
            if (text) el.placeholder = text;
        });

        langText.textContent = lang === 'en' ? 'ES' : 'EN';
        document.documentElement.lang = lang;
        localStorage.setItem('site_lang', lang);
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(currentLang);
        });

        setLanguage(currentLang);
    }


    // 6. Portfolio Image Modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const visitLink = document.getElementById("visitLink");
    const closeBtn = modal ? modal.querySelector(".close") : null;

    if (modal && modalImg && visitLink) {
        document.querySelectorAll(".portfolio-item").forEach(item => {
            item.style.cursor = "pointer";
            item.addEventListener("click", () => {
                const img = item.querySelector(".portfolio-img");
                if (img) {
                    modal.classList.add("active");
                    modalImg.src = img.src;
                    visitLink.href = img.dataset.link || "#";
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                modal.classList.remove("active");
            }
        });
    }

});
