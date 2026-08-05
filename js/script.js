/* 
================================================================
CYBER GUARDIAN | Production Interactive Engine (js/script.js)
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------
       1. Active Navigation Link Highlighting
    --------------------------------------------------------- */
    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        let currentPath = window.location.pathname.split('/').pop();
        
        if (!currentPath || currentPath === '') {
            currentPath = 'index.html';
        }

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath || (currentPath === 'index.html' && (linkHref === './' || linkHref === 'index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveNavLink();

    /* ---------------------------------------------------------
       2. Sticky Navbar & Scroll Shadow
    --------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ---------------------------------------------------------
       3. Mobile Navigation Drawer & Hamburger Toggle
    --------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close drawer when clicking any link
        document.querySelectorAll('.nav-link, .nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------------------------------------------------------
       4. Scroll Reveal Animations
    --------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.9;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
    }

    if (revealElements.length > 0) {
        window.addEventListener('scroll', checkReveal, { passive: true });
        checkReveal(); // Initial trigger
    }

    /* ---------------------------------------------------------
       5. Statistics Counter Animation
    --------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (isNaN(target)) return;

            const duration = 1600;
            const step = Math.ceil(target / (duration / 30));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                const suffix = target === 95 ? '%' : '+';
                counter.textContent = current + suffix;
            }, 30);
        });
    }

    if (statNumbers.length > 0) {
        const statsSection = document.querySelector('.stats-grid') || document.querySelector('.statistics');
        if (statsSection) {
            window.addEventListener('scroll', () => {
                if (!hasAnimatedStats) {
                    const sectionTop = statsSection.getBoundingClientRect().top;
                    if (sectionTop < window.innerHeight - 50) {
                        animateStats();
                        hasAnimatedStats = true;
                    }
                }
            }, { passive: true });
            
            const sectionTop = statsSection.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight) {
                animateStats();
                hasAnimatedStats = true;
            }
        }
    }

    /* ---------------------------------------------------------
       6. Accordion Toggle Logic (FAQ)
    --------------------------------------------------------- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            const siblingItems = accordionItem.parentElement.querySelectorAll('.accordion-item');
            siblingItems.forEach(item => {
                item.classList.remove('active');
            });

            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

    /* ---------------------------------------------------------
       7. Contact Form Vanilla JS Validation & Alert
    --------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || name.length < 2) {
                showFeedback('Please enter your full name (at least 2 characters).', 'error');
                if (nameInput) nameInput.focus();
                return;
            }

            if (!email || !emailRegex.test(email)) {
                showFeedback('Please enter a valid email address.', 'error');
                if (emailInput) emailInput.focus();
                return;
            }

            if (!message || message.length < 10) {
                showFeedback('Please provide a message with at least 10 characters detailing your security inquiry.', 'error');
                if (messageInput) messageInput.focus();
                return;
            }

            showFeedback('Thank you for reaching out to Cyber Guardian! Your message has been logged. Our security engineering team will respond within 24 business hours.', 'success');
            contactForm.reset();
        });

        function showFeedback(text, status) {
            formFeedback.textContent = text;
            formFeedback.className = `form-feedback ${status}`;
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /* ---------------------------------------------------------
       8. Dynamic Copyright Year
    --------------------------------------------------------- */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

const scrollBtn = document.getElementById("scrollToTop");

// Show button after scrolling 300px
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollBtn.classList.add("visible");
    } else {
        scrollBtn.classList.remove("visible");
    }
});

// Scroll to top when clicked
scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
document.addEventListener("contextmenu", e => e.preventDefault());
/*
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    try {
        const data = new FormData(this);

        const text = `📩 New Contact Request

👤 Name: ${data.get("Name")}
📧 Email: ${data.get("Email")}
📱 Phone: ${data.get("Phone")}
💼 Service: ${data.get("Service")}

📝 Message:
${data.get("Message")}`;

        const phone = "91xxxxxxxx";

        const whatsappWindow = window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
            "_blank"
        );

        if (whatsappWindow) {
            alert("WhatsApp opened successfully. Please click Send to complete your message.");
            this.reset();
        } else {
            alert("Popup blocked! Please allow popups and try again.");
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    }
});
*/

document.getElementById("contactForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const form = this;

    fetch(form.action, {
        method: "POST",
        body: new FormData(form)
    })
    .then(() => {
        alert("Thank you! Your request has been sent successfully.");
        form.reset();
    })
    .catch(() => {
        alert("Failed to send. Please try again.");
    });

});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

document.addEventListener("keydown", function (e) {
    // F12
    if (e.key === "F12") {
        e.preventDefault();
    }

    // Ctrl+Shift+I, J, C
    if (e.ctrlKey && e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
    }

    // Ctrl+U
    if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
    }

    // Ctrl+S
    if (e.ctrlKey && e.key.toUpperCase() === "S") {
        e.preventDefault();
    }

    // Ctrl+A
    if (e.ctrlKey && e.key.toUpperCase() === "A") {
        e.preventDefault();
    }

    // Ctrl+C
    if (e.ctrlKey && e.key.toUpperCase() === "C") {
        e.preventDefault();
    }
});