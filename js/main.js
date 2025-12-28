// Techily Fly - Main JavaScript File

// Global Variables
let particles = [];
let mouseX = 0;
let mouseY = 0;
let isMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeBackgroundAnimation();
    loadTemplates();
    initializeMobileMenu();
    initializeBackToTop();
    initializeContactForm();
    initializeScrollEffects();
});

// Template Loading System
async function loadTemplates() {
    try {
        // Load Header
        const headerResponse = await fetch('templates/header.html');
        const headerContent = await headerResponse.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerContent;
        }

        // Load Footer
        const footerResponse = await fetch('templates/footer.html');
        const footerContent = await footerResponse.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerContent;
        }

        // Re-initialize mobile menu after template load
        setTimeout(() => {
            initializeMobileMenu();
        }, 100);
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

// Background Animation
function initializeBackgroundAnimation() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const numberOfParticles = 25;
        
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                type: 'circle',
                color: '#00BFFF'
            });
        }
        
        // Add squares
        const numberOfSquares = 15;
        for (let i = 0; i < numberOfSquares; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 4 + 2,
                type: 'square',
                color: '#8A2BE2'
            });
        }
        
        // Add triangles
        const numberOfTriangles = 10;
        for (let i = 0; i < numberOfTriangles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 3 + 2,
                type: 'triangle',
                color: '#00BFFF'
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw particles, squares, and triangles
        particles.forEach(particle => {
            if (particle.type === 'circle') {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            } else if (particle.type === 'square') {
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            } else if (particle.type === 'triangle') {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y - particle.size);
                ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
                ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
                ctx.closePath();
                ctx.fill();
            }
        });

        // Draw connections with very thin lines
        particles.forEach((particle1, index) => {
            particles.slice(index + 1).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    
                    // Use branded colors for lines
                    const lineColor = particle1.type === 'circle' || particle1.type === 'triangle' ? '0, 191, 255' : '138, 43, 226';
                    ctx.strokeStyle = `rgba(${lineColor}, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.3;
                    ctx.stroke();
                }
            });
        });
    }

    function updateParticles() {
        particles.forEach(particle => {
            // Mouse interaction
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.02;
                particle.vy -= (dy / distance) * force * 0.02;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Bounce off walls
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.vx = -particle.vx;
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.vy = -particle.vy;
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }

            // Add some random movement
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01;

            // Limit speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 2) {
                particle.vx = (particle.vx / speed) * 2;
                particle.vy = (particle.vy / speed) * 2;
            }
        });
    }

    function animate() {
        drawParticles();
        updateParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                navMenu.classList.remove('active');
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const emailBtn = document.getElementById('email-btn');

        // WhatsApp submission
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sendViaWhatsApp();
            });
        }

        // Email submission
        if (emailBtn) {
            emailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sendViaEmail();
            });
        }
    }
}

function sendViaWhatsApp() {
    const formData = getFormData();
    if (!validateForm(formData)) return;

    const phoneNumber = '+918825164657';
    const message = encodeURIComponent(
        `*New Project Inquiry - Techily Fly*\n\n` +
        `*Full Name:* ${formData.fullName}\n` +
        `*Email:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Company/Brand:* ${formData.company}\n` +
        `*Service:* ${formData.service}\n` +
        `*Budget Range:* ${formData.budget}\n` +
        `*Project Description:* ${formData.description}\n\n` +
        `--- Sent via Techily Fly Website ---`
    );

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function sendViaEmail() {
    const formData = getFormData();
    if (!validateForm(formData)) return;

    const email = 'TechilyFly@gmail.com';
    const subject = encodeURIComponent('New Project Inquiry - Techily Fly');
    const body = encodeURIComponent(
        `New Project Inquiry Details:\n\n` +
        `Full Name: ${formData.fullName}\n` +
        `Email: ${formData.email}\n` +
        `WhatsApp: ${formData.whatsapp}\n` +
        `Company/Brand: ${formData.company}\n` +
        `Service: ${formData.service}\n` +
        `Budget Range: ${formData.budget}\n\n` +
        `Project Description:\n${formData.description}\n\n` +
        `--- Sent via Techily Fly Website ---`
    );

    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
}

function getFormData() {
    return {
        fullName: document.getElementById('full-name').value.trim(),
        email: document.getElementById('email').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        company: document.getElementById('company').value.trim(),
        service: document.getElementById('service').value,
        budget: document.getElementById('budget').value,
        description: document.getElementById('description').value.trim()
    };
}

function validateForm(formData) {
    const errors = [];

    if (!formData.fullName) errors.push('Full name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.whatsapp) errors.push('WhatsApp number is required');
    if (!formData.service) errors.push('Service selection is required');
    if (!formData.budget) errors.push('Budget range is required');
    if (!formData.description) errors.push('Project description is required');

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    // WhatsApp validation
    if (formData.whatsapp && !isValidPhone(formData.whatsapp)) {
        errors.push('Please enter a valid WhatsApp number');
    }

    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Scroll Effects
function initializeScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .why-item, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Form input animations
document.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        e.target.parentElement.classList.add('focused');
    }
}, true);

document.addEventListener('blur', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (!e.target.value) {
            e.target.parentElement.classList.remove('focused');
        }
    }
}, true);

// Utility functions
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
    };
}

// Performance optimization
const optimizedScroll = throttle(() => {
    // Scroll-based animations
}, 16);

const optimizedResize = debounce(() => {
    // Resize handlers
}, 250);

window.addEventListener('scroll', optimizedScroll);
window.addEventListener('resize', optimizedResize);