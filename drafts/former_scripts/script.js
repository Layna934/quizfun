// // Theme handling
// function initTheme() {
//     // Check for saved theme preference, otherwise use system preference
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
//     if (savedTheme) {
//         document.documentElement.setAttribute('data-theme', savedTheme);
//     } else if (prefersDark) {
//         document.documentElement.setAttribute('data-theme', 'dark');
//     }
// }

// function toggleTheme() {
//     const currentTheme = document.documentElement.getAttribute('data-theme');
//     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
//     document.documentElement.setAttribute('data-theme', newTheme);
//     localStorage.setItem('theme', newTheme);
// }

// // Mobile menu handling
// function toggleMobileMenu() {
//     const nav = document.querySelector('.nav-desktop');
//     nav.classList.toggle('show');
// }

// // Smooth scroll for anchor links
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         const target = document.querySelector(this.getAttribute('href'));
//         if (target) {
//             target.scrollIntoView({
//                 behavior: 'smooth'
//             });
//         }
//     });
// });

// // Testimonial slider touch handling
// const slider = document.querySelector('.testimonial-slider');
// let isDown = false;
// let startX;
// let scrollLeft;

// slider.addEventListener('mousedown', (e) => {
//     isDown = true;
//     slider.classList.add('active');
//     startX = e.pageX - slider.offsetLeft;
//     scrollLeft = slider.scrollLeft;
// });

// slider.addEventListener('mouseleave', () => {
//     isDown = false;
//     slider.classList.remove('active');
// });

// slider.addEventListener('mouseup', () => {
//     isDown = false;
//     slider.classList.remove('active');
// });

// slider.addEventListener('mousemove', (e) => {
//     if (!isDown) return;
//     e.preventDefault();
//     const x = e.pageX - slider.offsetLeft;
//     const walk = (x - startX) * 2;
//     slider.scrollLeft = scrollLeft - walk;
// });

// // Initialize theme on page load
// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
    
//     // Add event listeners
//     document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
//     document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
// });

// // Handle system theme changes
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//     if (!localStorage.getItem('theme')) {
//         document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
//     }
// });

// // Initialize Lucide icons
// if (typeof lucide !== 'undefined') {
//     lucide.createIcons();
// }

// Theme handling
function initTheme() {
    // Check for saved theme preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Mobile menu handling
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-desktop');
    nav.classList.toggle('show');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial slider touch handling
const slider = document.querySelector('.testimonial-slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
});

// Auto-scroll testimonials
let testimonialInterval;

function startTestimonialAutoScroll() {
    testimonialInterval = setInterval(() => {
        const slider = document.querySelector('.testimonial-slider');
        const testimonialWidth = slider.querySelector('.testimonial').offsetWidth + 32; // width + gap
        
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
            // Reset to start if we're at the end
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Scroll to next testimonial
            slider.scrollBy({ left: testimonialWidth, behavior: 'smooth' });
        }
    }, 10000); // 10 seconds interval
}

// Stop auto-scroll on user interaction
slider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
slider.addEventListener('mouseleave', () => startTestimonialAutoScroll());

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add event listeners
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
    startTestimonialAutoScroll();
});

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
