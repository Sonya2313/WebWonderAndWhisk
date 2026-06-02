import { getFavorites, toggleFavorites } from './utils/localStorage.js';
import { masterClasses } from './utils/masterClasses.js';

const favoritesList = document.getElementById('favorites-list');

function renderFavorites() {
  const favorites = getFavorites();

  const favoriteClasses = masterClasses.filter((item) =>
    favorites.includes(item.id),
  );

  if (favoriteClasses.length === 0) {
    favoritesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fa fa-heart-o" aria-hidden="true"></i>
        </div>
        <h2 class="empty-state-title">No favorites yet</h2>
        <p class="empty-state-text">
          Save the master classes you like to see them here.
        </p>
      </div>
    `;
    return;
  }

  favoritesList.innerHTML = favoriteClasses
    .map((item) => {
      return `
        <article class="favorite-card" data-id="${item.id}">
          <div class="favorite-card-info">
            <h2 class="favorite-card-title">${item.title}</h2>
            <p class="favorite-card-price">${item.price}</p>
          </div>

          <button
            class="favorite-card-remove"
            type="button"
            aria-label="Remove from favorites"
          >
            <i class="fa fa-heart" aria-hidden="true"></i>
          </button>
        </article>
      `;
    })
    .join('');
}

favoritesList.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.favorite-card-remove');
  if (!removeButton) return;

  const card = removeButton.closest('.favorite-card');
  if (!card) return;

  const { id } = card.dataset;
  if (!id) return;

  toggleFavorites(id);
  renderFavorites();
});

renderFavorites();
