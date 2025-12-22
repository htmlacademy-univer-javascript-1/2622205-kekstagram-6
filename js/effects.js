const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const EFFECTS = {
  none: { filter: 'none', unit: '', min: 0, max: 100, step: 1 },
  chrome: { filter: 'grayscale', unit: '', min: 0, max: 1, step: 0.1 },
  sepia: { filter: 'sepia', unit: '', min: 0, max: 1, step: 0.1 },
  marvin: { filter: 'invert', unit: '%', min: 0, max: 100, step: 1 },
  phobos: { filter: 'blur', unit: 'px', min: 0, max: 3, step: 0.1 },
  heat: { filter: 'brightness', unit: '', min: 1, max: 3, step: 0.1 },
};

const uploadForm = document.querySelector('.img-upload__form');
const imageElement = uploadForm.querySelector('.img-upload__preview img');
const scaleValueInput = uploadForm.querySelector('.scale__control--value');
const scaleSmallerButton = uploadForm.querySelector('.scale__control--smaller');
const scaleBiggerButton = uploadForm.querySelector('.scale__control--bigger');

const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
const sliderElement = uploadForm.querySelector('.effect-level__slider');
const effectsList = uploadForm.querySelector('.effects__list');

let currentScale = DEFAULT_SCALE;


const updateScale = (value) => {
  currentScale = value;
  imageElement.style.transform = `scale(${value / 100})`;
  scaleValueInput.value = `${value}%`;
};

const onSmallerButtonClick = () => {
  const nextScale = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
  updateScale(nextScale);
};

const onBiggerButtonClick = () => {
  const nextScale = Math.min(currentScale + SCALE_STEP, MAX_SCALE);
  updateScale(nextScale);
};


noUiSlider.create(sliderElement, {
  range: { min: 0, max: 100 },
  start: 100,
  step: 1,
  connect: 'lower',
  format: {
    to: (value) => (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)),
    from: (value) => parseFloat(value),
  },
});

const applyEffect = (effectValue) => {
  const selectedEffect = effectsList.querySelector('input:checked').value;
  if (selectedEffect === 'none') {
    imageElement.style.filter = 'none';
    return;
  }

  const { filter, unit } = EFFECTS[selectedEffect];
  imageElement.style.filter = `${filter}(${effectValue}${unit})`;
  effectLevelValue.value = effectValue;
};

sliderElement.noUiSlider.on('update', () => {
  applyEffect(sliderElement.noUiSlider.get());
});

const onEffectChange = (evt) => {
  const effect = evt.target.value;

  if (effect === 'none') {
    effectLevelContainer.classList.add('hidden');
    imageElement.style.filter = 'none';
    return;
  }

  effectLevelContainer.classList.remove('hidden');
  const { min, max, step } = EFFECTS[effect];

  sliderElement.noUiSlider.updateOptions({
    range: { min, max },
    start: max,
    step,
  });
};


const addEventListenerImage = () => {
  scaleSmallerButton.addEventListener('click', onSmallerButtonClick);
  scaleBiggerButton.addEventListener('click', onBiggerButtonClick);
};

const removeEventListenerImage = () => {
  scaleSmallerButton.removeEventListener('click', onSmallerButtonClick);
  scaleBiggerButton.removeEventListener('click', onBiggerButtonClick);
};

const addFilter = () => {
  effectLevelContainer.classList.add('hidden');
  effectsList.addEventListener('change', onEffectChange);
  updateScale(DEFAULT_SCALE);
};

const removeFilters = () => {
  effectsList.removeEventListener('change', onEffectChange);
  updateScale(DEFAULT_SCALE);
  updateScale(DEFAULT_SCALE);
  imageElement.style.filter = 'none';
  uploadForm.querySelector('#effect-none').checked = true;
};

export { addEventListenerImage, removeEventListenerImage, addFilter, removeFilters };
