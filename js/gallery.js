// gallery.js

import { renderThumbnails } from './thumbnail.js';
import { openFullscreen } from './fullscreen.js';
import { getData } from './api.js';
import { initFilter } from './filters.js';
import { debounce, showAlert } from './util.js';

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

// Загрузка данных и инициализация фильтров (п. 5.1, 5.2, 5.3)
getData()
  .then((photos) => {
    renderGallery(photos);

    const debouncedRenderThumbnails = debounce((data) => renderThumbnails(data));

    initFilter(photos, (filteredPhotos) => {
      debouncedRenderThumbnails(filteredPhotos);
    });
  })
  .catch((err) => {
    showAlert(err.message); // Используем showAlert вместо console
  });

export { renderGallery };
