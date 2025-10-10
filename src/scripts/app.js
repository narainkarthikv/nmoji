document.addEventListener('DOMContentLoaded', () => {
  const filterInput = document.getElementById('filterInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const tagFilter = document.getElementById('tagFilter');
  const aliasFilter = document.getElementById('aliasFilter');
  const emojiContainer = document.getElementById('emojiContainer');
  const emojiDescription = document.getElementById('emojiDescription');

  // Optimized data structures
  let emojiData = [];
  let emojiIndexes = {
    byCategory: {},
    byTag: {},
    byAlias: {},
    byDescription: new Map(),
  };

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      themeIcon.textContent = '🌜';
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.textContent = '🌞';
      localStorage.setItem('theme', 'light');
    }
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '🌜';
  } else {
    themeIcon.textContent = '🌞';
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Creates indexed data structures for faster emoji lookup
   */
  function indexEmojiData(data) {
    emojiData = data;

    // Clear existing indexes
    emojiIndexes.byCategory = {};
    emojiIndexes.byTag = {};
    emojiIndexes.byAlias = {};
    emojiIndexes.byDescription = new Map();

    // Build indexes
    data.forEach((emoji, index) => {
      // Index by category
      if (!emojiIndexes.byCategory[emoji.category]) {
        emojiIndexes.byCategory[emoji.category] = new Set();
      }
      emojiIndexes.byCategory[emoji.category].add(index);

      // Index by tags
      if (emoji.tags) {
        emoji.tags.forEach((tag) => {
          if (!emojiIndexes.byTag[tag]) {
            emojiIndexes.byTag[tag] = new Set();
          }
          emojiIndexes.byTag[tag].add(index);
        });
      }

      // Index by aliases
      if (emoji.aliases) {
        emoji.aliases.forEach((alias) => {
          if (!emojiIndexes.byAlias[alias]) {
            emojiIndexes.byAlias[alias] = new Set();
          }
          emojiIndexes.byAlias[alias].add(index);
        });
      }

      // Index by description words for faster search
      const words = emoji.description.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        if (!emojiIndexes.byDescription.has(word)) {
          emojiIndexes.byDescription.set(word, new Set());
        }
        emojiIndexes.byDescription.get(word).add(index);
      });
    });
  }

  /**
   * Fetches and caches emoji data for faster access.
   */
  async function fetchEmojiData() {
    try {
      const cachedData = localStorage.getItem('emojiData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        indexEmojiData(parsedData);
        displayEmojis(emojiData);
        populateFilterOptions();
      } else {
        const response = await fetch('./extension/NmojiList.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const NmojiList = await response.json();
        indexEmojiData(NmojiList);
        localStorage.setItem('emojiData', JSON.stringify(NmojiList));
        displayEmojis(emojiData);
        populateFilterOptions();
      }
    } catch (error) {
      console.error('Error fetching the JSON data:', error);
    }
  }

  /**
   * Lazy loading implementation with IntersectionObserver.
   */
  function lazyLoadEmojis() {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const emojiElement = entry.target;
            emojiElement.classList.add('visible'); // Animation class
            observer.unobserve(emojiElement); // Stop observing once it's visible
          }
        });
      },
      { threshold: 0.1 },
    );

    const emojiElements = document.querySelectorAll('.emoji');
    emojiElements.forEach((emoji) => observer.observe(emoji));
  }

  /**
   * Populates the tag and alias dropdown filters with unique values.
   */
  function populateFilterOptions() {
    const uniqueTags = new Set();
    const uniqueAliases = new Set();

    emojiData.forEach((emoji) => {
      if (emoji.tags) {
        emoji.tags.forEach((tag) => uniqueTags.add(tag));
      }
      if (emoji.aliases) {
        emoji.aliases.forEach((alias) => uniqueAliases.add(alias));
      }
    });

    uniqueTags.forEach((tag) => {
      const option = document.createElement('option');
      option.value = tag.toLowerCase();
      option.textContent = tag;
      tagFilter.appendChild(option);
    });

    uniqueAliases.forEach((alias) => {
      const option = document.createElement('option');
      option.value = alias.toLowerCase();
      option.textContent = alias;
      aliasFilter.appendChild(option);
    });
  }

  // Constants for grid layout
  const GRID_ROWS = 5;
  const GRID_COLS = 8;
  const GRID_SIZE = GRID_ROWS * GRID_COLS;
  const PAGES_TO_PRELOAD = 2;

  /**
   * Display emojis in a grid layout with pagination
   */
  function displayEmojis(emojis) {
    const container = emojiContainer;
    container.innerHTML = '';

    // Take only the first 40 emojis (8x5 grid)
    const displayEmojis = emojis.slice(0, GRID_SIZE);

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'contents';
    container.appendChild(gridContainer);

    // Function to create emoji element
    function createEmojiElement(emoji, index) {
      const emojiElement = document.createElement('div');
      emojiElement.classList.add('emoji');
      emojiElement.dataset.index = index;
      emojiElement.textContent = emoji.emoji;
      emojiElement.title = `${emoji.description} - Category: ${emoji.category}`;

      // Add animation delay based on position
      const row = Math.floor(index / GRID_COLS);
      const col = index % GRID_COLS;
      emojiElement.style.animationDelay = `${(row + col) * 50}ms`;
      emojiElement.style.opacity = '0';
      emojiElement.style.animation = 'fadeIn 0.3s ease-in-out forwards';

      emojiElement.addEventListener('click', () => {
        copyToClipboard(emoji.emoji, emojiElement);
        updateDescription(emoji);
      });

      return emojiElement;
    }

    // Render emojis in grid
    displayEmojis.forEach((emoji, index) => {
      const emojiElement = createEmojiElement(emoji, index);
      gridContainer.appendChild(emojiElement);
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * Apply filters with optimized search using indexes
   */
  function applyFilters() {
    const filterValue = filterInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedTag = tagFilter.value.toLowerCase();
    const selectedAlias = aliasFilter.value.toLowerCase();

    // Use Set for efficient intersection operations
    let matchingIndices = new Set();

    // If no filters are active, show all emojis
    if (!filterValue && !selectedCategory && !selectedTag && !selectedAlias) {
      matchingIndices = new Set(Array.from({ length: emojiData.length }, (_, i) => i));
    } else {
      // Start with category filter as it's usually the most restrictive
      if (selectedCategory) {
        matchingIndices = new Set(emojiIndexes.byCategory[selectedCategory] || []);
      }

      // Apply tag filter
      if (selectedTag) {
        const tagMatches = emojiIndexes.byTag[selectedTag] || new Set();
        if (matchingIndices.size === 0) {
          matchingIndices = tagMatches;
        } else {
          matchingIndices = new Set([...matchingIndices].filter((x) => tagMatches.has(x)));
        }
      }

      // Apply alias filter
      if (selectedAlias) {
        const aliasMatches = emojiIndexes.byAlias[selectedAlias] || new Set();
        if (matchingIndices.size === 0) {
          matchingIndices = aliasMatches;
        } else {
          matchingIndices = new Set([...matchingIndices].filter((x) => aliasMatches.has(x)));
        }
      }

      // Apply text search filter
      if (filterValue) {
        const searchWords = filterValue.split(/\s+/);
        let searchMatches = new Set();

        searchWords.forEach((word) => {
          // Check description index
          if (emojiIndexes.byDescription.has(word)) {
            searchMatches = new Set([...searchMatches, ...emojiIndexes.byDescription.get(word)]);
          }
        });

        if (matchingIndices.size === 0) {
          matchingIndices = searchMatches;
        } else {
          matchingIndices = new Set([...matchingIndices].filter((x) => searchMatches.has(x)));
        }
      }
    }

    // Convert matching indices to emoji objects
    const filteredEmojis = Array.from(matchingIndices).map((index) => emojiData[index]);
    displayEmojis(filteredEmojis);
  }

  /**
   * Copies emoji to clipboard
   */
  function copyToClipboard(text, element) {
    element.classList.add('clicked');

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
        setTimeout(() => element.classList.remove('clicked'), 750);
      })
      .catch((err) => console.error('Failed to copy text:', err));
  }

  /**
   * Updates description
   */
  function updateDescription(emoji) {
    emojiDescription.innerHTML = `<div class="selected-emoji">${emoji.emoji}</div>
            <div class="emoji-title">${emoji.description}</div>
            <div class="emoji-category">Category: ${emoji.category}</div>
            <div class="emoji-tags">Tags: #${emoji.tags ? emoji.tags.join(', #') : 'None'}</div>`;

    updateRelatedEmojis(emoji);
  }

  /**
   * Add relevant emoji using indexed data for faster lookup
   */
  function updateRelatedEmojis(selectedEmoji) {
    const relatedContainer = document.getElementById('relatedEmojiContainer');
    relatedContainer.innerHTML = '';

    // Use Set for efficient unique emoji collection
    const relatedIndices = new Set();

    // Find related emojis by tags using pre-built indexes
    if (selectedEmoji.tags) {
      selectedEmoji.tags.forEach((tag) => {
        const taggedEmojis = emojiIndexes.byTag[tag] || new Set();
        taggedEmojis.forEach((index) => {
          if (emojiData[index].emoji !== selectedEmoji.emoji) {
            relatedIndices.add(index);
          }
        });
      });
    }

    // Also find emojis in the same category
    const categoryEmojis = emojiIndexes.byCategory[selectedEmoji.category] || new Set();
    categoryEmojis.forEach((index) => {
      if (emojiData[index].emoji !== selectedEmoji.emoji) {
        relatedIndices.add(index);
      }
    });

    // Get emoji objects from indices and sort by relevance
    const related = Array.from(relatedIndices)
      .map((index) => ({
        emoji: emojiData[index],
        relevance: calculateRelevance(emojiData[index], selectedEmoji),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 12) // Show 12 suggestions (3 rows of 4)
      .map((item) => item.emoji);

    // Create grid container for related emojis
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'contents';
    relatedContainer.appendChild(gridContainer);

    // Render related emojis with staggered animation
    related.forEach((emoji, index) => {
      const emojiElement = document.createElement('div');
      emojiElement.classList.add('emoji');
      emojiElement.textContent = emoji.emoji;
      emojiElement.title = emoji.description;

      // Calculate row and column for staggered animation
      const row = Math.floor(index / 4);
      const col = index % 4;
      emojiElement.style.animationDelay = `${(row + col) * 0.05}s`;

      emojiElement.addEventListener('click', () => {
        copyToClipboard(emoji.emoji, emojiElement);
        updateDescription(emoji);
      });

      gridContainer.appendChild(emojiElement);
    });
  }

  /**
   * Calculate relevance score between two emojis
   */
  function calculateRelevance(emoji1, emoji2) {
    let score = 0;

    // Tag matching
    const commonTags = emoji1.tags?.filter((tag) => emoji2.tags?.includes(tag))?.length || 0;
    score += commonTags * 2;

    // Category matching
    if (emoji1.category === emoji2.category) {
      score += 1;
    }

    // Description word matching
    const words1 = new Set(emoji1.description.toLowerCase().split(/\s+/));
    const words2 = new Set(emoji2.description.toLowerCase().split(/\s+/));
    words1.forEach((word) => {
      if (words2.has(word)) score += 0.5;
    });

    return score;
  }

  fetchEmojiData();

  filterInput.addEventListener('input', debounce(applyFilters, 300));
  categoryFilter.addEventListener('change', applyFilters);
  tagFilter.addEventListener('change', applyFilters);
  aliasFilter.addEventListener('change', applyFilters);
});
