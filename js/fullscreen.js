// fullscreen.js
import { isEscapeKey } from './util.js';

const COMMENT_STEP = 5;
const bigPicture = document.querySelector('.big-picture');
const bigPictureImgElement = bigPicture.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const commentsCountElement = bigPicture.querySelector('.comments-count');
const socialCaptionElement = bigPicture.querySelector('.social__caption');
const socialCommentsList = bigPicture.querySelector('.social__comments');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoaderButton = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('#picture-cancel');

let currentComments = [];
let shownCommentsCount = 0;


const onLikesCountClick = () => {
  const isLiked = likesCountElement.classList.contains('likes-count--active');
  let currentLikes = parseInt(likesCountElement.textContent, 10);

  if (isLiked) {
    currentLikes--;
    likesCountElement.classList.remove('likes-count--active');
    likesCountElement.style.color = '';
  } else {
    currentLikes++;
    likesCountElement.classList.add('likes-count--active');
    likesCountElement.style.color = '#ff4e4e';
  }

  likesCountElement.textContent = currentLikes;
};


const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;
  return commentElement;
};

const updateCommentsCounter = () => {
  commentCountBlock.innerHTML = `<span class="social__comment-shown-count">${shownCommentsCount}</span> из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;
  if (shownCommentsCount >= currentComments.length) {
    commentsLoaderButton.classList.add('hidden');
  } else {
    commentsLoaderButton.classList.remove('hidden');
  }
};

const renderNextComments = () => {
  const fragment = document.createDocumentFragment();
  const nextSliceEnd = Math.min(shownCommentsCount + COMMENT_STEP, currentComments.length);
  const commentsToRender = currentComments.slice(shownCommentsCount, nextSliceEnd);

  commentsToRender.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialCommentsList.appendChild(fragment);
  shownCommentsCount = nextSliceEnd;
  updateCommentsCounter();
};


function closeFullscreen () {
  shownCommentsCount = 0;
  currentComments = [];
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  likesCountElement.removeEventListener('click', onLikesCountClick);
}

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
}

const openFullscreen = (photoData) => {
  currentComments = photoData.comments;
  socialCommentsList.innerHTML = '';
  bigPictureImgElement.src = photoData.url;
  bigPictureImgElement.alt = photoData.description;
  likesCountElement.textContent = photoData.likes;
  commentsCountElement.textContent = currentComments.length;
  socialCaptionElement.textContent = photoData.description;
  likesCountElement.classList.remove('likes-count--active');
  likesCountElement.style.color = '';
  commentCountBlock.classList.remove('hidden');
  commentsLoaderButton.classList.remove('hidden');
  renderNextComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  likesCountElement.addEventListener('click', onLikesCountClick);
};

closeButton.addEventListener('click', () => {
  closeFullscreen();
});

commentsLoaderButton.addEventListener('click', () => {
  renderNextComments();
});

export { openFullscreen, closeFullscreen };
