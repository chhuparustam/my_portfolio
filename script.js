/* ========================================
   MODERN PORTFOLIO JAVASCRIPT v2.0
   Advanced Interactions & Animations
   ======================================== */

// ========================================
// LOADING SCREEN
// ========================================

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
        
        // Initialize animations after loading
        initializeAnimations();
    }, 2000);
});

// ========================================
// NAVIGATION EFFECTS
// ========================================

const navigation = {
    navbar: document.getElementById('navbar'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    init() {
        this.handleScroll();
        this.setActiveSection();
        this.handleThemeToggle();
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.setActiveSection();
        });
    },
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },
    
    setActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },
    
    handleThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        themeToggle?.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    },
    
    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
};

// ========================================
// TYPEWRITER EFFECT
// ========================================

class Typewriter {
    constructor(element, words, speed = 100, deleteSpeed = 50, delayBetweenWords = 2000) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetweenWords = delayBetweenWords;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                setTimeout(() => this.type(), 500);
                return;
            }
            
            setTimeout(() => this.type(), this.deleteSpeed);
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentWord.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBetweenWords);
                return;
            }
            
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ========================================
// SKILLS SECTION INTERACTION
// ========================================

const skills = {
    categories: document.querySelectorAll('.category-item'),
    skillGroups: document.querySelectorAll('.skills-category'),
    
    init() {
        this.categories.forEach(category => {
            category.addEventListener('click', (e) => {
                const categoryName = e.currentTarget.dataset.category;
                this.switchCategory(categoryName);
            });
        });
        
        // Animate skill bars when in view
        this.animateSkillBars();
    },
    
    switchCategory(categoryName) {
        // Update active category button
        this.categories.forEach(cat => cat.classList.remove('active'));
        document.querySelector(`[data-category="${categoryName}"]`).classList.add('active');
        
        // Update active skill group
        this.skillGroups.forEach(group => {
            group.classList.remove('active');
            if (group.dataset.categoryContent === categoryName) {
                group.classList.add('active');
                this.animateProgressBars(group);
            }
        });
    },
    
    animateSkillBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.skillGroups.forEach(group => observer.observe(group));
    },
    
    animateProgressBars(container) {
        const progressBars = container.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const width = bar.dataset.width;
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        });
    }
};

// ========================================
// CONTACT FORM HANDLING
// ========================================

const contactForm = {
    form: document.getElementById('contactForm'),
    submitBtn: null,
    
    init() {
        if (!this.form) return;
        
        this.submitBtn = this.form.querySelector('.btn-submit');
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add floating label effects
        this.addFloatingLabels();
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;
        
        this.setLoadingState(true);
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            this.setLoadingState(false);
        }
    },
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input);
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });
        
        return isValid;
    },
    
    showFieldError(field) {
        field.style.borderBottomColor = '#ff6b6b';
        field.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
    },
    
    clearFieldError(field) {
        field.style.borderBottomColor = '';
        field.style.boxShadow = '';
    },
    
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    },
    
    showSuccessMessage() {
        const toast = new bootstrap.Toast(document.getElementById('successToast'));
        toast.show();
    },
    
    showErrorMessage() {
        alert('There was an error sending your message. Please try again.');
    },
    
    addFloatingLabels() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (!input || !label) return;
            
            input.addEventListener('focus', () => {
                label.style.transform = 'translateY(-20px) scale(0.8)';
                label.style.color = 'var(--primary-100)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.transform = '';
                    label.style.color = '';
                }
            });
        });
    }
};

// ========================================
// SCROLL ANIMATIONS
// ========================================

const scrollAnimations = {
    backToTopBtn: document.getElementById('backToTop'),
    
    init() {
        this.handleBackToTop();
        this.initIntersectionObserver();
        
        window.addEventListener('scroll', () => {
            this.handleBackToTop();
        });
    },
    
    handleBackToTop() {
        if (window.scrollY > 300) {
            this.backToTopBtn.classList.add('show');
        } else {
            this.backToTopBtn.classList.remove('show');
        }
    },
    
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
};

// ========================================
// SMOOTH SCROLLING
// ========================================

const smoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ========================================
// PARTICLES BACKGROUND
// ========================================

