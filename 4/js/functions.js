const lengthString = (checkedString = '', maxLength = 1) => checkedString.length <= maxLength;

lengthString('Строка', 20);

function isPalindrome (word) {
  const normalWord = word.replaceAll('', '').toLowerCase();
  let cleanString = '';
  for (let i = normalWord.length - 1; i >= 0; i--) {
    const char = normalWord[i];
    cleanString += char;
  }
  return normalWord === cleanString;
}
isPalindrome('Лёша на полке клопа нашёл ');
