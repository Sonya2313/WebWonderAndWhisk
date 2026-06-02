import {
  isFavorite,
  toggleFavorites,
  addToCart,
  getCartCount,
} from './utils/localStorage.js';
import { masterClasses } from './utils/masterClasses.js';

const classesList = document.getElementById('classes-list');
const dialog = document.getElementById('masterclass-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogTitle = document.getElementById('dialog-title');
const dialogDuration = document.getElementById('dialog-duration');
const dialogDescription = document.getElementById('dialog-description');

const filterSelect = document.getElementById('class-filter');
let currentFilter = 'all';
const sortingSelect = document.getElementById('sorting');
let currentSort = '';
const searchInput = document.getElementById('search');
let currentSearch = '';

const dialogTabs = document.querySelectorAll('.dialog-tab');
const descriptionPanel = document.getElementById('description-panel');
const reviewsPanel = document.getElementById('reviews-panel');
const dialogReviews = document.getElementById('dialog-reviews');

// табы в диалоге
dialogTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    dialogTabs.forEach((button) => button.classList.remove('is-active'));
    tab.classList.add('is-active');
    const selectedTab = tab.dataset.tab;

    if (selectedTab === 'description') {
      descriptionPanel.classList.remove('hidden');
      reviewsPanel.classList.add('hidden');
    }

    if (selectedTab === 'reviews') {
      reviewsPanel.classList.remove('hidden');
      descriptionPanel.classList.add('hidden');
    }
  });
});

// фильтр
filterSelect.addEventListener('change', () => {
  currentFilter = filterSelect.value;
  renderCards();
});

// сортировка
sortingSelect.addEventListener('change', () => {
  currentSort = sortingSelect.value;
  renderCards();
});

// поиск
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.toLowerCase().trim();
  renderCards();
});

function getPriceValue(price) {
  return Number(price.replace(/\s/g, '').replace('$', ''));
}

// открытие диалога по клику по названию
document.addEventListener('click', (event) => {
  const button = event.target.closest('.card-title-button');
  if (!button) return;

  OpenMasterClassDialog(button.dataset.id);
});

// клик по сердцу (избранное)
document.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('.card-favorite');
  if (!favoriteButton) return;

  const card = favoriteButton.closest('.card');
  if (!card) return;

  const id = card.dataset.id;
  const icon = favoriteButton.querySelector('.fa');
  if (!icon) return;

  toggleFavorites(id);

  if (isFavorite(id)) {
    icon.classList.remove('fa-heart-o');
    icon.classList.add('fa-heart');
  } else {
    icon.classList.remove('fa-heart');
    icon.classList.add('fa-heart-o');
  }
});

//корзина

const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message, type = 'success') {
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 2200);
}

function updateCartCounter() {
  const cartCounter = document.getElementById('cart-counter');
  if (!cartCounter) return;

  cartCounter.textContent = getCartCount();
}
document.addEventListener('click', (event) => {
  const cartButton = event.target.closest('.card-in-basket');
  if (!cartButton) return;

  const card = cartButton.closest('.card');
  if (!card) return;

  const id = card.dataset.id;
  if (!id) return;

  const masterClass = masterClasses.find((item) => item.id === id);

  const isAdded = addToCart(id);

  if (isAdded) {
    updateCartCounter();
    showToast(`${masterClass.title} added to cart`, 'success');
  } else {
    showToast(`${masterClass.title} is already in cart`, 'info');
  }
});

//карточки мастер-классов

function renderCards() {
  let filteredCards =
    currentFilter === 'all'
      ? masterClasses
      : masterClasses.filter((item) => item.category === currentFilter);

  if (currentSearch !== '') {
    filteredCards = filteredCards.filter((item) => {
      return (
        item.title.toLowerCase().includes(currentSearch) ||
        item.category.toLowerCase().includes(currentSearch)
      );
    });
  }

  if (filteredCards.length === 0) {
    classesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">🔍</div>
        <h3 class="empty-state-title">No master-classes found</h3>
        <p class="empty-state-text">
          Try another search word or choose a different category.
        </p>
      </div>
    `;
    return;
  }

  if (currentSort === 'price-asc') {
    filteredCards.sort(
      (a, b) => getPriceValue(a.price) - getPriceValue(b.price),
    );
  }

  if (currentSort === 'price-desc') {
    filteredCards.sort(
      (a, b) => getPriceValue(b.price) - getPriceValue(a.price),
    );
  }

  if (currentSort === 'popularity') {
    filteredCards.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  classesList.innerHTML = filteredCards
    .map((item) => {
      return `
        <article class="card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.alt}" class="card-image" />

          <div class="card-content">
            <div class="card-title-wrap">
              <button class="card-title-button" data-id="${item.id}" type="button">
                ${item.title}
              </button>
            </div>

            <div class="card-footer">
              <button class="card-favorite" type="button">
                <i class="fa ${isFavorite(item.id) ? 'fa-heart' : 'fa-heart-o'}" aria-hidden="true"></i>
              </button>

              <p class="card-price">${item.price}</p>
              <button class="card-in-basket" type="button">🛒</button>
            </div>

            <p class="card-reviews">${item.reviews} ☆</p>
          </div>
        </article>
      `;
    })
    .join('');
}

function OpenMasterClassDialog(id) {
  const masterClass = masterClasses.find((item) => item.id === id);
  if (!masterClass) return;

  dialogImage.src = masterClass.imageDetails;
  dialogTitle.textContent = masterClass.title;
  dialogDuration.textContent = masterClass.duration;
  dialogDescription.textContent = masterClass.description;

  dialogReviews.innerHTML = masterClass.reviewsList
    .map((review) => `<p class="review-item">“${review}”</p>`)
    .join('');

  descriptionPanel.classList.remove('hidden');
  reviewsPanel.classList.add('hidden');

  dialogTabs.forEach((button) => button.classList.remove('is-active'));
  document
    .querySelector('.dialog-tab[data-tab="description"]')
    .classList.add('is-active');

  dialog.showModal();
}

// стартовый рендер
renderCards();
updateCartCounter();
