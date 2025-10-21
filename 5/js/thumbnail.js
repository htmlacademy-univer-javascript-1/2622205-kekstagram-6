import { generatePhotosArray } from './data.js';

const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture');
  const thumbnail = template.content.querySelector('.picture').cloneNode(true);
  const imgElement = thumbnail.querySelector('.picture__img');
  imgElement.src = photoData.url;
  imgElement.alt = photoData.description;
  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;
  thumbnail.dataset.thumbnailId = photoData.id;
  return thumbnail;
};

const renderThumbnails = () => {
  const picturesContainer = document.querySelector('.pictures');
  const photos = generatePhotosArray;
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });
  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
