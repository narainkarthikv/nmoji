// DOM elements
const emojiContainer = document.getElementById('emoji-list');
const favoritesContainer = document.getElementById('favorites-list');

// Load emoji JSON
fetch(chrome.runtime.getURL('NmojiList.json'))
  .then((response) => response.json())
  .then((data) => {
    const allEmojis = data.map((item) => item.emoji);

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    allEmojis.forEach((emoji) => {
      const span = document.createElement('span');
      span.textContent = emoji;
      span.classList.add('emoji-item');

      // Copy to clipboard on click with visual feedback
      span.addEventListener('click', () => {
        navigator.clipboard
          .writeText(emoji)
          .then(() => showCopyFeedback(span))
          .catch((err) => console.error('Clipboard error:', err));
      });

      // Right-click to toggle favorite without full reload
      span.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFavorite(emoji);

        const favs = JSON.parse(localStorage.getItem('favorites')) || [];
        const target = favs.includes(emoji)
          ? favoritesContainer
          : emojiContainer;

        if (span.parentElement) span.parentElement.removeChild(span);
        target.appendChild(span);
      });

      // Append to appropriate container
      if (favorites.includes(emoji)) {
        favoritesContainer.appendChild(span);
      } else {
        emojiContainer.appendChild(span);
      }
    });
  });

// Update localStorage for favorites
function toggleFavorite(emoji) {
  let favs = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favs.includes(emoji)) {
    favs = favs.filter((e) => e !== emoji);
  } else {
    favs.push(emoji);
  }

  localStorage.setItem('favorites', JSON.stringify(favs));
}

// Simple visual feedback for clipboard copy
function showCopyFeedback(el) {
  el.classList.add('copied');
  setTimeout(() => el.classList.remove('copied'), 1400);
}
