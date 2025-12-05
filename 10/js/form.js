// form.js

import {addEventListenerImage, removeEventListenerImage, addFilter, removeFilters } from './effects.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm.querySelector('#upload-cancel');
const body = document.body;

const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  addEventListenerImage();
  addFilter();
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadForm = () => {
  uploadFileInput.value = '';
  uploadForm.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  removeEventListenerImage();
  removeFilters();
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

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const normalizeHashtags = (value) =>
  value.trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

const validateHashtagSyntax = (value) => {
  if (value.length === 0) {
    return true;
  }
  return normalizeHashtags(value).every((tag) => VALID_HASHTAG_REGEX.test(tag));
};

const validateHashtagCount = (value) => normalizeHashtags(value).length <= MAX_HASHTAG_COUNT;

const validateHashtagDuplicates = (value) => {
  const hashtags = normalizeHashtags(value);
  return new Set(hashtags).size === hashtags.length;
};

const MAX_COMMENT_LENGTH = 140;

const validateComment = (value) =>
  value.length <= MAX_COMMENT_LENGTH;

const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

pristine.addValidator(
  hashtagInput,
  validateHashtagSyntax,
  'Хэш-тег должен начинаться с #, содержать только буквы/числа и быть до 20 символов.',
  3,
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

uploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
});

export { uploadForm, closeUploadForm };
