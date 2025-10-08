// Theme management
const themeManager = {
  init() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');
    this.loadTheme();
    this.bindEvents();
  },

  loadTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      this.themeIcon.textContent = '🌚';
    }
  },

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  },

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    this.themeIcon.textContent = isDarkMode ? '🌚' : '🌞';
  },
};

// Initialize theme management
document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
});
