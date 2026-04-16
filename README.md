![License](https://img.shields.io/github/license/narainkarthikv/Nmoji)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Last Commit](https://img.shields.io/github/last-commit/narainkarthikv/Nmoji)
[![GitHub issues](https://img.shields.io/github/issues/narainkarthikv/Nmoji)](https://github.com/narainkarthikv/Nmoji/issues)
[![GitHub stars](https://img.shields.io/github/stars/narainkarthikv/Nmoji)](https://github.com/narainkarthikv/Nmoji/stargazers)

# 🔎 Nmoji

**Quick emoji selection and filtering—beautifully designed and optimized**

Nmoji is a lightweight, high-performance web application for quick emoji search, discovery, and filtering. Whether you need to find the perfect emoji for your message or explore by category, Nmoji makes it fast and fun. 😉✨

## ✨ Features

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

## 🔐 Privacy & Security First

- **Zero Server Dependency**: No backend, no cloud, no data transmission
- **Local Operation**: Runs entirely in your browser
- **No Tracking**: No analytics, no cookies, no telemetry
- **Open Source**: Transparent and auditable code

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher

### Local Installation

```bash
# Clone the repository
git clone https://github.com/narainkarthikv/Nmoji.git
cd Nmoji

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3000** to see the app.

### Production Build

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Astro** - Static site generation
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool

<p align="center">
<img src="https://skillicons.dev/icons?i=react,astro,ts,tailwind,vite" alt="Tech Stack" />
</p>

## 📁 Project Structure

```
nmoji/
├── src/
│   ├── components/          # React components
│   │   ├── EmojiApp.tsx    # Main application component
│   │   ├── EmojiGrid.tsx   # Emoji grid display
│   │   ├── EmojiDescription.tsx # Emoji details panel
│   │   ├── FilterBar.tsx   # Category & tag filtering
│   │   ├── SearchBar.tsx   # Search functionality
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── ThemeToggle.tsx # Dark/light mode toggle
│   │   └── ui/             # Reusable UI components
│   ├── layouts/             # Astro page layouts
│   ├── pages/               # Astro pages (routes)
│   ├── scripts/             # Client-side JavaScript
│   ├── styles/              # Global CSS
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── lib/                 # Library utilities
├── extension/               # Browser extension (Chrome/Firefox)
├── public/                  # Static public assets
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.mjs       # TailwindCSS configuration
├── package.json             # Project metadata & dependencies
└── README.md               # This file
```

## 🔑 Environment Variables

Nmoji does not require any environment variables for local development.

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run clean        # Clean build artifacts
npm run astro        # Run Astro commands
```

### Code Style Guidelines

- **Formatting**: Follow existing conventions and 2-space indentation
- **React**: Functional components with hooks
- **TypeScript**: Prefer typed props and models
- **Accessibility**: Semantic HTML and keyboard navigation

### Formatting (Prettier)

```bash
# Check formatting
npx prettier --check .

# Write formatting fixes
npx prettier --write .
```

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

1. **Read the Guidelines**: Check [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed instructions
2. **Pick an Issue**: Browse [open issues](https://github.com/narainkarthikv/Nmoji/issues) or create a new one
3. **Fork & Branch**: Create a feature branch from your fork
4. **Code**: Follow our code style and commit conventions
5. **Test**: Ensure everything works locally
6. **Submit PR**: Open a pull request with a clear description

### Ways to Contribute

- 🐛 **Fix bugs** and improve stability
- ✨ **Add features** that enhance emoji discovery
- 📚 **Improve documentation** and examples
- 🎨 **Enhance UI/UX** and accessibility
- ⚡ **Optimize performance**
- 🌍 **Add translations** and i18n support

## 💬 Community & Support

- **Issues**: [Report bugs or request features](https://github.com/narainkarthikv/Nmoji/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/narainkarthikv/Nmoji/discussions)
- **Pull Requests**: [Contribute code improvements](https://github.com/narainkarthikv/Nmoji/pulls)

## 📖 Documentation

- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community guidelines
- [Security Policy](./SECURITY.md) - How to report vulnerabilities
- [Contributors](./Contributors.md) - Contributor list
- [License](./MIT-LICENSE.txt) - MIT License details

## 🔒 Security

We take security seriously. If you discover a security vulnerability, please see our [Security Policy](./SECURITY.md) for reporting instructions.

## 📜 License

This project is licensed under the **MIT License** - see [MIT-LICENSE.txt](./MIT-LICENSE.txt) for details.

**Summary:** You are free to use, modify, and distribute this software for any purpose, including commercial use.

## 🌟 Show Your Support

If Nmoji helps you find the perfect emoji:

- ⭐ Star the repository
- 🐛 Report issues you encounter
- 💡 Share your feature ideas
- 🤝 Contribute code or docs
- 📢 Tell others about the project

## 🔗 Links

- **Production Demo**: [https://nmoji.netlify.app/](https://nmoji.netlify.app/)
- **Development Demo**: [https://nmoji-dev.vercel.app/](https://nmoji-dev.vercel.app/)
- **Repository**: [https://github.com/narainkarthikv/Nmoji](https://github.com/narainkarthikv/nmoji)

---

**Built with ❤️ by the Wisdom Fox community**

Let's build the best emoji picker together! 🚀
