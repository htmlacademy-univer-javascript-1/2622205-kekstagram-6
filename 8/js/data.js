import {getRandomInteger, getRandomArrayElement} from './util.js';

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Вероника', 'Витя', 'Милана', 'Никита', 'Марат',
  'Елена', 'Алексей', 'Ольга', 'Иван', 'Наталья',
  'Павел', 'Виктория', 'Михаил', 'Юлия', 'Андрей'
];

// Массив описаний для фотографий
const DESCRIPTIONS = [
  'Прекрасный закат на море',
  'Горный пейзаж ранним утром',
  'Улицы старого города',
  'Лесная тропинка после дождя',
  'Архитектура современного мегаполиса',
  'Уютный домашний интерьер',
  'Яркий городской фестиваль',
  'Тихая деревенская улочка',
  'Невероятный вид с высоты птичьего полета',
  'Макросъемка цветов в саду',
  'Зимний лес в инее',
  'Морской причал в тумане',
  'Уличное искусство и граффити',
  'Традиционная кухня разных стран',
  'Животные в их естественной среде'
];

// Функция для генерации уникального идентификатора
function createIdGenerator () {
  let lastGeneratedId = 0;
  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
}

const generatePhotoId = createIdGenerator();
const generateCommentId = createIdGenerator();

// Функция для генерации одного комментария
const generateComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

// Функция для генерации массива комментариев
const generateComments = () => Array.from({length: getRandomInteger(0, 30)}, generateComment);

// Функция для генерации одного объекта с фотографией
const generatePhoto = () => {
  const id = generatePhotoId();
  return {
    id: id,
    url: `photos/${id}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInteger(15, 200),
    comments: generateComments()
  };
};

// Функция для создания массива из 25 объектов
const generatePhotosArray = () => Array.from({length: 25}, generatePhoto);

export {generatePhotosArray};
