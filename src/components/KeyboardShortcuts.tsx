import React, { useEffect } from 'react';
import { SHORTCUTS_DATA } from '../constants/combos';
import { formatShortcutKey } from '../utils/keyboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity duration-200 z-[65]'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none'>
        <div
          className='bg-[var(--color-surface-primary)] rounded-lg border border-[var(--color-border-primary)] shadow-lg max-w-md w-full pointer-events-auto'
          role='dialog'
          aria-labelledby='shortcuts-title'
          aria-modal='true'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-[var(--color-border-primary)]'>
            <h2
              id='shortcuts-title'
              className='text-xl font-bold text-[var(--color-text-primary)]'>
              ⌨️ Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className='text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md hover:bg-[var(--color-bg-secondary)] p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'
              aria-label='Close shortcuts modal'>
              ✕
            </button>
          </div>

          {/* Shortcuts List */}
          <div className='p-6 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto'>
            {SHORTCUTS_DATA.map((shortcut) => (
              <div
                key={shortcut.action}
                className='flex items-center justify-between p-3 rounded-md bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors'>
                <span className='text-sm text-[var(--color-text-secondary)]'>
                  {shortcut.description}
                </span>
                <kbd className='px-3 py-1.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border-secondary)] rounded-md text-xs font-mono font-semibold text-[var(--color-text-primary)] whitespace-nowrap'>
                  {formatShortcutKey(shortcut.key)}
                </kbd>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className='p-4 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] rounded-b-lg text-center'>
            <p className='text-xs text-[var(--color-text-muted)]'>
              Press{' '}
              <kbd className='px-2 py-0.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border-secondary)] rounded text-xs font-mono'>
                Esc
              </kbd>{' '}
              to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
