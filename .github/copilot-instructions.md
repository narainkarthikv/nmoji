# GitHub Copilot Coding Agent Instructions

## Purpose

These instructions onboard GitHub Copilot Coding Agent to the Nmoji repository.
Follow this document as the single source of truth for understanding the codebase, architecture, and development practices. Only search the repository if information here is missing or incorrect.

---

## Repository Summary

**Nmoji** is a modern, responsive emoji picker web application built with Astro, featuring advanced search, filtering, theme support, and a browser extension. It serves as a fast, privacy-first tool for discovering and selecting emojis across devices.

Key features:

- Interactive emoji search and filtering by category, name, and tags
- Dark/Light theme support with smooth transitions
- Virtual scrolling for performance with large emoji datasets
- Responsive design optimized for all devices
- Keyboard navigation and accessibility features
- Browser extension for quick access
- Static site generation for optimal performance
- Deployable to multiple platforms (Vercel, Netlify, Cloudflare)

The project is a single-page application using Astro's static site generation, with React components for interactivity and a Manifest V3 browser extension.

---

## High-Level Repository Information

- **Repository Size**: Small to Medium (frontend-only, component-based architecture)
- **Primary Language**: TypeScript/JavaScript
- **Framework**: Astro 5.x with React integration
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite (via Astro)
- **Deployment**: Static site (Vercel, Netlify, Cloudflare Pages)
- **Key Libraries**:
  - React for interactive components
  - Tailwind CSS for styling
  - Custom hooks for debouncing and virtual scrolling
  - Styled Components for advanced styling
  - TypeScript for type safety

---

## Environment Requirements

### Runtime Versions

- **Node.js**: 18.x or newer
- **npm**: 9.x or newer (or pnpm/yarn)
- **Astro**: 5.x

### Development Setup

No complex environment setup required. The project uses static emoji data from `public/NmojiList.json`.

### Environment Files

- No environment variables required for basic development
- Optional: Configure deployment-specific variables for different platforms

---

## Build & Validation Instructions

### Development Server

```bash
npm run dev
```

- Runs on `http://localhost:3000`
- Hot reload enabled
- Includes all interactive features

### Production Build

```bash
npm run build
```

- Generates static files in `dist/`
- Includes TypeScript checking with `astro check`
- Optimized for production deployment

### Preview Production Build

```bash
npm run preview
```

- Serves the built site locally for testing

### Type Checking

```bash
npx astro check
```

- Validates TypeScript and Astro components
- Run before commits

### Linting & Formatting

- Uses Prettier with Astro and Tailwind plugins
- Configured in `.prettierrc`
- Run formatting on save in your editor

---

## Project Architecture & Layout

### Repository Root

```
/
├── src/
│   ├── components/
│   │   ├── EmojiApp.tsx       # Main application component
│   │   ├── EmojiGrid.tsx      # Virtual scrolling emoji display
│   │   ├── EmojiDescription.tsx # Emoji details panel
│   │   ├── FilterBar.tsx      # Category filtering
│   │   ├── SearchBar.tsx      # Search functionality
│   │   ├── ThemeToggle.tsx    # Theme switcher
│   │   ├── Navbar.tsx         # Navigation bar
│   │   └── ui/                # Reusable UI components
│   ├── layouts/
│   │   ├── Layout.astro       # Main page layout
│   │   └── AppLayout.astro    # App-specific layout
│   ├── lib/
│   │   └── constants.ts       # App configuration
│   ├── pages/
│   │   ├── index.astro        # Landing page
│   │   └── app.astro          # Main application page
│   ├── scripts/               # Client-side scripts
│   ├── styles/                # Global styles and themes
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Helper functions
│   └── hooks/                 # Custom React hooks
├── extension/                 # Browser extension files
├── public/                    # Static assets (NmojiList.json)
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind configuration
└── package.json
```

### Component Architecture

- **Astro Components**: Server-side rendered, used for layout and static content
- **React Components**: Client-side interactive elements for emoji interactions
- **Hybrid Approach**: Astro handles page structure, React manages emoji state and interactions

### Data Flow

- Static emoji data from `public/NmojiList.json`
- React state management for search, filter, and selection
- Theme state managed via CSS custom properties and localStorage
- Virtual scrolling for performance with large datasets

---

## Coding Standards

### General

- **Language**: TypeScript preferred, JavaScript acceptable for simple scripts
- **Formatting**: Prettier with 2-space indentation
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Imports**: Relative imports or absolute with proper paths
- **File Extensions**: `.astro` for pages/layouts, `.tsx` for React components, `.ts` for utilities

