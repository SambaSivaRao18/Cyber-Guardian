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
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    /* ---------------------------------------------------------
       3. Mobile Navigation Drawer & Hamburger Toggle
    --------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        });

        // Close drawer when clicking any nav link
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
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < triggerBottom) {
                el.classList.add('active');
            }
        });
    }

    if (revealElements.length > 0) {
        window.addEventListener('scroll', checkReveal, { passive: true });
        checkReveal();
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

            const step = Math.ceil(target / (1600 / 30));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current + (target === 95 ? '%' : '+');
            }, 30);
        });
    }

    if (statNumbers.length > 0) {
        const statsSection = document.querySelector('.stats-grid') || document.querySelector('.statistics');
        if (statsSection) {
            window.addEventListener('scroll', () => {
                if (!hasAnimatedStats && statsSection.getBoundingClientRect().top < window.innerHeight - 50) {
                    animateStats();
                    hasAnimatedStats = true;
                }
            }, { passive: true });

            if (statsSection.getBoundingClientRect().top < window.innerHeight) {
                animateStats();
                hasAnimatedStats = true;
            }
        }
    }

    /* ---------------------------------------------------------
       6. Accordion Toggle Logic (FAQ)
    --------------------------------------------------------- */
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item     = header.parentElement;
            const isActive = item.classList.contains('active');

            item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

            if (!isActive) item.classList.add('active');
        });
    });

    /* ---------------------------------------------------------
       7. Dynamic Copyright Year
    --------------------------------------------------------- */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   8. Scroll-to-Top Button
--------------------------------------------------------- */
const scrollBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------------------------------------------------------
   9. Security: Disable Right-Click & DevTools shortcuts
--------------------------------------------------------- */
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
    if (e.key === 'F12') { e.preventDefault(); return; }

    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        return;
    }

    if (e.ctrlKey && ['U', 'S', 'A', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
    }
});

/* ---------------------------------------------------------
   10. Custom Notification Toast (used as fallback)
--------------------------------------------------------- */
function showNotification(message, type = 'success', reasonLines = []) {
    const existing = document.getElementById('cg-notification');
    if (existing) existing.remove();

    const icons = { success: '✅', error: '⚠️', info: 'ℹ️' };

    let reasonHTML = '';
    if (reasonLines.length > 0) {
        reasonHTML = `<ul class="cg-notif-reasons">${reasonLines.map(r => `<li>${r}</li>`).join('')}</ul>`;
    }

    const notif = document.createElement('div');
    notif.id        = 'cg-notification';
    notif.className = `cg-notif cg-notif--${type}`;
    notif.setAttribute('role', 'alert');
    notif.innerHTML = `
        <div class="cg-notif-inner">
            <span class="cg-notif-icon">${icons[type] || icons.info}</span>
            <div class="cg-notif-body">
                <p class="cg-notif-msg">${message}</p>
                ${reasonHTML}
            </div>
            <button class="cg-notif-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    document.body.appendChild(notif);

    const autoDismiss = setTimeout(() => dismiss(notif), type === 'error' ? 9000 : 5500);

    notif.querySelector('.cg-notif-close').addEventListener('click', () => {
        clearTimeout(autoDismiss);
        dismiss(notif);
    });

    function dismiss(el) {
        el.style.animation = 'cgSlideOut 0.3s ease forwards';
        setTimeout(() => el.remove(), 300);
    }
}

/* ---------------------------------------------------------
   11. Modal Alert Dialog (must click OK to dismiss)
--------------------------------------------------------- */
function showModal(message, type = 'success', reasons = []) {
    const existing = document.getElementById('cg-modal-overlay');
    if (existing) existing.remove();

    const isError   = type === 'error';
    const icon      = isError ? '⚠️' : '✅';
    const title     = isError ? 'Failed to Send' : 'Message Sent!';

    let reasonsHTML = '';
    if (isError && reasons.length > 0) {
        reasonsHTML = `<ul id="cg-modal-reasons">${reasons.map(r => `<li>${r}</li>`).join('')}</ul>`;
    }

    const overlay = document.createElement('div');
    overlay.id    = 'cg-modal-overlay';
    overlay.setAttribute('role',       'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <div id="cg-modal-box" class="${type}">
            <span id="cg-modal-icon">${icon}</span>
            <h2 id="cg-modal-title">${title}</h2>
            <p id="cg-modal-msg">${message}</p>
            ${reasonsHTML}
            <button id="cg-modal-ok">OK</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const okBtn = overlay.querySelector('#cg-modal-ok');
    okBtn.focus();

    function closeModal() {
        overlay.style.animation = 'cgFadeOut 0.22s ease forwards';
        setTimeout(() => overlay.remove(), 220);
    }

    okBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', onEsc);
        }
    });

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
    });
}

/* ---------------------------------------------------------
   12. Classify fetch/network errors into client-friendly messages
--------------------------------------------------------- */
function classifyFetchError(err, httpStatus) {
    const reasons = [];

    if (httpStatus) {
        if (httpStatus === 429) {
            reasons.push('Too many messages were sent in a short time. Please wait a few minutes and try again.');
        } else if (httpStatus >= 500) {
            reasons.push('The email delivery service is currently experiencing issues. Please try again in a few minutes.');
        } else if (httpStatus === 422 || httpStatus === 400) {
            reasons.push('The form data was not accepted. Please check your inputs and try again.');
        } else if (httpStatus === 403) {
            reasons.push('This form submission was blocked. Please try contacting us via WhatsApp instead.');
        } else {
            reasons.push('The server returned an unexpected response. Please try again later.');
        }
        reasons.push('If the problem persists, please contact us directly via WhatsApp or email.');
        return reasons;
    }

    if (!navigator.onLine) {
        reasons.push('Your device appears to be offline — please check your internet connection.');
        return reasons;
    }

    const msg = (err && err.message) ? err.message.toLowerCase() : '';

    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network')) {
        reasons.push('A network connection issue occurred. Please check your internet and try again.');
    } else if (msg.includes('timeout') || msg.includes('aborted')) {
        reasons.push('The request timed out. Your connection may be slow — please try again.');
    } else if (msg.includes('cors')) {
        reasons.push('The message could not be delivered at this time. Please try again later.');
    } else {
        reasons.push('An unexpected issue occurred while sending your message.');
    }

    reasons.push('If the problem persists, please contact us directly via WhatsApp or email.');
    return reasons;
}

/* ---------------------------------------------------------
   13. Contact Form Submission via Fetch
--------------------------------------------------------- */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form      = this;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Wire client email into _replyto so you can reply directly from inbox
    const clientEmail = form.querySelector('input[name="Email"]');
    const replyTo     = form.querySelector('input[name="_replyto"]');
    if (clientEmail && replyTo) replyTo.value = clientEmail.value.trim();

    // Loading state
    const originalHTML   = submitBtn.innerHTML;
    submitBtn.disabled   = true;
    submitBtn.innerHTML  = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(response => {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalHTML;

            if (!response.ok) {
                showModal(
                    'Your message could not be delivered. Please try again or contact us via WhatsApp.',
                    'error',
                    classifyFetchError(null, response.status)
                );
                return;
            }

            showModal('Your message has been sent successfully! ✅\nThank you for reaching out! Our team has received your message and will get back to you within 48 hours.');
            form.reset();
        })
        .catch(err => {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalHTML;
            showModal(
                'Your message could not be delivered. Please try again or contact us via WhatsApp.',
                'error',
                classifyFetchError(err, null)
            );
        });
});