import React, { useMemo } from 'react';
import styled from 'styled-components';

const Description = styled.div`
  width: 320px;
  padding: 20px;
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  background-color: var(--card-background);
  box-shadow: 0 4px 12px rgba(32, 178, 170, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 100px;

  @media (max-width: 1024px) {
    width: 100%;
    position: static;
  }

  body.dark-mode & {
    box-shadow: 0 4px 12px rgba(32, 178, 170, 0.2);
  }
`;

const SelectedEmoji = styled.div`
  width: 50px;
  height: 50px;
  padding: 5px;
  margin: 10px 0;
  font-size: 1.7em;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
`;

const DefaultMessage = styled.p`
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 1.1rem;
  margin: 20px 0;
`;

const Title = styled.h3`
  text-transform: capitalize;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  align-items: baseline;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.8;
`;

const InfoValue = styled.span`
  color: var(--text-color);
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
`;

const RelatedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 15px;
  margin-top: 15px;
  border: 3px outset lightseagreen;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  max-height: 200px;
  overflow-y: auto;
  align-items: start;
  justify-items: center;
`;

const RelatedEmoji = styled.div`
  width: 45px;
  height: 45px;
  font-size: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: relatedFadeIn 0.3s ease-in-out forwards;
  cursor: pointer;

  @keyframes relatedFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
    <Description>
      {defaultMessage || !emoji ? (
        <DefaultMessage>
          {defaultMessage || "Loading emojis..."}
        </DefaultMessage>
      ) : (
        <>
          <SelectedEmoji>{emoji.emoji}</SelectedEmoji>
          <Title>{emoji.description}</Title>
          <InfoSection>
            <InfoLabel>Category:</InfoLabel>
            <InfoValue>{emoji.category}</InfoValue>
            {emoji.tags && (
              <>
                <InfoLabel>Tags:</InfoLabel>
                <InfoValue>{emoji.tags.join(', ')}</InfoValue>
              </>
            )}
            {emoji.aliases && (
              <>
                <InfoLabel>Aliases:</InfoLabel>
                <InfoValue>{emoji.aliases.join(', ')}</InfoValue>
              </>
            )}
          </InfoSection>
        </>
      )}
      
      <SectionTitle>Related Emojis</SectionTitle>
      <RelatedContainer>
        {relatedEmojis.map((related, index) => (
          <RelatedEmoji
            key={related.emoji}
            onClick={() => onEmojiSelect(related)}
            style={{ animationDelay: `${(Math.floor(index / 4) + index % 4) * 0.05}s` }}
            title={related.description}
          >
            {related.emoji}
          </RelatedEmoji>
        ))}
      </RelatedContainer>

      <SectionTitle>Popular Emojis</SectionTitle>
      <RelatedContainer>
        {popularEmojis.map((popular, index) => (
          <RelatedEmoji
            key={popular.emoji}
            onClick={() => onEmojiSelect(popular)}
            style={{ animationDelay: `${(Math.floor(index / 4) + index % 4) * 0.05}s` }}
            title={popular.description}
          >
            {popular.emoji}
          </RelatedEmoji>
        ))}
      </RelatedContainer>
    </Description>
  );
}