const particles = {
    container: null,
    particles: [],
    
    init() {
        this.createContainer();
        this.createParticles();
        this.animate();
    },
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'particles-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    },
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(102, 126, 234, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
            `;
            
            this.container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5
            });
        }
    },
    
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
};

// ========================================
// PARALLAX EFFECTS
// ========================================

const parallax = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('.floating-shapes, .profile-container');
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    },
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
};

// ========================================
// PROJECT CARDS INTERACTION
// ========================================

const projects = {
    cards: document.querySelectorAll('.project-card'),
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.handleCardHover(e.currentTarget, true);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.handleCardHover(e.currentTarget, false);
            });
        });
    },
    
    handleCardHover(card, isHovering) {
        const techTags = card.querySelectorAll('.tech-tag');
        
        if (isHovering) {
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-3px)';
                    tag.style.background = 'var(--primary-gradient)';
                    tag.style.color = 'white';
                }, index * 100);
            });
        } else {
            techTags.forEach(tag => {
                tag.style.transform = '';
                tag.style.background = '';
                tag.style.color = '';
            });
        }
    }
};

// ========================================
// TEXT ANIMATIONS
// ========================================

const textAnimations = {
    init() {
        this.initCounterAnimation();
        this.initTextReveal();
    },
    
    initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(element) {
        const target = element.textContent;
        const isNumber = /^\d+$/.test(target.replace(/[+\-]/g, ''));
        
        if (!isNumber) return;
        
        const number = parseInt(target.replace(/\D/g, ''));
        const increment = number / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target.includes('+') ? '+' : '');
            }
        }, 50);
    },
    
    initTextReveal() {
        const textElements = document.querySelectorAll('.reveal-text');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            [...text].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('char');
                element.appendChild(span);
            });
        });
    }
};

// ========================================
// MOBILE OPTIMIZATIONS
// ========================================

const mobile = {
    init() {
        this.handleTouchEvents();
        this.optimizeForMobile();
    },
    
    handleTouchEvents() {
        // Disable hover effects on touch devices
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
        
        // Handle mobile navigation
        const navToggler = document.querySelector('.navbar-toggler');
        const navCollapse = document.querySelector('.navbar-collapse');
        
        navToggler?.addEventListener('click', () => {
            setTimeout(() => {
                if (navCollapse.classList.contains('show')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }, 300);
        });
    },
    
    optimizeForMobile() {
        if (window.innerWidth < 768) {
            // Reduce animation complexity on mobile
            document.body.classList.add('mobile-device');
            
            // Optimize floating shapes
            const shapes = document.querySelectorAll('.floating-shapes .shape');
            shapes.forEach((shape, index) => {
                if (index > 2) shape.style.display = 'none';
            });
        }
    }
};

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

const performance = {
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrollEvents();
    },
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    preloadCriticalResources() {
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    },
    
    optimizeScrollEvents() {
        let ticking = false;
        
        const optimizedScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    navigation.handleScroll();
                    navigation.setActiveSection();
                    scrollAnimations.handleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', optimizedScroll, { passive: true });
    }
};

// ========================================
// EASTER EGGS & FUN INTERACTIONS
// ========================================

const easterEggs = {
    init() {
        this.addKeyboardShortcuts();
        this.addClickEasterEgg();
        this.addKonamiCode();
    },
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + D = Toggle dark mode
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                document.getElementById('theme-toggle')?.click();
            }
            
            // Ctrl + H = Go to home
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
            }
        });
    },
    
    addClickEasterEgg() {
        let clickCount = 0;
        const logo = document.querySelector('.navbar-brand');
        
        logo?.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            
            if (clickCount === 5) {
                this.triggerConfetti();
                clickCount = 0;
            }
            
            // Reset counter after 3 seconds
            setTimeout(() => {
                clickCount = 0;
            }, 3000);
        });
    },
    
    addKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.triggerSecretMode();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    },
    
    triggerConfetti() {
        // Simple confetti effect
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: hsl(${Math.random() * 360}deg, 70%, 60%);
                left: ${Math.random() * 100}%;
                top: -10px;
                z-index: 10000;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    },
    
    triggerSecretMode() {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        
        console.log('🎉 Secret mode activated! You found the Konami code!');
    }
};

// ========================================
// INITIALIZATION
// ========================================

function initializeAnimations() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    // Initialize typewriter effect
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.dataset.typewriter || '["Full Stack Developer"]');
        new Typewriter(typewriterElement, words);
    }
}

// ========================================
// QUALIFICATIONS SECTION INTERACTION
// ========================================

const qualifications = {
    init() {
        this.handleTabSwitching();
    },
    
    handleTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                    
                    // Trigger animations for timeline items
                    const timelineItems = targetPane.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        item.style.animationDelay = `${index * 0.1}s`;
                    });
                }
            });
        });
    }
};

// ========================================
// MAIN INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    navigation.init();
    skills.init();
    qualifications.init();
    contactForm.init();
    scrollAnimations.init();
    smoothScroll.init();
    textAnimations.init();
    mobile.init();
    performance.init();
    easterEggs.init();
    
    // Initialize particles on larger screens
    if (window.innerWidth > 768) {
        particles.init();
    }
    
    console.log('🚀 Portfolio loaded successfully!');
    console.log('💡 Tip: Try the Konami code for a surprise!');
});

// ========================================
// RESIZE HANDLER
// ========================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        mobile.optimizeForMobile();
        
        // Reinitialize particles if needed
        if (window.innerWidth > 768 && !document.querySelector('.particles-container')) {
            particles.init();
        }
    }, 250);
});

// ========================================
// CSS ANIMATIONS (added via JavaScript)
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .char {
        display: inline-block;
        opacity: 0;
        animation: charReveal 0.5s ease forwards;
    }
    
    @keyframes charReveal {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .touch-device .hover-lift:hover,
    .touch-device .card:hover {
        transform: none;
    }
    
    .mobile-device .floating-shapes {
        opacity: 0.3;
    }
    
    .mobile-device .shape {
        animation-duration: 8s;
    }
`;

document.head.appendChild(style);

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// ========================================
// EXPORT FOR DEBUGGING
// ========================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.portfolioDebug = {
        navigation,
        skills,
        contactForm,
        scrollAnimations,
        particles,
        parallax,
        textAnimations
    };
}
