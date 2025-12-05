// effects.js

const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;
const DEFAULT_SCALE = 100;

const form = document.querySelector('.img-upload__form');
const zoomOutBtnElement = form.querySelector('.scale__control--smaller');
const zoomBtnElement = form.querySelector('.scale__control--bigger');
const scaleValueElement = form.querySelector('.scale__control--value');
const imageElement = form.querySelector('.img-upload__preview img');
const filterBtnsContainerElement = form.querySelector('.effects__list');
const sliderElement = form.querySelector('.effect-level__slider');
const sliderContainer = form.querySelector('.effect-level');
const filterValueElement = form.querySelector('.effect-level__value');

const Effects = {
  NONE: {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
    connect: 'lower',
    format: {
      to: function (value) {
        return value;
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  },
  CHROME: {
    range: {
      min: 0,
      max: 1
    },
    start: 1,
    step: 0.1,
    format: {
      to: function (value) {
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  },
  SEPIA: {
    range: {
      min: 0,
      max: 1
    },
    start: 1,
    step: 0.1,
    format: {
      to: function (value) {
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  },
  MARVIN: {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    format: {
      to: function (value) {
        return `${value}%`;
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  },
  PHOBOS: {
    range: {
      min: 0,
      max: 3
    },
    start: 3,
    step: 0.1,
    format: {
      to: function (value) {
        return `${value.toFixed(1)}px`;
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  },
  HEAT: {
    range: {
      min: 1,
      max: 3
    },
    start: 3,
    step: 0.1,
    format: {
      to: function (value) {
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  }
};

const EffectsStyle = {
  chrome: 'grayscale',
  sepia: 'sepia',
  marvin: 'invert',
  phobos: 'blur',
  heat: 'brightness',
  none: 'none'
};

let currentScale = DEFAULT_SCALE;
let filterType = 'none';

// Функции для масштабирования
const updateScale = () => {
  scaleValueElement.value = `${currentScale}%`;
  const scaleValue = currentScale / 100;
  imageElement.style.transform = `scale(${scaleValue})`;
};

const imageZoomOutHandler = () => {
  if (currentScale > MIN_SCALE) {
    currentScale -= STEP_SCALE;
    updateScale();
  }
};

const imageZoomInHandler = () => {
  if (currentScale < MAX_SCALE) {
    currentScale += STEP_SCALE;
    updateScale();
  }
};

const resetScale = () => {
  currentScale = DEFAULT_SCALE;
  updateScale();
};

const addEventListenerImage = () => {
  zoomOutBtnElement.addEventListener('click', imageZoomOutHandler);
  zoomBtnElement.addEventListener('click', imageZoomInHandler);
  updateScale();
};

const removeEventListenerImage = () => {
  zoomOutBtnElement.removeEventListener('click', imageZoomOutHandler);
  zoomBtnElement.removeEventListener('click', imageZoomInHandler);
};

const updateSlider = (options) => {
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.updateOptions(options);
  }
};

const applyEffect = (effectName, value) => {
  if (effectName === 'none') {
    imageElement.style.filter = '';
    return;
  }

  const style = EffectsStyle[effectName];
  let filterValue = value;

  if (effectName === 'marvin') {
    filterValue = `${value}%`;
  } else if (effectName === 'phobos') {
    filterValue = `${value.toFixed(1)}px`;
  } else if (effectName === 'chrome' || effectName === 'sepia' || effectName === 'heat') {
    filterValue = value.toFixed(1);
  }

  imageElement.style.filter = `${style}(${filterValue})`;
  filterValueElement.value = value;
};

const customiseFilter = (filterID) => {
  let effectName;
  let options;
  switch (filterID) {
    case 'effect-none':
      effectName = 'none';
      sliderContainer.classList.add('hidden');
      options = Effects.NONE;
      break;
    case 'effect-chrome':
      effectName = 'chrome';
      sliderContainer.classList.remove('hidden');
      options = Effects.CHROME;
      break;
    case 'effect-sepia':
      effectName = 'sepia';
      sliderContainer.classList.remove('hidden');
      options = Effects.SEPIA;
      break;
    case 'effect-marvin':
      effectName = 'marvin';
      sliderContainer.classList.remove('hidden');
      options = Effects.MARVIN;
      break;
    case 'effect-phobos':
      effectName = 'phobos';
      sliderContainer.classList.remove('hidden');
      options = Effects.PHOBOS;
      break;
    case 'effect-heat':
      effectName = 'heat';
      sliderContainer.classList.remove('hidden');
      options = Effects.HEAT;
      break;
    default:
      effectName = 'none';
      sliderContainer.classList.add('hidden');
      options = Effects.NONE;
  }
  filterType = effectName;
  imageElement.className = '';
  imageElement.classList.add(`effects__preview--${effectName}`);
  updateSlider(options);

  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.set(options.start);
    applyEffect(effectName, options.start);
  }
};

const filterChangeHandler = (evt) => {
  if (evt.target.matches('.effects__radio')) {
    customiseFilter(evt.target.id);
  }
};

const addFilter = () => {
  noUiSlider.create(sliderElement, Effects.NONE);
  sliderContainer.classList.add('hidden');
  filterValueElement.value = '';
  sliderElement.noUiSlider.on('update', (values, handle) => {
    const value = parseFloat(values[handle]);
    applyEffect(filterType, value);
  });
  filterBtnsContainerElement.addEventListener('change', filterChangeHandler);
  document.querySelector('#effect-none').checked = true;
  customiseFilter('effect-none');
};

const removeFilters = () => {
  filterBtnsContainerElement.removeEventListener('change', filterChangeHandler);
  imageElement.className = '';
  imageElement.style.filter = '';
  imageElement.style.transform = 'scale(1)';
  document.querySelector('#effect-none').checked = true;
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }
  resetScale();
};

export {form, addEventListenerImage, removeEventListenerImage, addFilter, removeFilters, scaleValueElement };
