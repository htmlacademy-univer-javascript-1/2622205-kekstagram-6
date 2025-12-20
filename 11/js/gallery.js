// gallery.js

import { renderThumbnails } from './thumbnail.js';
import { openFullscreen } from './fullscreen.js';

const picturesContainer = document.querySelector('.pictures');
const renderGallery = (photos) => {
  picturesContainer.addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');

    if (thumbnail) {
      evt.preventDefault();
      const thumbnailId = parseInt(thumbnail.dataset.thumbnailId, 10);
      const photoData = photos.find((photo) => photo.id === thumbnailId);
      if (photoData) {
        openFullscreen(photoData);
      }
    }
  });
  renderThumbnails(photos);
};

export { renderGallery };
