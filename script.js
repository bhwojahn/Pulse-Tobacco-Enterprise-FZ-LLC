// ============================================
// PULSE TOBACCO ENTERPRISE - SCRIPT.JS (OPTIMIZED)
// Mobile Menu, Smooth Scrolling, Navbar Effects, Products Tabs, Lazy Loading
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR SCROLL EFFECT (Optimized with RAF)
    // ============================================
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================
    
    createMobileMenu();
    
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu .navlinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.includes('index.html') || href.includes('find-us.html')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // FORM VALIDATION
    // ============================================
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('.form-input, .form-input-big');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff4444';
                    isValid = false;
                } else {
                    input.style.borderColor = 'rgba(194, 186, 121, 0.3)';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    // ============================================
    // PRODUCTS SECTION TABS
    // ============================================
    initializeProductsTabs();
    
    // ============================================
    // LAZY LOAD PRODUCT BACKGROUNDS
    // ============================================
    lazyLoadProductBackgrounds();

});

// ============================================
// LAZY LOAD PRODUCT BACKGROUNDS
// ============================================
function lazyLoadProductBackgrounds() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bg = entry.target;
                const imgUrl = bg.getAttribute('data-bg');
                if (imgUrl) {
                    bg.style.backgroundImage = `url('${imgUrl}')`;
                    bg.removeAttribute('data-bg');
                }
                observer.unobserve(bg);
            }
        });
    }, { 
        rootMargin: '100px' // Load slightly before entering viewport
    });

    document.querySelectorAll('[data-bg]').forEach(bg => observer.observe(bg));
}

// ============================================
// PRODUCTS TABS INITIALIZATION
// ============================================
function initializeProductsTabs() {
    let activeTab = null;
    const productTabs = document.querySelectorAll('.product-tab');
    const totalTabs = productTabs.length;

    if (!productTabs.length) {
        return;
    }

    function updateTabWidths() {
        if (window.innerWidth <= 768) {
            productTabs.forEach(tab => {
                tab.style.width = '';
            });
            return;
        }

        productTabs.forEach(tab => {
            const productId = tab.getAttribute('data-product-id');
            
            if (activeTab === null) {
                tab.style.width = `calc(100vw / ${totalTabs})`;
            } else if (activeTab === productId) {
                tab.style.width = '70vw';
            } else {
                tab.style.width = `calc(30vw / ${totalTabs - 1})`;
            }
        });
    }

    function handleTabClick(event) {
        const tab = event.currentTarget;
        const productId = tab.getAttribute('data-product-id');
        
        if (activeTab === productId) {
            activeTab = null;
            tab.classList.remove('active');
        } else {
            productTabs.forEach(t => t.classList.remove('active'));
            activeTab = productId;
            tab.classList.add('active');
        }
        
        updateTabWidths();
    }

    productTabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });

    updateTabWidths();
}

// ============================================
// CREATE MOBILE MENU STRUCTURE
// ============================================
function createMobileMenu() {
    if (document.querySelector('.mobile-menu')) {
        return;
    }
    
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Open menu');
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    document.body.appendChild(hamburger);
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-menu';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close menu');
    mobileMenu.appendChild(closeBtn);
    
    const desktopNav = document.querySelector('.navbar');
    if (desktopNav) {
        const navLinks = desktopNav.querySelectorAll('.navlinks');
        navLinks.forEach(link => {
            if (!link.querySelector('img')) {
                const clonedLink = link.cloneNode(true);
                mobileMenu.appendChild(clonedLink);
            }
        });
    }
    
    document.body.appendChild(mobileMenu);
}

// ============================================
// UTILITY: DEBOUNCE FUNCTION
// ============================================
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

// ============================================
// WINDOW RESIZE HANDLER (Optimized)
// ============================================
const handleResize = debounce(function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (window.innerWidth > 768 && mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// INTERSECTION OBSERVER (REMOVED - Keeping only hero animations)
// ============================================
// All scroll-triggered animations removed for performance
// Only hero section animations remain (handled by CSS)