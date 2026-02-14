// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const lineBtn = document.getElementById('lineBtn');
const logoLink = document.querySelector('.logo-link');

// 檢查是否在表單頁面
const isFormPage = window.location.pathname.includes('join-founder.html');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Logo click to go to top of page
logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Close mobile menu if open
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Header scroll effect (僅在非表單頁面執行)
if (!isFormPage) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 51, 102, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 51, 102, 0.1)';
        } else {
            header.style.background = 'rgba(0, 51, 102, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Smooth scrolling for anchor links (僅在非表單頁面執行)
if (!isFormPage) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for fade-in animations (僅在非表單頁面執行)
if (!isFormPage) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('loading');
        observer.observe(section);
    });
}

// Active navigation highlighting (僅在非表單頁面執行)
if (!isFormPage) {
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
}


// LINE button functionality - 已設定實際連結，移除阻擋功能

// Accordion functionality for charter section
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const allHeaders = document.querySelectorAll('.accordion-header');
    const allContents = document.querySelectorAll('.accordion-content');
    
    // Close all other accordions
    allHeaders.forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
        }
    });
    
    allContents.forEach(c => {
        if (c !== content) {
            c.classList.remove('active');
        }
    });
    
    // Toggle current accordion
    header.classList.toggle('active');
    content.classList.toggle('active');
}

// Add loading animation to video section, charter section, benefit cards and news items (僅在非表單頁面執行)
if (!isFormPage) {
    document.addEventListener('DOMContentLoaded', () => {
        const videoSection = document.querySelector('.video-section');
        const charterSection = document.querySelector('.charter-section');
        const benefitCards = document.querySelectorAll('.benefit-card');
        const newsItems = document.querySelectorAll('.news-item');
        const contactItems = document.querySelectorAll('.contact-item');

        // Observe video section
        if (videoSection) {
            videoSection.classList.add('loading');
            observer.observe(videoSection);
        }

        // Observe charter section
        if (charterSection) {
            charterSection.classList.add('loading');
            observer.observe(charterSection);
        }

        // Stagger animation for benefit cards
        benefitCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('loading');
            observer.observe(card);
        });

        // Stagger animation for news items
        newsItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('loading');
            observer.observe(item);
        });

        // Stagger animation for contact items
        contactItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('loading');
            observer.observe(item);
        });
    });
}

// Add hover effect to benefit cards (僅在非表單頁面執行)
if (!isFormPage) {
    document.querySelectorAll('.benefit-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Form validation (if contact form is added in the future)
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('姓名為必填項目');
    }
    
    if (!formData.phone || !/^[\d\-\+\(\)\s]+$/.test(formData.phone)) {
        errors.push('請輸入有效的電話號碼');
    }
    
    if (!formData.email || ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('請輸入有效的電子郵件地址');
    }
    
    return errors;
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load (僅在非表單頁面執行)
if (!isFormPage) {
    window.addEventListener('load', () => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && window.innerWidth > 768) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 80);
        }
    });
}

// Counter animation for statistics (if added in the future)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Back to top button functionality
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #003366;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(0, 51, 102, 0.3);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
createBackToTopButton();

// Console welcome message
console.log('%c桃園市保全人員職業工會', 'color: #003366; font-size: 20px; font-weight: bold;');
console.log('%c保障權益．提升技能．溫暖互助', 'color: #FFD700; font-size: 14px;');

// 網頁載入完成後自動顯示宣傳彈跳視窗 (每次 reload 都會顯示)
document.addEventListener('DOMContentLoaded', function() {
  const promoModal = document.getElementById('autoPromoModal');
  const closeBtn = document.querySelector('.promo-close-btn');
  
  if (promoModal) {
    // 延遲 0.5 秒後彈出，讓視覺效果更好
    setTimeout(() => {
      promoModal.style.display = 'flex';
    }, 500);

    // 點擊 X 關閉
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        promoModal.style.display = 'none';
      });
    }
    
    // 點擊遮罩背景關閉
    window.addEventListener('click', function(event) {
      if (event.target === promoModal) {
        promoModal.style.display = 'none';
      }
    });
  }
});
