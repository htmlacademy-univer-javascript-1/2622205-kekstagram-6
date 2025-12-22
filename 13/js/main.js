// main.js

import { renderGallery } from './gallery.js';
import { generatePhotosArray } from './data.js';
import './form.js';

const photosData = generatePhotosArray();
renderGallery(photosData);
