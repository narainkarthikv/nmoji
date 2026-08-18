export interface EmojiCombo {
  id: string;
  display: string;
  description: string;
  components: string[];
  type: 'zwj' | 'pair';
  category: string;
  popular: boolean;
}

export interface Shortcut {
  key: string;
  action: string;
  description: string;
  modifier?: 'ctrl' | 'cmd' | 'none';
}
