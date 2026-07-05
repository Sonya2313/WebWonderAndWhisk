import {
  getFavorites,
  toggleFavorites,
  getCartCount,
} from './utils/localStorage.js';
import { masterClasses } from './utils/masterClasses.js';
import {
  applyTranslations,
  getSavedLanguage,
  getUiMessages,
} from './language.js';

const favoritesList = document.getElementById('favorites-list');

function updateCartCounter() {
  const cartCounter = document.getElementById('cart-counter');
  if (!cartCounter) return;

  cartCounter.textContent = getCartCount();
}

function renderFavorites() {
  const lang = getSavedLanguage();
  const messages = getUiMessages(lang).favorites;
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
        <h2 class="empty-state-title">${messages.emptyTitle}</h2>
        <p class="empty-state-text">
          ${messages.emptyText}
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
            <h2 class="favorite-card-title">${item.title[lang]}</h2>
            <p class="favorite-card-price">${item.price}</p>
          </div>

          <button
            class="favorite-card-remove"
            type="button"
            aria-label="${messages.removeFromFavorites}"
          >
            <i class="fa fa-heart" aria-hidden="true"></i>
          </button>
        </article>
      `;
    })
    .join('');
}

if (favoritesList) {
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
}

document.addEventListener('languageChanged', () => {
  applyTranslations(getSavedLanguage());
  renderFavorites();
});

applyTranslations(getSavedLanguage());
renderFavorites();
updateCartCounter();
