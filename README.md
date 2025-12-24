# 🔎 Nmoji

> **Quick emoji selection and filtering—beautifully designed and optimized**

Welcome to **Nmoji**! A straightforward, high-performance web application for quick emoji search, discovery, and filtering. Whether you need to find the perfect emoji for your message or explore by category, Nmoji makes it fast and fun. 😉✨

[![GitHub issues](https://img.shields.io/github/issues/narainkarthikv/Nmoji?style=flat-square)](https://github.com/narainkarthikv/Nmoji/issues)
[![GitHub forks](https://img.shields.io/github/forks/narainkarthikv/Nmoji?style=flat-square)](https://github.com/narainkarthikv/Nmoji/network)
[![GitHub stars](https://img.shields.io/github/stars/narainkarthikv/Nmoji?style=flat-square)](https://github.com/narainkarthikv/Nmoji/stargazers)
[![MIT License](https://img.shields.io/github/license/narainkarthikv/Nmoji?style=flat-square)](./MIT-LICENSE.txt)
[![Version](https://img.shields.io/github/package-json/v/narainkarthikv/Nmoji?style=flat-square)](./package.json)

---

## 🌟 Why Nmoji?

**Nmoji** is a lightweight, performance-focused project designed to help you **discover emojis quickly**, **learn modern web development**, and **contribute to a friendly community**. Whether you're looking for a specific emoji or exploring what's available, Nmoji provides a smooth, responsive experience.

✨ **Key Features:**

- 🔍 **Advanced Search** — Search by emoji name, description, category, tags, and aliases
- 🏷️ **Filter by Category** — Browse emojis organized by type (smileys, animals, food, etc.)
- 🎨 **Beautiful Design** — Modern, responsive UI built with React and TailwindCSS
- 🌓 **Dark & Light Themes** — Toggle between themes with smooth transitions
- ⚡ **High Performance** — Optimized with code splitting, lazy loading, and asset optimization
- 📱 **Fully Responsive** — Perfect on desktop, tablet, and mobile devices
- 💡 **Learning Friendly** — Great codebase for learning Astro, React, and TypeScript
- 🔗 **Browser Extension** — Includes a Chrome/Firefox extension for quick access
- 🚀 **Easy Setup** — Clone, install, and run in minutes
- 📚 **Well Documented** — Includes optimization guides and deployment docs

---

## 📑 Table of Contents

- [Why Nmoji?](#-why-nmoji)
- [Tech Stack](#-tech-stack)
- [Local Development](#-local-development)
- [Building for Production](#-building-for-production)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Debugging & Performance](#-debugging--performance)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🛠️ Tech Stack

- **Frontend:** `React` (v18) + `TypeScript` + `TailwindCSS`
- **Framework:** `Astro` (v5) for static site generation
- **Styling:** TailwindCSS with custom theme system
- **Build:** Astro with optimized Vite configuration
- **CI/CD:** GitHub Actions, Netlify deployment

---

## 💻 Local Development

**Prerequisites:** Node 18+ and npm

**Install and run:**

```bash
npm install
npm run dev
```

The app will start at `http://localhost:3000`. Open your browser and begin exploring!

**Build for production:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

**Lint code:**

```bash
npm run astro -- --help
```

**Clean build artifacts:**

```bash
npm run clean
```

---

## 📂 Project Structure

```
nmoji/
├── docs/                     # Documentation
│   ├── QUICK_START.md       # Getting started guide
│   ├── DEPLOYMENT.md        # Deployment instructions
│   ├── OPTIMIZATION_GUIDE.md # Performance optimization
│   └── CHANGES_SUMMARY.md    # Recent changes
├── src/
│   ├── assets/              # Static assets (images, fonts)
│   │   └── images/         # Image files
│   ├── components/          # React components
│   │   ├── EmojiApp.tsx    # Main application component
│   │   ├── EmojiGrid.tsx   # Emoji grid display
│   │   ├── EmojiDescription.tsx # Emoji details panel
│   │   ├── FilterBar.tsx   # Category & tag filtering
│   │   ├── SearchBar.tsx   # Search functionality
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── ThemeToggle.tsx # Dark/light mode toggle
│   │   └── ui/             # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── ButtonPrimary.tsx
│   │       └── ButtonSecondary.tsx
│   ├── layouts/             # Astro page layouts
│   │   ├── Layout.astro     # Main layout
│   │   └── AppLayout.astro  # App-specific layout
│   ├── pages/               # Astro pages (routes)
│   │   ├── index.astro      # Landing page
│   │   └── app.astro        # Application page
│   ├── scripts/             # Client-side JavaScript
│   │   ├── app.js          # App initialization
│   │   └── main.js         # Core functionality
│   ├── styles/              # Global CSS
│   │   ├── base.css        # Base styles
│   │   ├── main.css        # Main styles
│   │   ├── landing.css     # Landing page styles
│   │   ├── theme.css       # Theme variables
│   │   ├── EmojiApp.css
│   │   ├── EmojiGrid.css
│   │   ├── FilterBar.css
│   │   ├── SearchBar.css
│   │   ├── EmojiDescription.css
│   │   └── ThemeToggle.css
│   ├── types/               # TypeScript type definitions
│   │   └── emoji.ts        # Emoji type interfaces
│   ├── utils/               # Utility functions
│   │   ├── emoji.ts        # Emoji search & filter logic
│   │   └── theme.ts        # Theme management utilities
│   ├── lib/                 # Library utilities
│   │   └── constants.ts     # App-wide configuration
│   └── env.d.ts             # TypeScript ambient declarations
├── extension/               # Browser extension (Chrome/Firefox)
│   ├── manifest.json       # Extension manifest
│   ├── NmojiList.json      # Emoji data for extension
│   ├── popup.html          # Extension popup UI
│   ├── popup.js            # Extension popup logic
│   ├── styles.css          # Extension styles
│   └── README.md           # Extension documentation
├── public/                  # Static public assets
│   └── NmojiList.json       # Emoji database
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.mjs       # TailwindCSS configuration
├── postcss.config.js         # PostCSS configuration
├── package.json             # Project metadata & dependencies
├── Contributors.md          # List of contributors
├── MIT-LICENSE.txt         # MIT License
└── README.md               # This file
```

---

## 🚀 What's Implemented

- **Emoji Search Engine** — Search across emoji names, descriptions, categories, tags, and aliases
- **Smart Filtering** — Filter by category, tags, or custom criteria
- **Theme System** — Dark/light mode with localStorage persistence
- **Performance Optimizations** — Code splitting, lazy loading, asset optimization
- **Responsive Design** — Mobile-first, adapts to all screen sizes
- **Browser Extension** — Quick access to emoji picker as a browser extension
- **TypeScript Support** — Fully typed for better development experience
- **Astro Integration** — Static site generation with React islands architecture

For detailed implementation info, see:
- [Quick Start Guide](./docs/QUICK_START.md)
- [Optimization Guide](./docs/OPTIMIZATION_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions from everyone! To contribute to Nmoji, follow these steps:

**Standard workflow:**

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/Nmoji.git
cd Nmoji

# 3. Create a branch for your feature
git switch -c feature/your-feature-name

# 4. Make your changes and test them
npm run dev

# 5. Add yourself to Contributors.md
# Format: -[Username](https://github.com/your-username) **Your contribution**

# 6. Commit with a descriptive message
git add .
git commit -m "feat: add your feature description"

# 7. Push to your fork
git push origin feature/your-feature-name

# 8. Open a Pull Request on GitHub
```

**Guidelines:**
- Keep commits focused and descriptive
- Test locally with `npm run dev` before pushing
- Update documentation if needed
- Add yourself to `Contributors.md`
- Follow the existing code style

---

## 🔍 Debugging & Performance

**Development mode:**
```bash
npm run dev
```

**Check for TypeScript errors:**
```bash
npm run astro -- check
```

**Build and test production bundle:**
```bash
npm run build
npm run preview
```

**Performance tips:**
- See [OPTIMIZATION_GUIDE.md](./docs/OPTIMIZATION_GUIDE.md) for detailed performance tuning
- Use React DevTools to profile components
- Check lighthouse in browser DevTools

---

## 👥 Contributors

We appreciate the contributions of the following individuals:

[View all contributors →](./Contributors.md)

This project is stronger because of our amazing community! Thank you for contributing! ❤️

---

## 📜 License

This project is licensed under the MIT License—see the [MIT-LICENSE.txt](./MIT-LICENSE.txt) file for details.
