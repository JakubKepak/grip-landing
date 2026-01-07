/* ============================================
   GRIP LANDING PAGE - JAVASCRIPT
   ============================================ */

// ============================================
// ANALYTICS & TRACKING
// ============================================

// Simple analytics tracker - stores events locally and logs to console
// Can be replaced with Google Analytics, Mixpanel, or any other service
const Analytics = {
    events: [],
    
    // Track an event
    track(eventName, data = {}) {
        const event = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            ...data
        };
        
        this.events.push(event);
        
        // Store in localStorage for persistence
        this.saveToStorage();
        
        // Log to console for debugging
        console.log('📊 Analytics Event:', event);
        
        // TODO: Send to your analytics service here
        // Example: gtag('event', eventName, data);
        // Example: mixpanel.track(eventName, data);
        
        return event;
    },
    
    // Save events to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('grip_analytics', JSON.stringify(this.events));
        } catch (e) {
            console.warn('Could not save analytics to localStorage');
        }
    },
    
    // Load events from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('grip_analytics');
            if (stored) {
                this.events = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Could not load analytics from localStorage');
        }
    },
    
    // Get all tracked events
    getEvents() {
        return this.events;
    },
    
    // Get click count for a specific event
    getClickCount(eventName) {
        return this.events.filter(e => e.event === eventName).length;
    }
};

// Load any previously stored analytics
Analytics.loadFromStorage();

// ============================================
// EMAIL COLLECTION (SendGrid Integration)
// ============================================

const EmailService = {
    // SendGrid configuration
    // NOTE: In production, these calls should go through your backend
    // Never expose API keys in frontend code
    
    async subscribe(email, source = 'hero') {
        console.log('📧 Email subscription:', { email, source });
        
        // Track the subscription event
        Analytics.track('email_submitted', { email, source });
        
        // TODO: Replace this with your actual backend endpoint
        // Example backend endpoint that calls SendGrid:
        // 
        // const response = await fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, source })
        // });
        // 
        // if (!response.ok) throw new Error('Subscription failed');
        // return response.json();
        
        // For now, simulate a successful API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Store email locally for demo purposes
                this.storeEmailLocally(email, source);
                resolve({ success: true, email });
            }, 800);
        });
    },
    
    // Store emails locally (for demo/development)
    storeEmailLocally(email, source) {
        try {
            const stored = localStorage.getItem('grip_emails') || '[]';
            const emails = JSON.parse(stored);
            emails.push({
                email,
                source,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('grip_emails', JSON.stringify(emails));
            console.log('📧 Emails collected:', emails);
        } catch (e) {
            console.warn('Could not store email locally');
        }
    },
    
    // Get all collected emails (for demo/development)
    getCollectedEmails() {
        try {
            const stored = localStorage.getItem('grip_emails') || '[]';
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
};

// ============================================
// STORE BUTTON TRACKING
// ============================================

// Track store button clicks
function trackStoreClick(store) {
    Analytics.track('store_button_clicked', { store: store });
}

// Scroll to hero CTA (for nav button)
function scrollToHeroCTA() {
    const heroSection = document.getElementById('hero');
    heroSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// NAVIGATION
// ============================================

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            menuBtn.classList.toggle('active');
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Add animation class to elements
    const animateElements = [
        '.feature-card',
        '.step',
        '.testimonial-card',
        '.spot-card',
        '.stat'
    ];
    
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    });
}

// ============================================
// PAGE ANALYTICS
// ============================================

function initPageAnalytics() {
    // Track page view
    Analytics.track('page_view', {
        title: document.title,
        referrer: document.referrer
    });
    
    // Track scroll depth
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 100];
    const trackedMilestones = new Set();
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    Analytics.track('scroll_depth', { depth: milestone });
                }
            });
        }
    });
    
    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 180) {
            Analytics.track('time_on_page', { seconds: timeOnPage });
        }
    }, 10000);
}

// ============================================
// CONSOLE BRANDING
// ============================================

function showConsoleBranding() {
    console.log('%c🏋️ GRIP', 'font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #2563EB, #F97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cMaster Your Body. Own Your Streets.', 'font-size: 14px; color: #888;');
    console.log('%c---', 'color: #333;');
    console.log('%c📊 Analytics available at: Analytics.getEvents()', 'font-size: 12px; color: #2563EB;');
    console.log('%c📧 Collected emails at: EmailService.getCollectedEmails()', 'font-size: 12px; color: #F97316;');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavbarScrollEffect();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initPageAnalytics();
    
    // Show console branding
    showConsoleBranding();
    
    // Log initial CTA click count
    const ctaClicks = Analytics.getClickCount('cta_clicked');
    console.log(`📊 Total CTA clicks so far: ${ctaClicks}`);
});

// ============================================
// EXPORTS (for external access)
// ============================================

// Make functions globally available
window.scrollToHeroCTA = scrollToHeroCTA;
window.trackStoreClick = trackStoreClick;

// Make analytics globally available for debugging
window.Analytics = Analytics;
