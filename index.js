const languageSelect = document.getElementById('language-select');

const translations = {
  en: {
    heroTop: 'FROM TASTES & TEXTURES TO',
    heroMain: 'PROFESSIONALS',
    heroBottom: 'explore gastronomy sphere with us.',
    masterClasses: 'master-classes',
    shop: 'pastry-shop',
    about: 'ABOUT US',
    profile: 'PROFILE',
  },
  ru: {
    heroTop: 'ОТ ВКУСОВ И ТЕКСТУР ДО',
    heroMain: 'ПРОФЕССИОНАЛОВ',
    heroBottom: 'исследуйте мир гастрономии вместе с нами.',
    masterClasses: 'мастер-классы',
    shop: 'кондитерская',
    about: 'О НАС',
    profile: 'ПРОФИЛЬ',
  },
};

function updateLanguage() {
  const currentLanguage = languageSelect.value;
  const currentTexts = translations[currentLanguage];
  const elementsToTranslate = document.querySelectorAll('[data-i18n]');

  elementsToTranslate.forEach(function (element) {
    const key = element.dataset.i18n;
    element.textContent = currentTexts[key];
  });
}

languageSelect.addEventListener('change', updateLanguage);
updateLanguage();
