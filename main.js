window.addEventListener('load', () => {
	rangeSliderElement.addEventListener('input', syncRangeSliderAndNumberInput);
	numberInputElement.addEventListener('input', syncRangeSliderAndNumberInput);
	formElement.addEventListener('submit', handleFormSubmit);
	copyPasswordButton.addEventListener('click', copyPasswordToClipboard);
});

const rangeSliderElement = document.getElementById('number-of-characters-range');
const numberInputElement = document.getElementById('number-of-characters');
const formElement = document.getElementById('password-generator-form');
const includeUppercaseCheckbox = document.getElementById('include-uppercase');
const includeNumbersCheckbox = document.getElementById('include-numbers');
const includeSymbolsCheckbox = document.getElementById('include-symbols');
const passwordDisplayElement = document.getElementById('password');
const copyPasswordButton = document.getElementById('copy-password');

const UPPERCASE_ASCII_RANGE = [{ from: 65, to: 90 }];
const LOWERCASE_ASCII_RANGE = [{ from: 97, to: 122 }];
const NUMBERS_ASCII_RANGE = [{ from: 48, to: 57 }];
const SYMBOLS_ASCII_RANGE = [
	{ from: 33, to: 47 },
	{ from: 58, to: 64 },
	{ from: 91, to: 96 },
	{ from: 123, to: 126 },
];

/*
 * Syncs the values of range slider and input number field whenever any one of them change
 */
const syncRangeSliderAndNumberInput = e => {
	const newValue = e.target.value;

	rangeSliderElement.value = newValue;
	numberInputElement.value = newValue;
};

/*
 * Handle form Submission
 * Generate Available character array
 * generate password
 * Set password to password field in DOM
 */
const handleFormSubmit = e => {
	e.preventDefault();

	const includeUppercase = includeUppercaseCheckbox.checked;
	const includeNumbers = includeNumbersCheckbox.checked;
	const includeSymbols = includeSymbolsCheckbox.checked;
	const passwordLength = +numberInputElement.value;

	const availableCharactersArray = generateAvailableCharacters(includeUppercase, includeNumbers, includeSymbols);

	const password = generatePassword(availableCharactersArray, passwordLength);

	passwordDisplayElement.innerText = password;

	if (password.length) copyPasswordButton.disabled = false;
	else copyPasswordButton.disabled = true;
};

/*
 * Generate Password based on array of characters supplied
 * takes array of available characters and length of password
 * returns password string
 */
const generatePassword = (availableCharactersArray, passwordLength) => {
	let password = '';

	for (let i = 0; i < passwordLength; i++) {
		password += availableCharactersArray[Math.floor(Math.random() * availableCharactersArray.length)];
	}

	return password;
};

/*
 * Generate Array of Characters to use for password generation
 * Takes values of checkboxes as argument
 * First, concatenates ranges of ascii values from globally defined value ranges of uppercase, lowercase and symbols
 * Generates Array of characters from final ascii ranges
 * Returns array of available Characters
 */
const generateAvailableCharacters = (includeUppercase, includeNumbers, includeSymbols) => {
	let availableCharactersAsciiRanges = LOWERCASE_ASCII_RANGE;
	let availableCharacters = [];

	if (includeUppercase) availableCharactersAsciiRanges = availableCharactersAsciiRanges.concat(UPPERCASE_ASCII_RANGE);
	if (includeNumbers) availableCharactersAsciiRanges = availableCharactersAsciiRanges.concat(NUMBERS_ASCII_RANGE);
	if (includeSymbols) availableCharactersAsciiRanges = availableCharactersAsciiRanges.concat(SYMBOLS_ASCII_RANGE);

	availableCharactersAsciiRanges.forEach(asciiRange => {
		for (let i = asciiRange.from; i <= asciiRange.to; i++) {
			availableCharacters.push(String.fromCharCode(i));
		}
	});

	return availableCharacters;
};

/*
 * Copy the geneated password to clipboard
 */
const copyPasswordToClipboard = () => {
	let timer;

	let dummyTextarea = document.createElement('textarea');
	dummyTextarea.value = passwordDisplayElement.innerText;
	document.body.appendChild(dummyTextarea);
	dummyTextarea.select();
	document.execCommand('Copy');
	dummyTextarea.remove();

	document.body.classList.add('password-copied');
	clearTimeout(timer);
	timer = setTimeout(() => {
		document.body.classList.remove('password-copied');
	}, 2000);
};