### Astro Components

- Use frontmatter for data and props
- Prefer server-side rendering over client-side JavaScript
- Use `client:idle` for interactivity when needed
- Keep components focused and reusable

### React Components

- Functional components with hooks
- No class components
- Use TypeScript for type safety
- Manage state efficiently with useState/useEffect

### Styling

- **Primary**: Tailwind CSS utility classes
- **Custom CSS**: Use component-specific CSS files
- **Design Tokens**: Use CSS custom properties for themes
- **Responsive**: Mobile-first approach with `sm:`, `md:`, `lg:` prefixes

### Design System & UI Guidelines

Refer to `design-system.md` for detailed design tokens, color palette, typography, and component patterns. When implementing UI components, always reference the design system for consistency.

---

### Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance for themes

---

## UI/UX Guidelines

### Design Philosophy

- **Fast & Intuitive**: Quick emoji discovery and selection
- **Clean & Modern**: Minimalist design with focus on content
- **Interactive**: Smooth hover effects and transitions
- **Responsive**: Seamless experience across devices
- **Performance**: Optimized for fast loading and smooth scrolling

### Visual Design

- **Color Scheme**: Adaptive theme with dark/light mode support
- **Typography**: Clean, readable fonts for emoji and text
- **Spacing**: Consistent use of Tailwind spacing scale
- **Animations**: Subtle transitions, no distracting effects

### Interaction Design

- **Search**: Real-time filtering with debouncing
- **Filtering**: Category-based selection
- **Selection**: Click to select, copy to clipboard
- **Theme Switching**: Smooth transitions with persistence
- **Keyboard Navigation**: Full accessibility support

### Component Patterns

- **Emoji Components**: Grid display with virtual scrolling
- **Control Components**: Search, filter, and theme controls
- **Layout Components**: Consistent page structure

### User Experience

- **Loading**: Fast static generation, minimal loading states
- **Navigation**: Smooth scrolling, intuitive controls
- **Content**: Organized emoji categories and search results
- **Mobile**: Touch-friendly interactions, optimized layouts

---

## Component Development Guidelines

### Creating New Emoji Features

1. Create component in `src/components/`
2. Import emoji data and types
3. Use existing patterns for state management
4. Add to `EmojiApp.tsx` for integration

### Adding Interactive Elements

1. Use appropriate React hooks for state
2. Add keyboard event handlers
3. Test accessibility features
4. Ensure responsive behavior

### Styling New Components

1. Use Tailwind utility classes primarily
2. Add custom styles to component CSS files
3. Follow existing color and spacing patterns
4. Test in both light and dark themes

### Performance Guidelines

1. Use virtual scrolling for large lists
2. Implement debouncing for search
3. Optimize re-renders with React.memo
4. Minimize bundle size

---

## Deployment & CI/CD

### Supported Platforms

- **Vercel**: `npm run build` then deploy `dist/`
- **Netlify**: Standard static site deployment
- **Cloudflare Pages**: `npm run build` then deploy `dist/`

### Build Optimization

- Image optimization via Astro
- CSS minification and purging
- JavaScript bundling with Vite
- Compression enabled

### Performance

- Static generation for instant loading
- Virtual scrolling for large datasets
- Optimized emoji data loading
- Core Web Vitals optimized

---

## Common Issues & Solutions

### Build Failures

- Ensure Node.js 18+
- Check TypeScript errors with `astro check`
- Verify emoji data file exists in `public/`

### Styling Issues

- Clear Tailwind cache if needed
- Check for conflicting CSS classes
- Test in both themes

### Interactive Elements

- Ensure React components hydrate properly
- Test search and filter functionality
- Verify keyboard accessibility

---

## Agent Guidance

### Development Workflow

- Always run `npm run build` before committing
- Test changes in both light and dark themes
- Verify emoji search and filtering works
- Check responsive design on multiple screen sizes

### Code Quality

- Follow existing patterns and conventions
- Keep components small and focused
- Use TypeScript for new code
- Add comments for complex logic

### Architecture Decisions

- Prefer React for interactive emoji features
- Use static data from `public/NmojiList.json`
- Maintain separation between layout and logic
- Keep the codebase simple and maintainable

### When to Ask for Help

- Major architectural changes
- Complex emoji interactions
- Integration with new libraries
- Performance optimizations

---

## End of Instructions
