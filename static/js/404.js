// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
  document.body.classList.add('dark');
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
});

// Listen for system theme changes
prefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
});
