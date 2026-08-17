export type ShortcutAction =
  | 'focusSearch'
  | 'clearSearch'
  | 'navigate'
  | 'copy'
  | 'help'
  | 'category'
  | 'reset'
  | 'navigate_panels';

export type ShortcutHandlers = Partial<
  Record<ShortcutAction, (key?: string) => void>
>;

export function getKeyCombo(e: KeyboardEvent): string | null {
  const ctrl = e.ctrlKey || e.metaKey;
  const shift = e.shiftKey;
  const alt = e.altKey;

  // Handle standard key combinations
  if (ctrl && e.key.toLowerCase() === 'k') return 'ctrl+k';
  if (ctrl && e.key.toLowerCase() === 'r') return 'ctrl+r';
  if (e.key === 'Escape') return 'escape';
  if (e.key === '?') return '?';
  if (e.key === 'ArrowUp') return 'arrow-up';
  if (e.key === 'ArrowDown') return 'arrow-down';
  if (e.key === 'ArrowLeft') return 'arrow-left';
  if (e.key === 'ArrowRight') return 'arrow-right';
  if (e.key === 'Enter') return 'enter';
  if (e.key === ' ') return 'space';
  if (e.key === 'Tab') return 'tab';
  if (/^[1-9]$/.test(e.key) && !ctrl && !shift && !alt)
    return `category-${e.key}`;

  return null;
}

export function setupKeyboardShortcuts(handlers: ShortcutHandlers): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    const keyCombo = getKeyCombo(e);
    if (!keyCombo) return;

    // Map key combinations to actions
    let action: ShortcutAction | null = null;
    let actionKey: string | undefined;

    if (keyCombo === 'ctrl+k') action = 'focusSearch';
    else if (keyCombo === 'escape') action = 'clearSearch';
    else if (keyCombo.startsWith('arrow-')) action = 'navigate';
    else if (keyCombo === 'enter' || keyCombo === 'space') action = 'copy';
    else if (keyCombo === '?') action = 'help';
    else if (keyCombo.startsWith('category-')) {
      action = 'category';
      actionKey = keyCombo.split('-')[1];
    } else if (keyCombo === 'ctrl+r') action = 'reset';
    else if (keyCombo === 'tab') action = 'navigate_panels';

    if (action && handlers[action]) {
      e.preventDefault();
      handlers[action]!(actionKey);
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

export function isMacOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

export function formatShortcutKey(key: string): string {
  if (isMacOS()) {
    return key.replace('Ctrl', 'Cmd');
  }
  return key;
}
