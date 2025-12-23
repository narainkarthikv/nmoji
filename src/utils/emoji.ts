/**
 * Emoji filtering and search utilities
 * Reusable logic extracted from components
 */

import type { Emoji } from '../types/emoji';

/**
 * Search emojis across description, category, tags, and aliases
 * @param emojis - Array of emojis to search
 * @param query - Search query string
 * @returns Filtered array of emojis matching the query
 */
export function searchEmojis(emojis: Emoji[], query: string): Emoji[] {
  if (!query) return emojis;

  const searchValue = query.toLowerCase();
  return emojis.filter((emoji) => {
    const descriptionMatch = emoji.description.toLowerCase().includes(searchValue);
    const categoryMatch = emoji.category.toLowerCase().includes(searchValue);
    const tagMatch = emoji.tags?.some((tag) => tag.toLowerCase().includes(searchValue));
    const aliasMatch = emoji.aliases?.some((alias) => alias.toLowerCase().includes(searchValue));

    return descriptionMatch || categoryMatch || tagMatch || aliasMatch;
  });
}

/**
 * Filter emojis by category, tag, or alias
 * @param emojis - Array of emojis to filter
 * @param category - Category filter (optional)
 * @param tag - Tag filter (optional)
 * @param alias - Alias filter (optional)
 * @returns Filtered array of emojis
 */
export function filterEmojis(
  emojis: Emoji[],
  category?: string,
  tag?: string,
  alias?: string,
): Emoji[] {
  let filtered = [...emojis];

  if (category) {
    filtered = filtered.filter((emoji) => emoji.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    filtered = filtered.filter((emoji) => emoji.tags?.includes(tag));
  }

  if (alias) {
    filtered = filtered.filter((emoji) => emoji.aliases?.includes(alias));
  }

  return filtered;
}

/**
 * Extract unique categories from emoji list
 */
export function extractCategories(emojis: Emoji[]): string[] {
  return Array.from(new Set(emojis.map((emoji) => emoji.category)));
}

/**
 * Extract unique tags from emoji list
 */
export function extractTags(emojis: Emoji[]): string[] {
  return Array.from(new Set(emojis.flatMap((emoji) => emoji.tags || [])));
}

/**
 * Extract unique aliases from emoji list
 */
export function extractAliases(emojis: Emoji[]): string[] {
  return Array.from(new Set(emojis.flatMap((emoji) => emoji.aliases || [])));
}

/**
 * Find related emojis by tags and category
 */
export function findRelatedEmojis(emoji: Emoji, allEmojis: Emoji[], limit = 12): Emoji[] {
  const relatedByTag = new Set<Emoji>();
  const relatedByCategory = new Set<Emoji>();

  if (emoji.tags) {
    emoji.tags.forEach((tag) => {
      allEmojis.forEach((e) => {
        if (e.emoji !== emoji.emoji && e.tags?.includes(tag)) {
          relatedByTag.add(e);
        }
      });
    });
  }

  allEmojis.forEach((e) => {
    if (e.emoji !== emoji.emoji && e.category === emoji.category) {
      relatedByCategory.add(e);
    }
  });

  return Array.from(new Set([...relatedByTag, ...relatedByCategory])).slice(0, limit);
}
