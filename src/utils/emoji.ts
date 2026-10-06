/**
 * Emoji filtering and search utilities
 * Reusable logic extracted from components
 */

import type { Emoji } from '../types/emoji';

/** Treat the downloaded JSON as untrusted input and keep only renderable fields. */
export function sanitizeEmojiData(value: unknown): Emoji[] {
  if (!Array.isArray(value))
    throw new Error('The emoji data response is not a list.');
  const seen = new Set<string>();
  const result: Emoji[] = [];
  const cleanText = (input: unknown) =>
    typeof input === 'string'
      ? input
          // eslint-disable-next-line no-control-regex
          .replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '')
          .trim()
      : '';
  for (const item of value.slice(0, 5000)) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const emoji = cleanText(record.emoji);
    const description = cleanText(record.description);
    const category = cleanText(record.category);
    // A modest bound prevents pathological payloads from consuming excess memory/DOM time.
    if (
      !emoji ||
      emoji.length > 32 ||
      !description ||
      description.length > 200 ||
      !category ||
      category.length > 80 ||
      seen.has(emoji)
    )
      continue;
    const strings = (input: unknown) =>
      Array.isArray(input)
        ? input
            .filter(
              (entry): entry is string =>
                typeof entry === 'string' && cleanText(entry).length <= 80
            )
            .slice(0, 40)
            .map(cleanText)
        : undefined;
    seen.add(emoji);
    result.push({
      emoji,
      description,
      category,
      tags: strings(record.tags),
      aliases: strings(record.aliases),
    });
  }
  if (!result.length)
    throw new Error('The emoji data response contains no valid emoji entries.');
  return result;
}

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
    const descriptionMatch = emoji.description
      .toLowerCase()
      .includes(searchValue);
    const categoryMatch = emoji.category.toLowerCase().includes(searchValue);
    const tagMatch = emoji.tags?.some((tag) =>
      tag.toLowerCase().includes(searchValue)
    );
    const aliasMatch = emoji.aliases?.some((alias) =>
      alias.toLowerCase().includes(searchValue)
    );

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
  alias?: string
): Emoji[] {
  let filtered = [...emojis];

  if (category) {
    filtered = filtered.filter(
      (emoji) => emoji.category.toLowerCase() === category.toLowerCase()
    );
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
export function findRelatedEmojis(
  emoji: Emoji,
  allEmojis: Emoji[],
  limit = 12
): Emoji[] {
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

  return Array.from(new Set([...relatedByTag, ...relatedByCategory])).slice(
    0,
    limit
  );
}
