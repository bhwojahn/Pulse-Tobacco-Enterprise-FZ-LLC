// ============================================
// PULSE TOBACCO ENTERPRISE - SCRIPT.JS
// Mobile Menu, Smooth Scrolling, Navbar Effects, Timeline Navigation, Products Tabs
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR SCROLL EFFECT (Frosted Glass)
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================
    
    // Create mobile menu elements if they don't exist
    createMobileMenu();
    
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu .navlinks');
    
    // Open mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
    }
    
    // Close mobile menu
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }
    
    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
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
            
            // Don't prevent default for links that just have '#' or go to other pages
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
    // FORM VALIDATION (Basic)
    // ============================================
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            
            if (isValid) {
                // For now, just show an alert
                // Later we'll connect this to the Python backend
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // ============================================
    // TIMELINE NAVIGATION (Products Section)
    // ============================================
    initializeTimelineNavigation();

    // ============================================
    // PRODUCTS SECTION TABS
    // ============================================
    initializeProductsTabs();

});

// ============================================
// TIMELINE NAVIGATION INITIALIZATION
// ============================================
function initializeTimelineNavigation() {
    const timelineNav = document.getElementById('timeline-nav');
    const timelineToggle = document.getElementById('timeline-toggle');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const productSections = document.querySelectorAll('.product-section');

    // Only run if timeline elements exist (products page)
    if (!timelineNav || !timelineItems.length) {
        return;
    }

    // Toggle Timeline Expand/Collapse (Mobile ONLY)
    if (timelineToggle) {
        timelineToggle.addEventListener('click', function(e) {
            e.preventDefault();
            // Only allow toggle on mobile
            if (window.innerWidth <= 768) {
                timelineNav.classList.toggle('collapsed');
            }
        });
    }

    // Timeline Item Click Navigation
    timelineItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            timelineItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Collapse timeline on mobile after selection
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    timelineNav.classList.add('collapsed');
                }, 300);
            }
        });
    });

    // Highlight active section on scroll (debounced)
    const highlightActiveSection = debounce(function() {
        let currentSection = null;
        
        productSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // Check if section is in viewport (more than 40% visible)
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            const sectionId = currentSection.getAttribute('id');
            
            // Update active timeline item
            timelineItems.forEach(item => {
                if (item.getAttribute('data-target') === sectionId) {
                    if (!item.classList.contains('active')) {
                        timelineItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                }
            });
        }
    }, 100);

    window.addEventListener('scroll', highlightActiveSection);

    // Initialize - Set collapsed state ONLY on mobile, always expanded on desktop/tablet
    if (window.innerWidth <= 768) {
        timelineNav.classList.add('collapsed');
    } else {
        timelineNav.classList.remove('collapsed');
    }
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
                tab.style.width = ''; // Let CSS handle vertical mobile layout
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
    // Check if mobile menu already exists
    if (document.querySelector('.mobile-menu')) {
        return;
    }
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Open menu');
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    document.body.appendChild(hamburger);
    
    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-menu';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close menu');
    mobileMenu.appendChild(closeBtn);
    
    // Clone navigation links from desktop nav
    const desktopNav = document.querySelector('.navbar');
    if (desktopNav) {
        const navLinks = desktopNav.querySelectorAll('.navlinks');
        navLinks.forEach(link => {
            // Skip the logo
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
    const timelineNav = document.getElementById('timeline-nav');
    
    // Close mobile menu if window is resized to desktop size
    if (window.innerWidth > 768 && mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Reset timeline nav state on resize
    if (timelineNav) {
        if (window.innerWidth <= 768) {
            timelineNav.classList.add('collapsed');
        } else {
            timelineNav.classList.remove('collapsed');
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// INTERSECTION OBSERVER (Fade-in animations)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible to prevent re-triggering
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elements to animate
// Elements to animate
const animatedElements = [
    '.about-images-col',
    '.about-label',
    '.about-headline',
    '.about-description',
    '.about-check-item',
    '.cta-button',
    '.sourcing-text-container',
    '.image-sourcing',
    '.sampling-text-container',
    '.image-sampling',
    '.logistics-text-container',
    '.image-logistics',
    '.sourcing-title',
    '.sampling-title',
    '.logistics-title'
];

// Special handling to stagger check items
document.querySelectorAll('.about-check-item').forEach((item, index) => {
    item.style.setProperty('--delay', `${0.8 + (index * 0.1)}s`);
});

document.querySelectorAll(animatedElements.join(',')).forEach(el => {
    // Add base transition class if not present
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    
    // Add stagger delay for specific about-us elements
    let delay = '0s';

    if (el.classList.contains('about-images-col')) {
        el.style.transform = 'translateX(-30px)'; 
        delay = '0.2s';
    }
    if (el.classList.contains('about-label')) delay = '0.4s';
    if (el.classList.contains('about-headline')) delay = '0.5s';
    if (el.classList.contains('about-description')) delay = '0.6s';
    
    // Use the custom property for check items if it exists
    if (el.classList.contains('about-check-item')) {
        delay = el.style.getPropertyValue('--delay') || '0.8s';
    }
    
    if (el.classList.contains('cta-button')) delay = '1.0s';
    
    el.style.transition = `opacity 0.8s ease-out ${delay}, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}`;
    
    // Create a visibility class dynamic rule or just set inline on intersect
    // We'll use a class 'visible' mechanism
    observer.observe(el);
});

// Add CSS rule for .visible via JS to ensure it overrides inline styles
const style = document.createElement('style');
style.innerHTML = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// PRODUCTS TABS ENHANCEMENTS
// ============================================
// Enhanced width calculation for smoother resizing
const productTabsContainer = document.querySelector('.products-tabs-container');
if (productTabsContainer) {
    // Force recalculate on window resize
    window.addEventListener('resize', debounce(() => {
        // Trigger a click on the active tab to re-verify widths if needed
        // or just let CSS handle it (our new CSS is robust)
        const activeTab = document.querySelector('.product-tab.active');
        if (!activeTab && window.innerWidth > 768) {
            // If no tab is active on desktop, maybe activate the first one?
            // Actually, keep them equal is better.
        }
    }, 200));
}

// Ensure first tab is active by default on desktop for better first impression
if (window.innerWidth > 768) {
    const firstTab = document.querySelector('.product-tab');
    if (firstTab && !document.querySelector('.product-tab.active')) {
        // Optional: firstTab.click(); 
        // User didn't ask for this, so I'll leave it neutral
    }
}
