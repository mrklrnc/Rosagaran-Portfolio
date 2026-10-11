/**
 * ==============================================================================
 * PROFESSIONAL IT PORTFOLIO - JAVASCRIPT LOGIC & INTERACTIVITY
 * Features:
 *  - Interactive Node Particle Background Canvas
 *  - Hero Typing Tagline Animation
 *  - 3D Tilt Effect on Profile Box
 *  - Multi-theme Selector (Dark, Cyber, Light)
 *  - Skills Search & Category Filter
 *  - Experience / Education Timeline Tabs
 *  - Project Filter & Dynamic Case Study Modal System
 *  - Full Interactive Terminal CLI Simulator
 *  - Contact Form Client Validation, Character Counter & Toast Alerts
 *  - 1-Click Clipboard Copying
 *  - Live Dynamic Timezone Clock & Scroll Spy
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GLOBAL UTILITIES & STATE
       ========================================================================== */
    const state = {
        theme: localStorage.getItem('portfolio_theme') || 'dark',
        terminalHistory: [],
        historyIndex: -1
    };

    // Update Year in Footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       2. TOAST NOTIFICATION SYSTEM
       ========================================================================== */
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info', duration = 3500) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /* ==========================================================================
       3. THEME MANAGEMENT (Dark Modern, Cyber Neon, Clean Light)
       ========================================================================== */
    const htmlRoot = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(themeName) {
        htmlRoot.setAttribute('data-theme', themeName);
        localStorage.setItem('portfolio_theme', themeName);
        state.theme = themeName;

        // Update active menu option
        themeOptions.forEach(opt => {
            if (opt.dataset.themeVal === themeName) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        // Update active icon
        if (themeIcon) {
            if (themeName === 'light') {
                themeIcon.className = 'fa-solid fa-sun';
            } else if (themeName === 'cyber') {
                themeIcon.className = 'fa-solid fa-bolt';
            } else {
                themeIcon.className = 'fa-solid fa-moon';
            }
        }
    }

    // Initialize Theme
    applyTheme(state.theme);

    if (themeToggleBtn && themeMenu) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('show');
        });

        themeOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTheme = btn.dataset.themeVal;
                applyTheme(targetTheme);
                themeMenu.classList.remove('show');
                showToast(`Theme switched to ${btn.textContent.trim()}`, 'info', 2000);
            });
        });

        document.addEventListener('click', (e) => {
            if (!themeToggleBtn.contains(e.target) && !themeMenu.contains(e.target)) {
                themeMenu.classList.remove('show');
            }
        });
    }

    /* ==========================================================================
       4. TOP ANNOUNCEMENT BAR
       ========================================================================== */
    const announcementBar = document.getElementById('announcementBar');
    const closeAnnouncement = document.getElementById('closeAnnouncement');

    if (sessionStorage.getItem('announcement_closed') === 'true' && announcementBar) {
        announcementBar.style.display = 'none';
    }

    if (closeAnnouncement && announcementBar) {
        closeAnnouncement.addEventListener('click', () => {
            announcementBar.style.display = 'none';
            sessionStorage.setItem('announcement_closed', 'true');
        });
    }

    /* ==========================================================================
       5. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       6. DYNAMIC TYPING EFFECT (HERO TAGLINE)
       ========================================================================== */
    const typingElement = document.getElementById('typingElement');
    const phrases = [
        'IT Student @ National University',
        'Consistent First Honor Dean\'s Lister',
        'Cisco Certified in Hardware & Networking',
        'Marian Awardee & STEM With Honors',
        'Seeking IT Internship Opportunities'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 90;

    function typeEffect() {
        if (!typingElement) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 45;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingDelay = 1800; // Pause at end of sentence
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingDelay = 450; // Pause before typing new phrase
        }

        setTimeout(typeEffect, typingDelay);
    }

    typeEffect();

    /* ==========================================================================
       7. INTERACTIVE PARTICLE / CONSTELLATION BACKGROUND CANVAS
       ========================================================================== */
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

        const mouse = {
            x: null,
            y: null,
            radius: 140
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse interactivity
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= (dx / distance) * force * 3;
                        this.y -= (dy / distance) * force * 3;
                    }
                }
            }

            draw() {
                const color = state.theme === 'light' ? 'rgba(2, 132, 199, 0.4)' : 'rgba(0, 242, 254, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 130) {
                        const opacity = 1 - (distance / 130);
                        const lineColor = state.theme === 'light' 
                            ? `rgba(2, 132, 199, ${opacity * 0.2})` 
                            : `rgba(0, 242, 254, ${opacity * 0.22})`;

                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();
    }

    /* ==========================================================================
       8. 3D TILT EFFECT ON HERO CARD
       ========================================================================== */
    const heroCard = document.getElementById('heroCard3D');
    if (heroCard && window.innerWidth > 992) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    }

    /* ==========================================================================
       9.5. SKILLS SEARCH & CATEGORY FILTER
       ========================================================================== */
    const skillSearchInput = document.getElementById('skillSearchInput');
    const clearSkillSearch = document.getElementById('clearSkillSearch');
    const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const noSkillsFound = document.getElementById('noSkillsFound');
    const resetSkillFilterBtn = document.getElementById('resetSkillFilterBtn');

    let activeSkillCategory = 'all';

    function filterSkills() {
        const query = (skillSearchInput ? skillSearchInput.value : '').trim().toLowerCase();
        let visibleCount = 0;

        if (clearSkillSearch) {
            if (query.length > 0) {
                clearSkillSearch.classList.add('show');
            } else {
                clearSkillSearch.classList.remove('show');
            }
        }

        skillCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const cardName = (card.getAttribute('data-name') || '').toLowerCase();
            const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();
            const cardText = card.textContent.toLowerCase();

            const matchesCategory = (activeSkillCategory === 'all') || (cardCategory === activeSkillCategory);
            const matchesQuery = !query || cardName.includes(query) || cardTags.includes(query) || cardText.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noSkillsFound) {
            noSkillsFound.style.display = (visibleCount === 0) ? 'block' : 'none';
        }
    }

    if (skillSearchInput) {
        skillSearchInput.addEventListener('input', filterSkills);
    }

    if (clearSkillSearch) {
        clearSkillSearch.addEventListener('click', () => {
            if (skillSearchInput) skillSearchInput.value = '';
            filterSkills();
            if (skillSearchInput) skillSearchInput.focus();
        });
    }

    skillTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSkillCategory = btn.getAttribute('data-category') || 'all';
            filterSkills();
        });
    });

    if (resetSkillFilterBtn) {
        resetSkillFilterBtn.addEventListener('click', () => {
            if (skillSearchInput) skillSearchInput.value = '';
            activeSkillCategory = 'all';
            skillTabBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-category') === 'all');
            });
            filterSkills();
        });
    }

    /* ==========================================================================
       10. TIMELINE TABS (EDUCATION, ACHIEVEMENTS & TRAININGS)
       ========================================================================== */
    const timelineToggleBtns = document.querySelectorAll('.timeline-toggle-btn');
    const timelineContainers = document.querySelectorAll('.timeline-container');

    timelineToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            timelineToggleBtns.forEach(b => b.classList.remove('active'));
            timelineContainers.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       17. SCROLL SPY & STICKY HEADER
       ========================================================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Sticky Header effect
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to Top Visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Active Section Scroll Spy
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       CERTIFICATE VIEWER MODAL
       ========================================================================== */
    const certModal = document.getElementById('certViewerModal');
    const closeCertModalBtn = document.getElementById('closeCertModalBtn');
    const certModalTitle = document.getElementById('certModalTitle');
    const certModalIssuer = document.getElementById('certModalIssuer');
    const certModalDate = document.getElementById('certModalDate');
    const certModalCredlyLink = document.getElementById('certModalCredlyLink');
    const certModalNewTabLink = document.getElementById('certModalNewTabLink');
    const certModalDownloadLink = document.getElementById('certModalDownloadLink');
    const certModalFallbackBtn = document.getElementById('certModalFallbackBtn');
    const certModalIframe = document.getElementById('certModalIframe');
    const openCertBtns = document.querySelectorAll('.open-cert-btn');

    function openCertViewer(e) {
        const btn = e.currentTarget;
        const title = btn.getAttribute('data-title') || 'Certificate';
        const issuer = btn.getAttribute('data-issuer') || 'Cisco Networking Academy';
        const date = btn.getAttribute('data-date') || '';
        const pdf = btn.getAttribute('data-pdf') || '';
        const credly = btn.getAttribute('data-credly') || '#';

        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalIssuer) certModalIssuer.textContent = issuer;
        if (certModalDate) certModalDate.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Issued: ${date}`;
        
        if (certModalCredlyLink) {
            certModalCredlyLink.href = credly;
            certModalCredlyLink.style.display = (credly && credly !== '#') ? 'inline-flex' : 'none';
        }
        
        if (certModalNewTabLink) certModalNewTabLink.href = pdf;
        if (certModalDownloadLink) certModalDownloadLink.href = pdf;
        if (certModalFallbackBtn) certModalFallbackBtn.href = pdf;
        
        if (certModalIframe) {
            certModalIframe.src = pdf;
        }

        if (certModal) {
            certModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCertViewer() {
        if (certModal) {
            certModal.classList.remove('show');
            document.body.style.overflow = '';
        }
        if (certModalIframe) {
            certModalIframe.src = '';
        }
    }

    openCertBtns.forEach(btn => {
        btn.addEventListener('click', openCertViewer);
    });

    if (closeCertModalBtn) {
        closeCertModalBtn.addEventListener('click', closeCertViewer);
    }

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertViewer();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('show')) {
            closeCertViewer();
        }
    });

});
