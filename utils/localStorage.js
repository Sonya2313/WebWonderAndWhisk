const FAVORITES_KEY = 'favorites';
const CART_KEY = 'cart';

function localStorageSetItem(key, value) {
  if (typeof key !== 'string') {
    console.error('Error: key must be a string');
    return;
  }

  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage`, error);
    return false;
  }
}

function localStorageGetItem(key, defaultValue = null) {
  const value = localStorage.getItem(key);

  if (value === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return defaultValue;
  }
}

function localStorageRemoveItem(key) {
  localStorage.removeItem(key);
}

function localStorageClear() {
  localStorage.clear();
}

function getFavorites() {
  const favorites = localStorageGetItem(FAVORITES_KEY, []);
  return Array.isArray(favorites) ? favorites : [];
}

function saveFavorites(favorites) {
  return localStorageSetItem(FAVORITES_KEY, favorites);
}

function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

function toggleFavorites(id) {
  const favorites = getFavorites();

  if (favorites.includes(id)) {
    const updatedFavorites = favorites.filter(
      (favoriteId) => favoriteId !== id,
    );
    saveFavorites(updatedFavorites);
    return;
  }

  const updatedFavorites = [...favorites, id];
  saveFavorites(updatedFavorites);
  return updatedFavorites;
}

function getCart() {
  const cart = localStorageGetItem(CART_KEY, []);
  return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
  return localStorageSetItem(CART_KEY, cart);
}
function isInCart(id) {
  const cart = getCart();
  return cart.some((item) => item.id === id);
}

function addToCart(id) {
  const cart = getCart();

  if (cart.includes(id)) {
    return false;
  }

  const updatedCart = [...cart, id];
  saveCart(updatedCart);
  return true;
}

function removeFromCart(id) {
  const cart = getCart();
  const updatedCart = cart.filter((cartId) => cartId !== id);
  saveCart(updatedCart);
}

function getCartCount() {
  return getCart().length;
}

export { isFavorite, toggleFavorites, getFavorites, addToCart, getCartCount };
