import React, { useMemo } from 'react';
import '../styles/EmojiDescription.css';

interface Emoji {
  emoji: string;
  description: string;
  category: string;
  tags?: string[];
  aliases?: string[];
}

interface Props {
  emoji?: Emoji | null;
  allEmojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  defaultMessage?: string;
}

export function EmojiDescription({ emoji, allEmojis, onEmojiSelect, defaultMessage }: Props) {
  const relatedEmojis = useMemo(() => {
    if (!emoji) return [];
    
    const relatedByTag = new Set<Emoji>();
    const relatedByCategory = new Set<Emoji>();

    if (emoji.tags) {
      emoji.tags.forEach(tag => {
        allEmojis.forEach(e => {
          if (e.emoji !== emoji.emoji && e.tags?.includes(tag)) {
            relatedByTag.add(e);
          }
        });
      });
    }

    allEmojis.forEach(e => {
      if (e.emoji !== emoji.emoji && e.category === emoji.category) {
        relatedByCategory.add(e);
      }
    });

    const related = Array.from(new Set([...relatedByTag, ...relatedByCategory]))
      .slice(0, 12);

    return related;
  }, [emoji, allEmojis]);

  const popularEmojis = useMemo(() => {
    if (!allEmojis?.length) return [];
    return allEmojis
      .filter(e => e.emoji !== emoji?.emoji)
      .slice(0, 8);
  }, [allEmojis, emoji]);

  return (
    <div className="emoji-description">
      {defaultMessage || !emoji ? (
        <p className="default-message">
          {defaultMessage || "Loading emojis..."}
        </p>
      ) : (
        <>
          <div className="selected-emoji">{emoji.emoji}</div>
          <h3 className="emoji-title">{emoji.description}</h3>
          <div className="info-section">
            <span className="info-label">Category:</span>
            <span className="info-value">{emoji.category}</span>
            {emoji.tags && (
              <>
                <span className="info-label">Tags:</span>
                <span className="info-value">{emoji.tags.join(', ')}</span>
              </>
            )}
            {emoji.aliases && (
              <>
                <span className="info-label">Aliases:</span>
                <span className="info-value">{emoji.aliases.join(', ')}</span>
              </>
            )}
          </div>
        </>
      )}
      
      <h4 className="section-title">Related Emojis</h4>
      <div className="related-container">
        {relatedEmojis.map((related, index) => (
          <div
            key={related.emoji}
            className="related-emoji"
            onClick={() => onEmojiSelect(related)}
            style={{ animationDelay: `${(Math.floor(index / 4) + index % 4) * 0.05}s` }}
            title={related.description}
          >
            {related.emoji}
          </div>
        ))}
      </div>

      <h4 className="section-title">Popular Emojis</h4>
      <div className="related-container">
        {popularEmojis.map((popular, index) => (
          <div
            key={popular.emoji}
            className="related-emoji"
            onClick={() => onEmojiSelect(popular)}
            style={{ animationDelay: `${(Math.floor(index / 4) + index % 4) * 0.05}s` }}
            title={popular.description}
          >
            {popular.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
