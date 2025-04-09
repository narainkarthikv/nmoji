// DOM elements
const emojiContainer = document.getElementById('emoji-list');
const favoritesContainer = document.getElementById('favorites-list');

// Load emoji JSON
fetch(chrome.runtime.getURL('NmojiList.json'))
  .then(response => response.json())
  .then(data => {
    const allEmojis = data.map(item => item.emoji);

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    allEmojis.forEach(emoji => {
      const span = document.createElement('span');
      span.textContent = emoji;
      span.classList.add('emoji-item');

      // Copy to clipboard on click
      span.addEventListener('click', () => {
        navigator.clipboard.writeText(emoji)
          .then(() => console.log(`${emoji} copied to clipboard!`))
          .catch(err => console.error('Clipboard error:', err));
      });

      // Right-click to toggle favorite
      span.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFavorite(emoji);
        location.reload(); // Reload to update favorites view
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
    favs = favs.filter(e => e !== emoji);
  } else {
    favs.push(emoji);
  }

  localStorage.setItem('favorites', JSON.stringify(favs));
}
