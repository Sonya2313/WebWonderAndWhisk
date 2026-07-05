const translations = {
  en: {
    profile: 'PROFILE',
    cartTitle: 'My cart',
    orderSummary: 'Order summary',
    orderSummaryText: 'Your selected treats, all in one place.',
    items: 'Items',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Proceed to checkout',
    paymentTitle: 'Choose payment method',
    bankCard: 'Bank card',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    cancel: 'Cancel',
    continue: 'Continue',
    favoritesTitle: 'Favorites',
    classesHeroTop: 'DISCOVER PASTRY',
    classesHeroTitle: 'Master-Classes',
    classesHeroBottom: 'THAT TURN PRACTICE INTO WONDER',
    categories: 'Categories',
    all: 'All',
    cakes: 'Cakes',
    buns: 'Buns',
    cheesecakes: 'Cheesecakes',
    tarts: 'Tarts',
    sorting: 'Sorting',
    priceAsc: 'Price ↑',
    priceDesc: 'Price ↓',
    byPopularity: 'By popularity',
    searchPlaceholder: 'Search master-class',
    description: 'DESCRIPTION',
    reviews: 'REVIEWS',
    aboutUs: 'ABOUT US',
    contactUs: 'CONTACT US',
    payment: 'PAYMENT',
    questions: 'QUESTIONS',
    certificates: 'CERTIFICATES',
    classesFooterText:
      'We offer hands-on pastry masterclasses for every level — from your first whisk to bakery-worthy creations.',
    close: 'Close',
  },
  ru: {
    profile: 'ПРОФИЛЬ',
    cartTitle: 'Моя корзина',
    orderSummary: 'Оформление заказа',
    orderSummaryText: 'Все выбранные мастер-классы в одном месте.',
    items: 'Позиции',
    subtotal: 'Промежуточный итог',
    total: 'Итого',
    checkout: 'Перейти к оплате',
    paymentTitle: 'Выберите способ оплаты',
    bankCard: 'Банковская карта',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    cancel: 'Отмена',
    continue: 'Продолжить',
    favoritesTitle: 'Избранное',
    classesHeroTop: 'ОТКРОЙ МИР КОНДИТЕРСКОГО ИСКУССТВА',
    classesHeroTitle: 'Мастер-классы',
    classesHeroBottom: 'КОТОРЫЕ ПРЕВРАЩАЮТ ПРАКТИКУ В ВОЛШЕБСТВО',
    categories: 'Категории',
    all: 'Все',
    cakes: 'Торты',
    buns: 'Булочки',
    cheesecakes: 'Чизкейки',
    tarts: 'Тарты',
    sorting: 'Сортировка',
    priceAsc: 'Цена ↑',
    priceDesc: 'Цена ↓',
    byPopularity: 'По популярности',
    searchPlaceholder: 'Поиск мастер-класса',
    description: 'ОПИСАНИЕ',
    reviews: 'ОТЗЫВЫ',
    aboutUs: 'О НАС',
    contactUs: 'СВЯЗАТЬСЯ С НАМИ',
    payment: 'ОПЛАТА',
    questions: 'ВОПРОСЫ',
    certificates: 'СЕРТИФИКАТЫ',
    classesFooterText:
      'Мы предлагаем практические кондитерские мастер-классы для любого уровня — от первого венчика до десертов уровня пекарни.',
    close: 'Закрыть',
  },
};

const uiMessages = {
  en: {
    cart: {
      emptyTitle: 'Your cart is empty',
      emptyText: 'Add master classes to your cart to continue.',
      summaryEmpty: 'No master-classes added yet.',
      buyNow: 'Buy Now',
      removeFromCart: 'Remove from cart',
      buyAria: (title) => `Buy ${title}`,
      purchaseTotal: (total) =>
        `You are about to purchase master-classes for ${total}.`,
      purchaseSingle: (title) => `You are about to purchase: ${title}`,
    },
    classes: {
      emptyTitle: 'No master-classes found',
      emptyText: 'Try another search word or choose a different category.',
      addedToCart: (title) => `${title} added to cart`,
      alreadyInCart: (title) => `${title} is already in cart`,
    },
    favorites: {
      emptyTitle: 'No favorites yet',
      emptyText: 'Save the master classes you like to see them here.',
      removeFromFavorites: 'Remove from favorites',
    },
  },
  ru: {
    cart: {
      emptyTitle: 'Ваша корзина пуста',
      emptyText: 'Добавьте мастер-классы в корзину, чтобы продолжить.',
      summaryEmpty: 'В корзину пока ничего не добавлено.',
      buyNow: 'Купить сейчас',
      removeFromCart: 'Удалить из корзины',
      buyAria: (title) => `Купить ${title}`,
      purchaseTotal: (total) =>
        `Вы собираетесь купить мастер-классы на сумму ${total}.`,
      purchaseSingle: (title) => `Вы собираетесь купить: ${title}`,
    },
    classes: {
      emptyTitle: 'Ничего не найдено',
      emptyText:
        'Попробуйте другой поисковый запрос или выберите другую категорию.',
      addedToCart: (title) => `${title} добавлен в корзину`,
      alreadyInCart: (title) => `${title} уже в корзине`,
    },
    favorites: {
      emptyTitle: 'Пока нет избранного',
      emptyText:
        'Сохраняйте понравившиеся мастер-классы, чтобы видеть их здесь.',
      removeFromFavorites: 'Удалить из избранного',
    },
  },
};
const LANGUAGE_KEY = 'site_language';

function getSavedLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'en';
}

function setSavedLanguage(lang) {
  localStorage.setItem(LANGUAGE_KEY, lang);
}

function getUiMessages(lang = getSavedLanguage()) {
  return uiMessages[lang] || uiMessages.en;
}

function t(key, lang = getSavedLanguage()) {
  return translations[lang]?.[key] ?? translations.en?.[key] ?? key;
}

function applyTranslations(lang) {
  const currentLanguage = translations[lang] || translations.en;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (currentLanguage[key]) {
      el.textContent = currentLanguage[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (currentLanguage[key]) {
      element.placeholder = currentLanguage[key];
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (currentLanguage[key]) {
      element.setAttribute('aria-label', currentLanguage[key]);
    }
  });

  document.documentElement.lang = lang;
}

function initLanguageSwitcher() {
  const languageSelect = document.getElementById('language-select');
  const currentLanguage = getSavedLanguage();

  applyTranslations(currentLanguage);

  if (languageSelect) {
    languageSelect.value = currentLanguage;

    languageSelect.addEventListener('change', (event) => {
      const selectedLang = event.target.value;
      setSavedLanguage(selectedLang);
      applyTranslations(selectedLang);

      document.dispatchEvent(
        new CustomEvent('languageChanged', {
          detail: { lang: selectedLang },
        }),
      );
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}

export {
  applyTranslations,
  getSavedLanguage,
  setSavedLanguage,
  getUiMessages,
  t,
};
