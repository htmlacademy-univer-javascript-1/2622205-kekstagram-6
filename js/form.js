// form.js

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm.querySelector('#upload-cancel');
const body = document.body;

const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadForm = () => {
  uploadFileInput.value = '';
  uploadForm.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

const isTextFieldFocused = () =>
  document.activeElement === uploadForm.querySelector('.text__hashtags') ||
  document.activeElement === uploadForm.querySelector('.text__description');

function onDocumentKeydown (evt) {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    if (!isTextFieldFocused()) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
}

uploadFileInput.addEventListener('change', () => {
  openUploadForm();
});

uploadCancelButton.addEventListener('click', () => {
  closeUploadForm();
});
// Продолжение upload-form.js

// Инициализация Pristine (предполагаем, что библиотека подключена)
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper', // Элемент, на который добавляется класс ошибки
  errorTextParent: 'img-upload__field-wrapper', // Элемент, куда выводится текст ошибки
  errorTextTag: 'div', // Тег для текста ошибки
  errorTextClass: 'img-upload__error' // Класс для текста ошибки
});

// --- Константы для валидации Хэш-тегов (из техзадания) ---
const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

// Функция для преобразования строки хэш-тегов в массив
const normalizeHashtags = (value) =>
  value.trim()
    .toLowerCase() // Нечувствительность к регистру
    .split(/\s+/)
    .filter((tag) => tag.length > 0); // Удаляем пустые элементы, если несколько пробелов подряд


// 1. Проверка на соответствие регулярному выражению (валидный синтаксис)
const validateHashtagSyntax = (value) => {
  if (value.length === 0) { // Хэш-теги необязательны
    return true;
  }
  return normalizeHashtags(value).every((tag) => VALID_HASHTAG_REGEX.test(tag));
};

// 2. Проверка на количество хэш-тегов
const validateHashtagCount = (value) => normalizeHashtags(value).length <= MAX_HASHTAG_COUNT;

// 3. Проверка на дубликаты
const validateHashtagDuplicates = (value) => {
  const hashtags = normalizeHashtags(value);
  // Используем Set для проверки уникальности
  return new Set(hashtags).size === hashtags.length;
};

// --- Валидация Комментария (из техзадания) ---
const MAX_COMMENT_LENGTH = 140;

const validateComment = (value) =>
  value.length <= MAX_COMMENT_LENGTH;

// --- Добавление правил валидации ---

const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

pristine.addValidator(
  hashtagInput,
  validateHashtagSyntax,
  'Хэш-тег должен начинаться с #, содержать только буквы/числа и быть до 20 символов.',
  3, // Приоритет, чтобы это сообщение было первым
  true
);

pristine.addValidator(
  hashtagInput,
  validateHashtagCount,
  `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов.`,
  2,
  true
);

pristine.addValidator(
  hashtagInput,
  validateHashtagDuplicates,
  'Один и тот же хэш-тег не может быть использован дважды.',
  1,
  true
);

pristine.addValidator(
  commentInput,
  validateComment,
  `Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов.`,
  false
);

// --- Обработка отправки формы ---

uploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault(); // Предотвращаем отправку, если форма невалидна
    // Сообщения об ошибках будут показаны Pristine
  }
  // Если форма валидна, отправка данных на сервер (AJAX-запрос) будет реализована в следующих ДЗ.
  // Сейчас по умолчанию сработает отправка на action="https://..."
});

export { uploadForm, closeUploadForm };
