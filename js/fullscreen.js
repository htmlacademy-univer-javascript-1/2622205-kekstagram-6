const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('#picture-cancel');

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

const renderComments = (comments) => {
  socialComments.innerHTML = '';
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });
  socialComments.appendChild(fragment);
};

const openFullscreen = (photoData) => {
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;
  renderComments(photoData.comments);
  commentCountElement.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeFullscreen = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

closeButton.addEventListener('click', () => {
  closeFullscreen();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
});

export { openFullscreen, closeFullscreen };
