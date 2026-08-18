import React, { useState, useCallback } from 'react';
import { POPULAR_COMBOS } from '../constants/combos';
import type { EmojiCombo } from '../types/combo';

interface Props {
  showZwjSequences?: boolean;
}

export function CombosPanel({ showZwjSequences = true }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const zwjSequences = POPULAR_COMBOS.filter((c) => c.type === 'zwj');

  const handleCopyCombo = useCallback((combo: EmojiCombo) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(combo.display).catch((err) => {
        console.error('Clipboard error:', err);
      });

      // Show feedback
      setCopiedId(combo.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const ComboItem = ({ combo }: { combo: EmojiCombo }) => (
    <div
      className='flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border-secondary)] group'
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopyCombo(combo);
        }
      }}
      title={`${combo.description}: ${combo.components.join(' + ')}`}>
      <div className='flex items-center gap-3 min-w-0'>
        <span className='text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200'>
          {combo.display}
        </span>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-[var(--color-text-primary)]'>
            {combo.description}
          </p>
          <div className='text-xs text-[var(--color-text-muted)] flex flex-wrap gap-1 items-center'>
            {combo.components.map((component, idx) => (
              <React.Fragment key={component}>
                <span title={`Component: ${component}`}>{component}</span>
                {idx < combo.components.length - 1 && (
                  <span className='text-[var(--color-text-muted)]'>+</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleCopyCombo(combo)}
        className={`ml-3 px-3 py-1.5 rounded-md text-sm font-medium flex-shrink-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] ${
          copiedId === combo.id
            ? 'bg-[var(--color-success-bg)] text-[var(--color-success-text)] cursor-default'
            : 'bg-[var(--color-action-default)] text-white hover:bg-[color-mix(in_srgb,var(--color-action-default)_85%,black)] cursor-pointer'
        }`}
        aria-label={`Copy ${combo.description}`}>
        {copiedId === combo.id ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );

  return (
    <div
      className={`grid w-full min-h-0 grid-cols-1 gap-6 ${showZwjSequences ? 'lg:h-full lg:grid-cols-[minmax(0,1fr),360px]' : ''}`}>
      {/* ZWJ sequences deliberately stay separate from ordinary suggestions. */}
      {showZwjSequences && (
        <section className='min-w-0 lg:flex lg:min-h-0 lg:flex-col'>
          <h3 className='mb-3 flex shrink-0 items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]'>
            <span>🔗 ZWJ Sequences</span>
            <span className='text-xs font-normal text-[var(--color-text-muted)]'>
              (Zero-Width Joiner)
            </span>
          </h3>
          <div className='space-y-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2'>
            {zwjSequences.map((combo) => (
              <ComboItem key={combo.id} combo={combo} />
            ))}
          </div>
        </section>
      )}

      {/* Informational guide keeps the right column useful without mixing in suggestions. */}
      <section className='min-w-0 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] p-5 lg:min-h-0 lg:overflow-y-auto'>
        <h3 className='mb-4 text-lg font-semibold text-[var(--color-text-primary)]'>
          ℹ️ About ZWJ Sequences
        </h3>
        <div className='space-y-4 text-sm text-[var(--color-text-secondary)]'>
          <p>
            A Zero-Width Joiner (ZWJ) combines multiple emojis into one
            character when the platform supports that sequence.
          </p>

          <div className='rounded-lg bg-[var(--color-bg-secondary)] p-4'>
            <p className='font-medium text-[var(--color-text-primary)]'>
              Example
            </p>
            <p className='mt-2 text-2xl'>👨 + 👩 + 👧 + 👦 = 👨‍👩‍👧‍👦</p>
            <p className='mt-2 text-xs'>
              The invisible joiner between each emoji tells the system to render
              them as one family emoji.
            </p>
          </div>

          <div>
            <p className='font-medium text-[var(--color-text-primary)]'>
              How to use one
            </p>
            <ol className='mt-2 list-decimal space-y-1 pl-5'>
              <li>Choose a sequence from the list.</li>
              <li>Click Copy.</li>
              <li>Paste it into your message or document.</li>
            </ol>
          </div>

          <p className='rounded-lg border border-[color-mix(in_srgb,var(--color-action-default)_30%,transparent_70%)] bg-[color-mix(in_srgb,var(--color-action-default)_10%,transparent_90%)] p-3 text-xs'>
            Rendering depends on the app, operating system, and font. If a
            sequence is unsupported, its individual emojis may appear instead.
          </p>
        </div>
      </section>

      <div
        className={`mt-0 rounded-lg border border-[color-mix(in_srgb,var(--color-action-default)_30%,transparent_70%)] bg-[color-mix(in_srgb,var(--color-action-default)_10%,transparent_90%)] p-4 ${showZwjSequences ? 'xl:col-span-2' : ''}`}>
        <p className='text-sm text-[var(--color-text-secondary)]'>
          💡 <strong>Tip:</strong> ZWJ sequences combine emojis into one
          character on supported platforms. Click Copy to use one.
        </p>
      </div>
    </div>
  );
}
