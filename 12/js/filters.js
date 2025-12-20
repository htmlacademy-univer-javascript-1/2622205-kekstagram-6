const RANDOM_PICTURES_COUNT = 10;
const filterElement = document.querySelector('.img-filters');
const filterForm = filterElement.querySelector('.img-filters__form');

const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const sortRandomly = () => Math.random() - 0.5;
const sortByComments = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const getFilteredPictures = (pictures, filterId) => {
  switch (filterId) {
    case Filter.RANDOM:
      return [...pictures].sort(sortRandomly).slice(0, RANDOM_PICTURES_COUNT);
    case Filter.DISCUSSED:
      return [...pictures].sort(sortByComments);
    default:
      return [...pictures];
  }
};

const initFilter = (data, callback) => {
  filterElement.classList.remove('img-filters--inactive');

  const onFilterAction = (evt) => {
    const target = evt.target;

    if (!target.classList.contains('img-filters__button')) {
      return;
    }

    if (target.classList.contains('img-filters__button--active') && target.id !== Filter.RANDOM) {
      return;
    }

    filterForm.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    target.classList.add('img-filters__button--active');
    callback(getFilteredPictures(data, target.id));
  };

  filterForm.addEventListener('click', onFilterAction);
  filterForm.addEventListener('mouseover', onFilterAction);
};

export { initFilter };
