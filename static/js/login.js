document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');
    const languageSelect = document.getElementById('languageSelect');

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // Password visibility toggle
    togglePassword.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        togglePassword.classList.toggle('show');
    });

    // Form submission (prevent default for demo)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');
    });

    // Language selection (demo - you would typically use a translation library)
    languageSelect.addEventListener('change', (e) => {
        console.log(`Language changed to: ${e.target.value}`);
    });

    // Subtle hover animation for buttons and links
    const interactiveElements = document.querySelectorAll('button, a');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.transition = 'transform 0.3s ease';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
});

