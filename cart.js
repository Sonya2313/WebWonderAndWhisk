import { getCart, removeFromCart } from './utils/localStorage.js';
import { masterClasses } from './utils/masterClasses.js';
import {
  applyTranslations,
  getSavedLanguage,
  getUiMessages,
} from './language.js';

const cartList = document.getElementById('cart-list');
const paymentDialog = document.getElementById('payment-dialog');
const paymentDialogItem = document.getElementById('payment-dialog-item');
const confirmPaymentButton = document.getElementById('confirm-payment');
const checkoutButton = document.getElementById('checkout-button');

let selectedCartItemId = null;

function parsePrice(price) {
  if (typeof price === 'number') return price;

  return (
    Number(
      String(price)
        .replace(/[^\d.,]/g, '')
        .replace(/\s/g, '')
        .replace(',', '.'),
    ) || 0
  );
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function getCartItemsData() {
  const cartIds = getCart();
  return masterClasses.filter((item) => cartIds.includes(String(item.id)));
}

function renderCartSummaryItems() {
  const lang = getSavedLanguage();
  const messages = getUiMessages(lang).cart;

  const summaryItemList = document.getElementById('summary-items-list');
  const processedButton = document.getElementById('checkout-button');

  if (!summaryItemList) return;

  const cartItems = getCartItemsData();

  if (processedButton) {
    processedButton.disabled = cartItems.length === 0;
  }

  if (cartItems.length === 0) {
    summaryItemList.innerHTML = `
      <p class="summary-empty">${messages.summaryEmpty}</p>
    `;
    return;
  }

  summaryItemList.innerHTML = cartItems
    .map((item) => {
      return `
        <div class="summary-item">
          <span class="summary-item-title">${item.title[lang]}</span>
          <span class="summary-item-price">${item.price}</span>
        </div>
      `;
    })
    .join('');
}

function updateCartSummary() {
  const summaryItemsCount = document.getElementById('summary-items-count');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');

  if (!summaryItemsCount || !summarySubtotal || !summaryTotal) return;

  const cartItems = getCartItemsData();

  const itemsCount = cartItems.length;
  const subtotal = cartItems.reduce((total, item) => {
    return total + parsePrice(item.price);
  }, 0);

  summaryItemsCount.textContent = itemsCount;
  summarySubtotal.textContent = formatPrice(subtotal);
  summaryTotal.textContent = formatPrice(subtotal);

  renderCartSummaryItems();
}

function renderCartList() {
  const lang = getSavedLanguage();
  const messages = getUiMessages(lang).cart;
  const cartIdsFromStorage = getCart();

  const cartClasses = masterClasses.filter((item) =>
    cartIdsFromStorage.includes(item.id),
  );

  if (cartClasses.length === 0) {
    cartList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fa fa-shopping-basket" aria-hidden="true"></i>
        </div>
        <h2 class="empty-state-title">${messages.emptyTitle}</h2>
        <p class="empty-state-text">${messages.emptyText}</p>
      </div>
    `;

    updateCartSummary();
    return;
  }

  cartList.innerHTML = cartClasses
    .map((item) => {
      return `
        <article class="cart-card" data-id="${item.id}">
          <div class="cart-card-info">
            <h2 class="cart-card-title">${item.title[lang]}</h2>
            <p class="cart-card-price">${item.price}</p>
          </div>

          <div class="cart-card-actions">
            <button
              class="cart-card-buy"
              type="button"
              aria-label="${messages.buyAria(item.title[lang])}"
            >
              ${messages.buyNow}
            </button>

            <button
              class="cart-card-remove"
              type="button"
              aria-label="${messages.removeFromCart}"
            >
              <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </article>
      `;
    })
    .join('');

  updateCartSummary();
}

if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    const messages = getUiMessages(getSavedLanguage()).cart;
    const cartItems = getCartItemsData();

    if (cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => {
      return sum + parsePrice(item.price);
    }, 0);

    paymentDialogItem.textContent = messages.purchaseTotal(formatPrice(total));
    selectedCartItemId = null;
    paymentDialog.showModal();
  });
}

if (cartList) {
  cartList.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.cart-card-remove');
    if (removeButton) {
      const card = removeButton.closest('.cart-card');
      if (!card) return;

      const { id } = card.dataset;
      removeFromCart(id);
      renderCartList();
      return;
    }

    const buyButton = event.target.closest('.cart-card-buy');
    if (buyButton) {
      const lang = getSavedLanguage();
      const messages = getUiMessages(lang).cart;

      const card = buyButton.closest('.cart-card');
      if (!card) return;

      const { id } = card.dataset;
      const selectedItem = masterClasses.find((item) => item.id === id);
      if (!selectedItem) return;

      selectedCartItemId = id;
      paymentDialogItem.textContent = messages.purchaseSingle(
        selectedItem.title[lang],
      );
      paymentDialog.showModal();
    }
  });
}

if (confirmPaymentButton) {
  confirmPaymentButton.addEventListener('click', () => {
    const selectedMethod = document.querySelector(
      'input[name="payment-method"]:checked',
    );

    if (!selectedMethod) return;

    paymentDialog.close();
  });
}

document.addEventListener('languageChanged', () => {
  applyTranslations(getSavedLanguage());
  renderCartList();
});

applyTranslations(getSavedLanguage());
renderCartList();
updateCartSummary();
