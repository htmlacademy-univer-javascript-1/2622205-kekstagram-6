import { addEventListenerImage, removeEventListenerImage, addFilter, removeFilters } from './effects.js';
import { sendData } from './api.js';
import { isEscapeKey } from './util.js';

const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_COMMENT_LENGTH = 140;

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Опубликовываю...'
};

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm.querySelector('#upload-cancel');
const submitButton = uploadForm.querySelector('#upload-submit');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const imgPreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');

const body = document.body;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});


const onFileInputChange = () => {
  const file = uploadFileInput.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const url = URL.createObjectURL(file);
    imgPreview.src = url;
    effectsPreviews.forEach((item) => {
      item.style.backgroundImage = `url(${url})`;
    });
    openUploadForm();
  }
};

const normalizeHashtags = (value) => value.trim().toLowerCase().split(/\s+/).filter((tag) => tag.length > 0);
const validateHashtagSyntax = (value) => value.length === 0 || normalizeHashtags(value).every((tag) => VALID_HASHTAG_REGEX.test(tag));
const validateHashtagCount = (value) => normalizeHashtags(value).length <= MAX_HASHTAG_COUNT;
const validateHashtagDuplicates = (value) => {
  const hashtags = normalizeHashtags(value);
  return new Set(hashtags).size === hashtags.length;
};
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(hashtagInput, validateHashtagSyntax, 'Неверный хэш-тег', 3, true);
pristine.addValidator(hashtagInput, validateHashtagCount, `Максимум ${MAX_HASHTAG_COUNT}`, 2, true);
pristine.addValidator(hashtagInput, validateHashtagDuplicates, 'Повторяющийся хэш-тег', 1, true);
pristine.addValidator(commentInput, validateComment, `Максимум ${MAX_COMMENT_LENGTH} символов`);

function openUploadForm() {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  addEventListenerImage();
  addFilter();
  document.addEventListener('keydown', onDocumentKeydown);
}

const closeUploadForm = () => {
  uploadForm.reset();
  pristine.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  removeEventListenerImage();
  removeFilters();
  document.removeEventListener('keydown', onDocumentKeydown);
  imgPreview.src = 'img/upload-default-image.jpg';
  effectsPreviews.forEach((item) => {
    item.style.backgroundImage = '';
  });
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !document.activeElement.closest('.img-upload__text')) {
    if (document.querySelector('.error')) {
      return;
    }
    evt.preventDefault();
    closeUploadForm();
  }
}

const showMessage = (type) => {
  const template = document.querySelector(`#${type}`).content.querySelector(`.${type}`);
  const messageElement = template.cloneNode(true);
  document.body.append(messageElement);

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageKeydown);
  };

  function onMessageKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeMessage();
    }
  }

  messageElement.addEventListener('click', (evt) => {
    if (evt.target.classList.contains(type) || evt.target.classList.contains(`${type}__button`)) {
      closeMessage();
    }
  });

  document.addEventListener('keydown', onMessageKeydown);
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

const onUploadFormSubmit = (evt) => {
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
};

uploadFileInput.addEventListener('change', onFileInputChange);
uploadCancelButton.addEventListener('click', closeUploadForm);

uploadForm.addEventListener('submit', onUploadFormSubmit);
