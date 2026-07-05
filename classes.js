import {
  isFavorite,
  toggleFavorites,
  addToCart,
  getCartCount,
} from './utils/localStorage.js';
import { masterClasses } from './utils/masterClasses.js';
import { applyTranslations } from './language.js';

const toastMessages = {
  en: {
    addedToCart: (title) => `${title} added to cart`,
    alreadyInCart: (title) => `${title} is already in cart`,
  },
  ru: {
    addedToCart: (title) => `${title} добавлен в корзину`,
    alreadyInCart: (title) => `${title} уже в корзине`,
  },
};

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

  openMasterClassDialog(button.dataset.id);
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

  const lang = getCurrentLang();
  const messageSet = toastMessages[lang] || toastMessages.en;

  if (isAdded) {
    updateCartCounter();
    showToast(messageSet.addedToCart(masterClass.title[lang]), 'success');
  } else {
    showToast(messageSet.alreadyInCart(masterClass.title[lang]), 'info');
  }
});

//карточки мастер-классов

function getCurrentLang() {
  return localStorage.getItem('site_language') || 'en';
}

function renderCards() {
  const lang = getCurrentLang();

  let filteredCards =
    currentFilter === 'all'
      ? [...masterClasses]
      : masterClasses.filter((item) => item.category === currentFilter);

  if (currentSearch !== '') {
    filteredCards = filteredCards.filter((item) => {
      return (
        item.title[lang].toLowerCase().includes(currentSearch) ||
        item.category.toLowerCase().includes(currentSearch)
      );
    });
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

  if (filteredCards.length === 0) {
    classesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">🔍</div>
        <h3 class="empty-state-title">
          ${lang === 'ru' ? 'Ничего не найдено' : 'No master-classes found'}
        </h3>
        <p class="empty-state-text">
          ${
            lang === 'ru'
              ? 'Попробуйте другой поисковый запрос или выберите другую категорию.'
              : 'Try another search word or choose a different category.'
          }
        </p>
      </div>
    `;
    return;
  }

  classesList.innerHTML = filteredCards
    .map((item) => {
      return `
        <article class="card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.alt[lang]}" class="card-image" />

          <div class="card-content">
            <div class="card-title-wrap">
              <button class="card-title-button" data-id="${item.id}" type="button">
                ${item.title[lang]}
              </button>
            </div>

            <div class="card-footer">
              <button class="card-favorite" type="button">
                <i class="fa ${isFavorite(item.id) ? 'fa-heart' : 'fa-heart-o'}" aria-hidden="true"></i>
              </button>

              <p class="card-price">${item.price}</p>

              <button class="card-in-basket" type="button">
                <i class="fa fa-shopping-cart nav-icon-link cart-link" aria-hidden="true"></i>
              </button>
            </div>

            <p class="card-reviews">${item.reviews[lang]} ☆</p>
          </div>
        </article>
      `;
    })
    .join('');
}

function openMasterClassDialog(id) {
  const masterClass = masterClasses.find((item) => item.id === id);
  if (!masterClass) return;

  const lang = getCurrentLang();

  dialogImage.src = masterClass.imageDetails;
  dialogImage.alt = masterClass.alt[lang];
  dialogTitle.textContent = masterClass.title[lang];
  dialogDuration.textContent = masterClass.duration[lang];
  dialogDescription.textContent = masterClass.description[lang];

  dialogReviews.innerHTML = masterClass.reviewsList[lang]
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
document.addEventListener('languageChanged', () => {
  renderCards();
});
applyTranslations(getCurrentLang());
// стартовый рендер
renderCards();
updateCartCounter();
