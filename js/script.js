document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                mobileMenu.classList.remove('active');
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(224, 225, 221, 0.98)';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.padding = '2rem 0';
                navLinks.style.alignItems = 'center';
                navLinks.style.boxShadow = '0 10px 15px -3px rgba(27, 38, 59, 0.1)';
                navLinks.style.borderBottom = '1px solid rgba(119, 141, 169, 0.2)';
                mobileMenu.classList.add('active');
            }
        });
    }

    // Close menu when a link is clicked (for mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });

    // Reset styles if window resizes past mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'row';
            navLinks.style.position = 'static';
            navLinks.style.padding = '0';
            navLinks.style.boxShadow = 'none';
            navLinks.style.borderBottom = 'none';
            navLinks.style.alignItems = 'normal';
            navLinks.style.backgroundColor = 'transparent';
            navLinks.style.backdropFilter = 'none';
            if (mobileMenu) mobileMenu.classList.remove('active');
        } else {
            navLinks.style.display = 'none';
            if (mobileMenu) mobileMenu.classList.remove('active');
        }
    });

    // 2. Active Link & Navbar Scrolled State
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                const id = section.getAttribute('id');
                if (id) {
                    current = id;
                }
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') && item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // 3. Contact Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = "Sending...";

            setTimeout(() => {
                alert("Thank you! Your message has been sent successfully.");
                btn.textContent = originalText;
                contactForm.reset();
            }, 1000);
        });
    }

    // 4. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it's visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial setup for elements to animate

    // Cards
    const cards = document.querySelectorAll('.card, .sub-card, .about-card, .method-step, .contact-card');
    cards.forEach((card, index) => {
        card.classList.add('fade-up');
        // Add staggered delays for grid items based on index
        if (index % 3 === 1) card.classList.add('delay-100');
        if (index % 3 === 2) card.classList.add('delay-200');
        if (index % 4 === 1) card.classList.add('delay-100');
        if (index % 4 === 2) card.classList.add('delay-200');
        if (index % 4 === 3) card.classList.add('delay-300');
        observer.observe(card);
    });

    // Section Titles
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        title.classList.add('fade-up');
        observer.observe(title);
    });

    // Category Headers in Services
    const catHeaders = document.querySelectorAll('.category-header');
    catHeaders.forEach(header => {
        header.classList.add('fade-up');
        observer.observe(header);
    });

    // Trigger initial hero animation (doesn't need intersection observer as it's always in view on load)
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

    // 5. Language Toggle Handling
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = localStorage.getItem('site_lang') || 'en';

    function setLanguage(lang) {
        if (typeof translations === 'undefined' || !translations[lang]) return;

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update placeholder texts
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update button text to show the language that WILL be switched to next
        langText.textContent = lang === 'en' ? 'ES' : 'EN';
        document.documentElement.lang = lang;
        localStorage.setItem('site_lang', lang);
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(currentLang);
        });

        // Initialize language
        setLanguage(currentLang);
    }
});
