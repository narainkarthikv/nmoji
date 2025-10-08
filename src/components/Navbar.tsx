import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nmoji-dark');
    const prefer =
      stored === 'true' ||
      (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefer);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    // Persist preference and notify layout to apply theme inside app wrapper
    localStorage.setItem('nmoji-dark', String(next));
    window.dispatchEvent(new CustomEvent('nmoji-toggle-theme', { detail: { dark: next } }));
  }

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-3">
        <a href="/" className="text-lg font-semibold text-[var(--text-primary)]">
          Nmoji
        </a>
        <span className="text-sm text-[var(--text-secondary)]">Find emojis faster</span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/app"
          className="px-3 py-2 rounded-md bg-[var(--accent-color)] text-white text-sm font-medium hover:brightness-95"
        >
          Open App
        </a>
        <button
          aria-pressed={isDark}
          onClick={toggle}
          className="p-2 rounded-md bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
        >
          {isDark ? '🌙' : '🌞'}
        </button>
      </div>
    </nav>
  );
}
