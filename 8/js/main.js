// main.js

import { renderGallery } from './gallery.js';
import {generatePhotosArray} from './data.js';

// ❗️ Генерируем массив ОДИН раз и сохраняем его
const photosData = generatePhotosArray();

// Передаем ЕДИНЫЙ массив в галерею
renderGallery(photosData);
