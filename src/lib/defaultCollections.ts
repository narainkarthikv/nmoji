import type { EmojiCollection } from '../types/collection';

const now = 0;

const define = (
  id: string,
  name: string,
  description: string,
  emojis: string[]
): EmojiCollection => ({
  id,
  name,
  description,
  emojis,
  isDefault: true,
  createdAt: now,
  updatedAt: now,
});

export const DEFAULT_COLLECTIONS: EmojiCollection[] = [
  define('all', 'All Emojis', 'The complete Nmoji library', []),
  define('reactions', 'Reactions', 'Common emoji reactions', [
    '👍',
    '❤️',
    '😂',
    '🔥',
    '💯',
    '💀',
    '😭',
    '🤔',
    '👏',
    '🎉',
    '🙏',
    '✨',
  ]),
  define(
    'activities',
    'Activities',
    'Sports, hobbies, games, and creative time',
    [
      '⚽',
      '🏀',
      '🏈',
      '🎮',
      '🕹️',
      '🎬',
      '🎨',
      '🎵',
      '🎸',
      '🏆',
      '🎯',
      '🎲',
      '🚴',
    ]
  ),
  define('nature', 'Nature', 'Animals, plants, and the outdoors', [
    '🦁',
    '🐶',
    '🐱',
    '🐼',
    '🦊',
    '🌲',
    '🌳',
    '🌻',
    '🌈',
    '🌊',
    '☀️',
    '🌙',
    '⭐',
    '🔥',
  ]),
  define('office', 'Office Emojis', 'Work-friendly symbols and gestures', [
    '📊',
    '💼',
    '🎯',
    '✅',
    '📅',
    '📌',
    '📎',
    '💡',
    '📝',
    '📈',
    '🤝',
    '👋',
    '👍',
  ]),
  define('social', 'Social Media', 'Popular emojis for messages and posts', [
    '📱',
    '💬',
    '📸',
    '❤️',
    '😂',
    '🔥',
    '👏',
    '🎉',
    '💯',
    '👀',
    '🙌',
    '✨',
  ]),
  define('travel', 'Travel', 'Journeys, places, and holidays', [
    '✈️',
    '🗺️',
    '🏖️',
    '🌊',
    '🗽',
    '🏔️',
    '🚗',
    '🚂',
    '🚀',
    '⛺',
    '🧳',
    '🌍',
  ]),
];

export function getDefaultCollection(id: string): EmojiCollection | undefined {
  return DEFAULT_COLLECTIONS.find((collection) => collection.id === id);
}
