// Performance optimizations
if (typeof IntersectionObserver !== 'undefined') {
    // Lazy loading for animations
    IntersectionObserver.prototype.POLYFILL = false;
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions with error handling
    try {
        initTheme();
        initNavigation();
        initScrollEffects();
        initContactForm();
        initAnimations();
        initSmoothScrolling();
        initCounterAnimations();
        initMagneticButtons();
        initTiltEffects();
        initCursorTrail();
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
});

// Theme functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    applyTheme(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        saveTheme(newTheme);
    });
}

function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    // Remove existing theme
    body.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.classList.add('active');
    } else {
        body.removeAttribute('data-theme');
        themeToggle.classList.remove('active');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
    }
    
    // Force reflow to ensure smooth transition
    body.offsetHeight;
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// Navigation functionality
function initNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .feature-item, .testimonial-card');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Validate form
        if (validateForm(formObject)) {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Gönderiliyor...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    });
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    // Required fields validation
    if (!formData.name.trim()) {
        errors.push('Ad Soyad alanı zorunludur.');
    }
    
    if (!formData.email.trim()) {
        errors.push('E-posta alanı zorunludur.');
    } else if (!isValidEmail(formData.email)) {
        errors.push('Geçerli bir e-posta adresi giriniz.');
    }
    
    if (!formData.service) {
        errors.push('Lütfen bir hizmet seçiniz.');
    }
    
    if (!formData.message.trim()) {
        errors.push('Mesaj alanı zorunludur.');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#20C997' : type === 'error' ? '#dc3545' : '#0A2647'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Animations
function initAnimations() {
    // Add CSS for notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter animation for statistics (if needed)
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            counter.textContent = Math.floor(current);
            
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (field.value) {
            field.parentElement.classList.add('focused');
        }
    });
});

// Parallax effect disabled - floating cards stay fixed
function initParallax() {
    // Parallax disabled to keep floating cards in place
    // This prevents the floating cards from moving down when scrolling
}

// Initialize parallax (disabled)
if (document.querySelector('.hero')) {
    initParallax();
}

// Portfolio modal functionality (if needed)
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            const image = this.querySelector('img').src;
            
            showPortfolioModal(title, description, image);
        });
    });
}

function showPortfolioModal(title, description, image) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        animation: slideInUp 0.3s ease-out;
    `;
    
    modalContent.innerHTML = `
        <button class="modal-close" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        ">&times;</button>
        <img src="${image}" alt="${title}" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;">
        <h3 style="color: #0A2647; margin-bottom: 1rem;">${title}</h3>
        <p style="color: #666; line-height: 1.6;">${description}</p>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close modal functionality
    const closeModal = () => {
        modalOverlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modalOverlay.remove(), 300);
    };
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Add modal animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize portfolio modal if portfolio items exist
if (document.querySelectorAll('.portfolio-item').length > 0) {
    initPortfolioModal();
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based functionality here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);


// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Magnetic Button Effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Tilt Effect for Cards
function initTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Cursor Trail Effect - Optimized
function initCursorTrail() {
    const cursorTrail = document.querySelector('.cursor-trail');
    if (!cursorTrail) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let isMoving = false;
    let animationId;
    
    const throttledMouseMove = throttle(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
    }, 16); // 60fps
    
    document.addEventListener('mousemove', throttledMouseMove);
    
    function animateTrail() {
        if (isMoving) {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            cursorTrail.style.opacity = '0.6';
        } else {
            cursorTrail.style.opacity = '0';
        }
        
        animationId = requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
    
    // Hide trail when mouse leaves window
    document.addEventListener('mouseleave', function() {
        cursorTrail.style.opacity = '0';
        isMoving = false;
    });
    
    document.addEventListener('mouseenter', function() {
        isMoving = true;
    });
    
    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Console welcome message
console.log(`
🚀 Pixeliz Dijital Web Sitesi - REVOLUTIONARY EDITION
====================================================
İşletmenizi Büyüten Kodlar, Etkileyen Tasarımlar

✨ Revolutionary Features:
- Glassmorphism & Neumorphism Design
- Interactive Geometric Backgrounds
- Cursor Trail Effects
- Floating Orb Animations
- 3D Neumorphic Cards
- Gradient Text Animations
- Asymmetric Layout Design
- Advanced Visual Effects

Web sitesi başarıyla yüklendi!
Geliştirici: Pixeliz Dijital
Versiyon: 3.0.0 - REVOLUTIONARY EDITION
`);

// Error handling for external resources
window.addEventListener('error', function(e) {
    console.warn('Bir kaynak yüklenirken hata oluştu:', e.target.src || e.target.href);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker kayıt başarılı:', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker kayıt başarısız:', error);
            });
    });
}
