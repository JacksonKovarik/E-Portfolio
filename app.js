// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navMenuContainer = document.querySelector('.nav__menu-container');
    const navLinks = document.querySelectorAll('.nav__link');
    const themeToggle = document.getElementById('theme-toggle');
    const sections = document.querySelectorAll('section[id]');
    const contactForm = document.getElementById('contact-form');

    // Theme Management
    class ThemeManager {
        constructor() {
            this.currentTheme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            this.init();
        }

        init() {
            this.applyTheme(this.currentTheme);
            this.updateThemeIcon();
            
            themeToggle?.addEventListener('click', () => {
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
            const icon = document.querySelector('.theme-toggle__icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }
    }

    // Navigation Management
    class Navigation {
        constructor() {
            this.isMenuOpen = false;
            this.init();
        }

        init() {
            this.setupScrollEffect();
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupActiveLink();
        }

        setupScrollEffect() {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (nav) {
                    if (currentScrollY > 100) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                }
                
                lastScrollY = currentScrollY;
            });
        }

        setupMobileMenu() {
            navToggle?.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMenuOpen) {
                        this.toggleMobileMenu();
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !nav?.contains(e.target)) {
                    this.toggleMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            
            navToggle?.classList.toggle('active');
            navMenu?.classList.toggle('active');
            navMenuContainer?.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        }

        setupSmoothScroll() {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 70; // Account for fixed nav
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        setupActiveLink() {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
                        
                        // Remove active class from all links
                        navLinks.forEach(link => link.classList.remove('active'));
                        
                        // Add active class to current link
                        activeLink?.classList.add('active');
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                observer.observe(section);
            });
        }
    }

    // Animation Management
    class AnimationManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupScrollAnimations();
            this.setupLoadAnimations();
        }

        setupScrollAnimations() {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Add fade-in class to elements and observe them
            const animatedElements = document.querySelectorAll(
                '.section__header, .project-card, .skill-card, .experience-card, .education-card, .contact-item, .about__stats .stat'
            );

            animatedElements.forEach((element, index) => {
                element.classList.add('fade-in');
                element.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(element);
            });
        }

        setupLoadAnimations() {
            // Add loading animation to hero elements
            const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__description, .hero__buttons, .hero__avatar');
            
            heroElements.forEach((element, index) => {
                element.classList.add('loading');
                element.style.animationDelay = `${index * 0.2}s`;
            });
        }
    }

    // Form Management
    class FormManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupContactForm();
        }

        setupContactForm() {
            contactForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });

            // Add real-time validation
            const formInputs = contactForm?.querySelectorAll('input, textarea');
            formInputs?.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Clear previous errors
            this.clearFieldError(field);

            // Validation rules
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long';
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'subject':
                    if (value.length < 5) {
                        isValid = false;
                        errorMessage = 'Subject must be at least 5 characters long';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long';
                    }
                    break;
            }

            if (!isValid) {
                this.showFieldError(field, errorMessage);
            }

            return isValid;
        }

        showFieldError(field, message) {
            field.style.borderColor = 'var(--color-error)';
            
            // Create or update error message
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                errorElement.style.cssText = `
                    color: var(--color-error);
                    font-size: var(--font-size-sm);
                    margin-top: var(--space-4);
                    display: block;
                `;
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        }

        clearFieldError(field) {
            field.style.borderColor = '';
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
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

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }

        showNotification(message, type = 'info') {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            // Create notification
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: var(--space-20);
                padding: var(--space-16) var(--space-20);
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-left: 4px solid var(--color-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'});
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                max-width: 400px;
                z-index: 10000;
                transform: translateX(120%);
                transition: transform var(--duration-normal) var(--ease-standard);
            `;

            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--space-12);">
                    <span style="font-size: var(--font-size-lg);">
                        ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
                    </span>
                    <span style="color: var(--color-text);">${message}</span>
                    <button onclick="this.parentNode.parentNode.remove()" style="
                        background: none; 
                        border: none; 
                        color: var(--color-text-secondary); 
                        cursor: pointer;
                        font-size: var(--font-size-lg);
                        margin-left: auto;
                    ">×</button>
                </div>
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.transform = 'translateX(120%)';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);
        }
    }

    // Utility Functions
    class Utils {
        static debounce(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        }

        static throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }

    // Interactive Enhancements
    class InteractiveEnhancements {
        constructor() {
            this.init();
        }

        init() {
            this.setupHoverEffects();
            this.setupClickEffects();
            this.setupKeyboardNavigation();
            this.setupParallaxEffects();
        }

        setupHoverEffects() {
            // Add ripple effect to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', this.createRipple);
            });

            // Add tilt effect to cards
            const cards = document.querySelectorAll('.project-card, .skill-card, .experience-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', (e) => {
                    card.style.transform = 'translateY(-8px) rotateX(2deg)';
                });

                card.addEventListener('mouseleave', (e) => {
                    card.style.transform = '';
                });
            });
        }

        createRipple(event) {
            const button = event.currentTarget;
            const ripple = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
            ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
            ripple.classList.add('ripple');

            const rippleCSS = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;

            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = rippleCSS;
                document.head.appendChild(style);
            }

            const existingRipple = button.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        setupClickEffects() {
            // Add click animations to interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .tool-tag, .tech-tag');
            
            interactiveElements.forEach(element => {
                element.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        }

        setupKeyboardNavigation() {
            // Enhance keyboard navigation
            document.addEventListener('keydown', (e) => {
                // ESC to close mobile menu
                if (e.key === 'Escape' && nav.querySelector('.nav__menu.active')) {
                    navigation.toggleMobileMenu();
                }
            });

            // Add focus indicators
            const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
            focusableElements.forEach(element => {
                element.addEventListener('focus', function() {
                    this.style.outline = '2px solid var(--color-primary)';
                    this.style.outlineOffset = '2px';
                });

                element.addEventListener('blur', function() {
                    this.style.outline = '';
                    this.style.outlineOffset = '';
                });
            });
        }

        setupParallaxEffects() {
            const hero = document.querySelector('.hero');
            
            if (hero) {
                window.addEventListener('scroll', Utils.throttle(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxElement = hero.querySelector('.hero__visual');
                    
                    if (parallaxElement) {
                        const speed = scrolled * 0.3;
                        parallaxElement.style.transform = `translateY(${speed}px)`;
                    }
                }, 10));
            }
        }
    }

    // Performance Monitoring
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            this.optimizeImages();
            this.handleVisibilityChange();
        }

        optimizeImages() {
            // Lazy load images if any are added later
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    });
                });

                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }

        handleVisibilityChange() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Pause animations when tab is not visible
                    document.body.style.animationPlayState = 'paused';
                } else {
                    // Resume animations when tab becomes visible
                    document.body.style.animationPlayState = 'running';
                }
            });
        }
    }

    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigation = new Navigation();
    const animationManager = new AnimationManager();
    const formManager = new FormManager();
    const interactiveEnhancements = new InteractiveEnhancements();
    const performanceMonitor = new PerformanceMonitor();

    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Portfolio error:', e.error);
    });

    // Console message for developers
    console.log(`
    👋 Hello there, fellow developer!
    
    Thanks for checking out Jackson's portfolio.
    This site was built with modern web technologies:
    - Vanilla JavaScript (ES6+)
    - CSS Grid & Flexbox
    - CSS Custom Properties
    - Intersection Observer API
    - Local Storage API
    
    Feel free to reach out if you have any questions!
    `);

    const texts = [
        "Hi, I'm Jackson Kovarik",
        "Welcome To My Portfolio",
    ];

  const typingDelay = 150;
  const erasingDelay = 100;
  const newTextDelay = 2000; // Delay before typing next text
  let textIndex = 0;
  let charIndex = 0;

  const typedTextSpan = document.getElementById("typed-text");
  const cursorSpan = document.querySelector(".cursor");

  function type() {
    if (charIndex < texts[textIndex].length) {
      typedTextSpan.textContent += texts[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textIndex++;
      if (textIndex >= texts.length) textIndex = 0;
      setTimeout(type, typingDelay + 1100);
    }
  }

  // Start the typing effect
  if (typedTextSpan) {
    type();
  }

});