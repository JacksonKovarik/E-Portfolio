// Minimal JavaScript - Scroll Effects Moved to CSS
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM Elements once to reduce queries
    const domCache = {
        nav: document.getElementById('nav'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navMenuContainer: document.querySelector('.nav__menu-container'),
        navLinks: document.querySelectorAll('.nav__link'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('.theme-toggle__icon'),
        sections: document.querySelectorAll('section[id]'),
        contactForm: document.getElementById('contact-form'),
        body: document.body,
        typedTextSpan: document.getElementById("typed-text"),
        cursorSpan: document.querySelector(".cursor")
    };

    // Utility functions for performance
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Theme Management - No changes needed
    class ThemeManager {
        constructor() {
            this.currentTheme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            this.init();
        }

        init() {
            this.applyTheme(this.currentTheme);
            this.updateThemeIcon();
            domCache.themeToggle?.addEventListener('click', () => {
                this.toggle();
            });
        }

        toggle() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(this.currentTheme);
            this.updateThemeIcon();
            localStorage.setItem('theme', this.currentTheme);
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-color-scheme', theme);
        }

        updateThemeIcon() {
            if (domCache.themeIcon) {
                domCache.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }
    }

    // Navigation Management - Minimal JavaScript
    class Navigation {
        constructor() {
            this.isMenuOpen = false;
            this.init();
        }

        init() {
            // Only essential JavaScript - scroll effects moved to CSS
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupActiveLink();
        }

        setupMobileMenu() {
            domCache.navToggle?.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking on a link
            domCache.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMenuOpen) {
                        this.toggleMobileMenu();
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !domCache.nav?.contains(e.target)) {
                    this.toggleMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            
            // Use CSS classes for all state changes
            domCache.navToggle?.classList.toggle('active');
            domCache.navMenu?.classList.toggle('active');
            domCache.navMenuContainer?.classList.toggle('active');
            domCache.body.classList.toggle('menu-open', this.isMenuOpen);
        }

        setupSmoothScroll() {
            // Keep this as it's more reliable than CSS scroll-behavior in some cases
            domCache.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        setupActiveLink() {
            // Minimal IntersectionObserver - only for active states
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
                        
                        // Remove active class from all links
                        domCache.navLinks.forEach(link => link.classList.remove('active'));
                        // Add active class to current link
                        activeLink?.classList.add('active');
                    }
                });
            }, {
                root: null,
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            });

            domCache.sections.forEach(section => {
                observer.observe(section);
            });
        }
    }

    // Form Management - CSS-based validation states
    class FormManager {
        constructor() {
            this.validationRules = {
                name: { minLength: 2, message: 'Name must be at least 2 characters long' },
                email: { 
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                    message: 'Please enter a valid email address' 
                },
                subject: { minLength: 5, message: 'Subject must be at least 5 characters long' },
                message: { minLength: 10, message: 'Message must be at least 10 characters long' }
            };
            this.init();
        }

        init() {
            this.setupContactForm();
        }

        setupContactForm() {
            domCache.contactForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });

            // Add real-time validation with debounced input
            const formInputs = domCache.contactForm?.querySelectorAll('input, textarea');
            formInputs?.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                // Debounce input validation to reduce function calls
                input.addEventListener('input', debounce(() => {
                    this.clearFieldError(input);
                }, 300));
            });
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            const rule = this.validationRules[fieldName];
            
            if (!rule) return true;

            let isValid = true;
            let errorMessage = '';

            // Clear previous errors
            this.clearFieldError(field);

            // Validation logic
            if (rule.minLength && value.length < rule.minLength) {
                isValid = false;
                errorMessage = rule.message;
            } else if (rule.pattern && !rule.pattern.test(value)) {
                isValid = false;
                errorMessage = rule.message;
            }

            if (!isValid) {
                this.showFieldError(field, errorMessage);
            }

            return isValid;
        }

        showFieldError(field, message) {
            // Use CSS class instead of inline styles
            field.classList.add('form-control--error');
            
            // Create or update error message
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }

        clearFieldError(field) {
            field.classList.remove('form-control--error');
            const errorElement = field.parentNode.querySelector('.field-error');
            errorElement?.remove();
        }

        handleFormSubmission(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate all fields
            const fields = form.querySelectorAll('input, textarea');
            let isFormValid = true;
            
            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                this.showNotification('Please fix the errors below', 'error');
                return;
            }

            // Show loading state using CSS class
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.classList.add('btn--loading');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                
                // Reset button
                submitButton.classList.remove('btn--loading');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }

        showNotification(message, type = 'info') {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            existingNotification?.remove();

            // Create notification using CSS classes (no inline styles)
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.innerHTML = `
                <div class="notification__content">
                    <div class="notification__icon">
                        ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
                    </div>
                    <span class="notification__message">${message}</span>
                    <button class="notification__close" aria-label="Close notification">&times;</button>
                </div>
            `;

            // Add to DOM
            document.body.appendChild(notification);

            // Show notification with CSS animation (no JavaScript transforms)
            requestAnimationFrame(() => {
                notification.classList.add('notification--show');
            });

            // Close button functionality
            const closeButton = notification.querySelector('.notification__close');
            closeButton.addEventListener('click', () => {
                this.hideNotification(notification);
            });

            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideNotification(notification);
            }, 5000);
        }

        hideNotification(notification) {
            notification.classList.add('notification--hide');
            setTimeout(() => {
                notification.remove();
            }, 300); // Match CSS transition duration
        }
    }

    // TYPING ANIMATION - PRESERVED COMPLETELY
    // This is the key animation effect that must be kept exactly as is
    const texts = [
        "Hi, I'm Jackson Kovarik",
        "Welcome To My Portfolio",
    ];

    const typingDelay = 150;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay before typing next text
    let textIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < texts[textIndex].length) {
            domCache.typedTextSpan.textContent += texts[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            domCache.typedTextSpan.textContent = texts[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textIndex++;
            if (textIndex >= texts.length) textIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Initialize all managers
    new ThemeManager();
    new Navigation();
    new FormManager();

    // Start the typing effect if element exists
    if (domCache.typedTextSpan) {
        type();
    }

    // Fade-in on scroll using Intersection Observer
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in--visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));
});