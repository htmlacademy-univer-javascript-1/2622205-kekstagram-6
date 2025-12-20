import { addEventListenerImage, removeEventListenerImage, addFilter, removeFilters } from './effects.js';
import { sendData } from './api.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm.querySelector('#upload-cancel');
const submitButton = uploadForm.querySelector('#upload-submit');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const body = document.body;

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Опубликовываю...'
};

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

// Валидация хэш-тегов и комментариев
const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_COMMENT_LENGTH = 140;

const normalizeHashtags = (value) =>
  value.trim().toLowerCase().split(/\s+/).filter((tag) => tag.length > 0);

const validateHashtagSyntax = (value) =>
  value.length === 0 || normalizeHashtags(value).every((tag) => VALID_HASHTAG_REGEX.test(tag));

const validateHashtagCount = (value) => normalizeHashtags(value).length <= MAX_HASHTAG_COUNT;

const validateHashtagDuplicates = (value) => {
  const hashtags = normalizeHashtags(value);
  return new Set(hashtags).size === hashtags.length;
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(hashtagInput, validateHashtagSyntax, 'Неверный хэш-тег', 3, true);
pristine.addValidator(hashtagInput, validateHashtagCount, `Максимум ${MAX_HASHTAG_COUNT} тегов`, 2, true);
pristine.addValidator(hashtagInput, validateHashtagDuplicates, 'Теги повторяются', 1, true);
pristine.addValidator(commentInput, validateComment, `Максимум ${MAX_COMMENT_LENGTH} символов`);

// Функции открытия и закрытия
const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  addEventListenerImage();
  addFilter();
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadForm = () => {
  uploadForm.reset();
  pristine.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  removeEventListenerImage();
  removeFilters();
  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !document.activeElement.closest('.img-upload__text')) {
    evt.preventDefault();
    closeUploadForm();
  }
}

// Работа с сообщениями об успехе/ошибке (п. 3.4, 3.5)
const showMessage = (type) => {
  const template = document.querySelector(`#${type}`).content.querySelector(`.${type}`);
  const messageElement = template.cloneNode(true);
  document.body.append(messageElement);

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageKeydown);
    document.removeEventListener('click', onOutsideClick);
    if (type === 'error') {
      document.addEventListener('keydown', onDocumentKeydown);
    }
  };

  function onMessageKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    if (evt.target.classList.contains(type)) {
      closeMessage();
    }
  }

  messageElement.querySelector(`.${type}__button`).addEventListener('click', closeMessage);
  document.addEventListener('keydown', onMessageKeydown);
  document.addEventListener('click', onOutsideClick);

  if (type === 'error') {
    document.removeEventListener('keydown', onDocumentKeydown);
  }
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

uploadFileInput.addEventListener('change', openUploadForm);
uploadCancelButton.addEventListener('click', closeUploadForm);

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (pristine.validate()) {
    blockSubmitButton();
    sendData(new FormData(evt.target))
      .then(() => {
        closeUploadForm();
        showMessage('success');
      })
      .catch(() => {
        showMessage('error');
      })
      .finally(unblockSubmitButton);
  }
});

export { uploadForm, closeUploadForm };
