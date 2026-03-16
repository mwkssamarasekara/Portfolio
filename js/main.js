/**
 * main.js – Kovindu Sanjumal Portfolio
 * Handles: Preloader, Navigation, Typing Effect,
 *   Scroll Animations, Project Filtering,
 *   Form Validation, Dark/Light Mode, Back-to-Top,
 *   Particles, AOS Init
 */

'use strict';

/* ========================
   UTILITY HELPERS
   ======================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ========================
   PRELOADER
   ======================== */
window.addEventListener('load', () => {
    const preloader = $('#preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        // Init AOS after preloader hides
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
        });
        // Trigger progress bars
        animateProgressBars();
    }, 1800);
});
document.body.style.overflow = 'hidden'; // prevent scroll during preload

/* ========================
   NAVIGATION
   ======================== */
const navbar = $('#navbar');
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
const mobileOverlay = $('#mobileOverlay');
const allNavLinks = $$('.nav-link');

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
    handleBackToTop();
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

function toggleMobileMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    mobileOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu on link click (mobile)
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Active link based on scroll
function updateActiveLink() {
    const sections = $$('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionH = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionH) {
            allNavLinks.forEach(l => l.classList.remove('active'));
            const activeLink = $(`a[href="#${id}"]`, navbar);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

/* ========================
   TYPING EFFECT
   ======================== */
const typedEl = $('#typedText');
const phrases = [
    'MIS Undergraduate',
    'Software Developer',
    'Future QA Engineer',
    'Tech Enthusiast',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function type() {
    const current = phrases[phraseIdx];
    const displayText = isDeleting
        ? current.slice(0, charIdx--)
        : current.slice(0, charIdx++);

    typedEl.textContent = displayText;

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx > current.length) {
        delay = 1800; isDeleting = true;
    } else if (isDeleting && charIdx < 0) {
        isDeleting = false; charIdx = 0;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(type, delay);
}
type();

/* ========================
   DYNAMIC PARTICLES (hero bg)
   ======================== */
(function createParticles() {
    const container = $('#particles');
    if (!container) return;
    const count = 45;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'particle';
        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const delay = Math.random() * 12;
        const dur = Math.random() * 8 + 8;
        const opacity = Math.random() * 0.5 + 0.05;
        Object.assign(dot.style, {
            position: 'absolute',
            left: `${x}%`,
            bottom: `-10px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: `rgba(100,255,218,${opacity})`,
            animation: `rise ${dur}s ${delay}s linear infinite`,
        });
        container.appendChild(dot);
    }
    // Inject keyframes if not present
    if (!document.querySelector('#particle-style')) {
        const st = document.createElement('style');
        st.id = 'particle-style';
        st.textContent = `
      @keyframes rise {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        10%  { opacity: 1; }
        50%  { transform: translateY(-50vh) translateX(20px); }
        90%  { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(-30px); opacity: 0; }
      }
    `;
        document.head.appendChild(st);
    }
})();

/* ========================
   PROJECT FILTERING
   ======================== */
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            if (match) {
                card.style.display = '';
                setTimeout(() => card.classList.remove('hidden'), 10);
            } else {
                card.classList.add('hidden');
                setTimeout(() => { if (card.classList.contains('hidden')) card.style.display = 'none'; }, 350);
            }
        });
    });
});

/* ========================
   SKILL PROGRESS BARS
   ======================== */
function animateProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                fill.style.width = fill.dataset.width + '%';
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    $$('.progress-fill').forEach(fill => observer.observe(fill));
}

/* ========================
   CONTACT FORM VALIDATION
   ======================== */
const contactForm = $('#contactForm');
const formSuccess = $('#formSuccess');
const submitBtn = $('#submitBtn');

function validateField(id, errorId, validator, message) {
    const field = $(`#${id}`);
    const error = $(`#${errorId}`);
    if (!field) return true;
    const valid = validator(field.value.trim());
    field.classList.toggle('error', !valid);
    error.textContent = valid ? '' : message;
    return valid;
}

function isNotEmpty(v) { return v.length > 0; }
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

// Real-time inline validation
['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(id => {
    const el = $(`#${id}`);
    if (el) {
        el.addEventListener('input', () => {
            el.classList.remove('error');
            const errEl = $(`#${id.replace('contact', '').toLowerCase()}Error`);
            if (errEl) errEl.textContent = '';
        });
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const v1 = validateField('contactName', 'nameError', isNotEmpty, 'Please enter your full name.');
        const v2 = validateField('contactEmail', 'emailError', isValidEmail, 'Please enter a valid email address.');
        const v3 = validateField('contactSubject', 'subjectError', isNotEmpty, 'Please enter a subject.');
        const v4 = validateField('contactMessage', 'messageError', v => v.length >= 10, 'Message must be at least 10 characters.');

        if (v1 && v2 && v3 && v4) {
            // Simulate form submission (replace with actual backend/emailjs)
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                formSuccess.style.display = 'block';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
            }, 1500);
        }
    });
}

/* ========================
   DARK / LIGHT MODE TOGGLE
   ======================== */
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');

// Load saved preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
});

/* ========================
   BACK TO TOP BUTTON
   ======================== */
const backToTopBtn = $('#backToTop');

function handleBackToTop() {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================
   SMOOTH SCROLL POLYFILL
   (for older browsers)
   ======================== */
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ========================
   SCROLL-TRIGGERED COUNTER ANIMATION
   (Leadership stats)
   ======================== */
const statNums = $$('.lstat-num');
let countersRan = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersRan) {
            countersRan = true;
            statNums.forEach(el => {
                const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
                const suffix = el.textContent.replace(/[0-9]/g, '');
                let current = 0;
                const step = Math.ceil(target / 30);
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = current + suffix;
                    if (current >= target) clearInterval(timer);
                }, 50);
            });
        }
    });
}, { threshold: 0.5 });

const leadershipSection = $('#leadership');
if (leadershipSection) counterObserver.observe(leadershipSection);

/* ========================
   NAVBAR KEYBOARD ACCESSIBILITY
   ======================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

/* ========================
   INIT LOG
   ======================== */
console.log('%c🚀 Portfolio | Kovindu Sanjumal Samarasekara', 'color:#64ffda;font-size:14px;font-weight:bold;');
console.log('%c Built with ❤️ | MIS Undergraduate @ NSBM', 'color:#8892b0;font-size:12px;');
