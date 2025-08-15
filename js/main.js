// Main JavaScript for Prestige Properties - Optimized for Performance

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
// Cache DOM elements for better performance
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');

// Mobile menu toggle and close - Optimized
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
        menuToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('show'));
    });
}

if (closeMobileMenu && mobileMenu) {
    closeMobileMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('show');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Optimized smooth scrolling with passive listeners
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu on navigation
                if (mobileMenu?.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    menuToggle?.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
});

// Close mobile menu when clicking outside - Optimized
document.addEventListener('click', function(e) {
    if (mobileMenu?.classList.contains('show') && 
        !mobileMenu.contains(e.target) && 
        !menuToggle?.contains(e.target)) {
        mobileMenu.classList.remove('show');
        menuToggle?.setAttribute('aria-expanded', 'false');
    }
}, { passive: true });

// Optimized Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Fade-in observer with cleanup
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Batch DOM queries for better performance
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => fadeInObserver.observe(el));

// Slide-in animation observer (reversible) - Optimized
const slideInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('animate', entry.isIntersecting);
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('.slide-in-left').forEach(el => {
    slideInObserver.observe(el);
});

// Optimized lazy loading
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
            }, { once: true });
            imageObserver.unobserve(img);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.classList.add('lazy');
    imageObserver.observe(img);
});

// Optimized Partner Carousel
function initPartnerCarousel() {
    const carousel = document.querySelector('.partners-carousel');
    const track = document.querySelector('.carousel-track');
    
    if (!carousel || !track) return;
    
    // Use passive listeners for better scroll performance
    carousel.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    }, { passive: true });
    
    carousel.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    }, { passive: true });
    
    // Visibility API for performance
    document.addEventListener('visibilitychange', () => {
        track.style.animationPlayState = document.hidden ? 'paused' : 'running';
    }, { passive: true });
    
    // Optimized touch handling
    let startX = 0;
    let currentTransform = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        track.style.animationPlayState = 'paused';
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (startX) {
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            currentTransform -= diffX * 0.5;
            track.style.transform = `translateX(${currentTransform}px)`;
            startX = currentX;
        }
    }, { passive: true });
    
    carousel.addEventListener('touchend', function() {
        startX = 0;
        setTimeout(() => {
            track.style.transform = '';
            track.style.animationPlayState = 'running';
            currentTransform = 0;
        }, 300);
    }, { passive: true });
}

// Initialize carousel
initPartnerCarousel();

}); // End DOMContentLoaded

// Enhanced scroll effects with optimized throttling
let scrollTicking = false;
const navbar = document.getElementById('navbar');

// Navbar scroll effect with improved performance
window.addEventListener('scroll', function() {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 100);
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// Optimized scroll progress with reduced parallax interference
let parallaxTicking = false;
window.addEventListener('scroll', function() {
    if (!parallaxTicking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Scroll progress
            const documentHeight = document.documentElement.scrollHeight;
            
            if (documentHeight > windowHeight) {
                const scrollPercent = (scrolled / (documentHeight - windowHeight)) * 100;
                document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
            }
            
            // Reduced parallax interference - let slideshow.js handle hero parallax
            // Only apply to other elements to avoid conflicts
            const nonHeroElements = document.querySelectorAll('.parallax-element:not(.hero-slideshow)');
            if (scrolled < windowHeight && nonHeroElements.length > 0) {
                nonHeroElements.forEach(element => {
                    element.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
                });
            }
            
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
}, { passive: true });
