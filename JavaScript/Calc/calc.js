// JavaScript source code
// Drag and Drop

const calcWindow = document.getElementById('calcWindow');
const handleWindow = document.getElementById('titlebar');
let isDrag = false;
let initX, initY, initLeft, initTop;

handleWindow.addEventListener('mousedown', (e) => {
	isDrag = true;
	initX = e.clientX;	// Запоминаем, где была мышь в момент нажатия
	initY = e.clientY;

	// Запоминаем координаты окна
	initLeft = calcWindow.getBoundingClientRect().left;
	initTop = calcWindow.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
	if (!isDrag) return;	// если не перемещаем, ничего не делаем
	e.preventDefault();		// отменяем стандартное поведение браузера
	const dX = e.clientX - initX;
	const dY = e.clientY - initY;
	// обновляем стили 
	calcWindow.style.left = `${initLeft + dX}px`;
	calcWindow.style.top = `${initTop + dY}px`;
});

document.addEventListener('mouseup', () => {
	isDrag = false;
});

// Close BTN
document.getElementById('closeBtn').addEventListener('click', () => {
	calcWindow.style.display = 'none';
});

////////////////////////////////////// CALC LOGIC ////////////////////////////////////////

const display = document.getElementById('display');

// Инициализируем переменные

let curInput = '0';
let prevInput = '';
let operation = null;
let resScreen = false;   // флаг. Показывает был ли получен результат(новая цифра сотрет предыдущую)
let mem = 0;
let lastOperand = null;

// Ищем все элементы на странице, которые кнопки
const buttons = document.querySelectorAll('button');
// Проходимся по каждому элементу в button попадает одна конкретная кнопка
buttons.forEach(button => {
	button.addEventListener('click', btnClick);
});

function btnClick(e) {
	const value = e.target.dataset.action || e.target.innerText;
	handleInput(value);
}

// Логика обработки в отдельной функции, чтобы её можно было вызывать и из кнопок, и с клавиатуры
function handleInput(value) {
	// Числа и точка
	if (/[0-9.]/.test(value)) {
		inputNum(value);
	}

	// Операции
	else if (['+','-','*','/'].includes(value)) {
		chooseOp(value);
	}

	// Равно
	else if (value === '=') {
		if (resScreen && lastOperand !== null) {
			// ПОВТОР ОПЕРАЦИИ: 2 + 3 = (5), потом снова "=" -> 5 + 3 = 8
			// Восстанавливаем текущее значение, которое было до последнего =
			curInput = lastOperand.toString();
			calculate();
		} else {
			calculate();
		}
	}

	// Backspace
	else if (value === 'Backspace') {
		backspace();
	}

	// C
	else if (value === 'C') {
		clear();
	}

	// CE
	else if (value === 'CE') {
		clearEntry();
	}

	// Память
	else if (value === 'MC') mem = 0;
	else if (value === 'MR') { curInput = mem.toString(); updateDisplay(); }
	else if (value === 'MS') mem = parseFloat(curInput);
	else if (value === 'M+') mem += parseFloat(curInput);

	// Спец кнопки
	else if (value === 'sqrt')	calcSqrt();
	else if (value === '%')		calcPer();
	else if (value === 'rec')	calcRec();
	else if (value === '+/-')	toggleSign();
}


// Обработчик клавиатуры
document.addEventListener('keydown', (e) => {
	let keyVal = e.key;

	if (keyVal === 'Enter')		keyVal = '=';
	if (keyVal === 'Backspace') keyVal = 'Backspace';
	if (keyVal === 'Escape')	keyVal = 'C';
	if (keyVal === 'Delete') keyVal = 'Backspace';

	// Пропускаем модификаторы
	if (e.ctrlKey || e.altKey || e.metalKey) return;

	handleInput(keyVal);

	// Ищем кнопку, соответствующую нажатой клавише
	const button = Array.from(document.querySelectorAll('.calc-buttons button')).find(
		btn => btn.textContent.trim() === keyVal || btn.value === keyVal
	);

	if (button) {
		button.classList.add('active'); // добавляем класс для эффекта нажатия

		// Убираем класс через 150 мс (имитация отпускания кнопки)
		setTimeout(() => {
			button.classList.remove('active');
		}, 150);
	}
});

function inputNum(num) {

	// Если результат был показан или ввод был "0" и мы вводим не "0", то начинаем новый ввод, но обрабатываем "0." отдельно

	if (resScreen) {
		curInput = (num === '.') ? '0.' : num;
		resScreen = false;
	}
	else if (curInput === '0') {
		if (num === '0') {
			// Оставляем "0", не нужно ничего менять
			// (или можно ничего не делать вообще)
		}
		else if (num === '.') {
			curInput = '0.';
		}
		else {
			curInput = num; // Ввели цифру после "0": заменяем "0" на эту цифру, чтобы не было "05";
		}
	}
	else {
		if (num === '.' && curInput.includes('.')) return; // проверяем дубликат точки
		curInput += num;
	}
	updateDisplay();
}

function chooseOp(op) {
	if (resScreen) {
		operation = op;
		lastOperand = null; // сброс, т.к. мы начинаем новую операцию
		return;
	}
	if (prevInput !== '' && operation !== null && !resScreen) {
		calculate();
		// После calculate() prevInput уже содержит результат, operation = null
		// Теперь мы можем сразу установить новую операцию
		operation = op;
		lastOperand = parseFloat(curInput); // запоминаем текущее число как операнд
		resScreen = true;
		return;
	}
	prevInput = curInput;
	operation = op;
	resScreen = true;
	lastOperand = parseFloat(prevInput);
}

function calculate() {
	let res;
	const prev = parseFloat(prevInput);
	const cur = parseFloat(curInput);

	// Если операция не выбрана, ничего не делаем (защита от лишнего =)
	if (!operation) return;

	if (isNaN(prev) || isNaN(cur)) return;

	switch (operation) {
		case '+':
			res = prev + cur;
			break;
		case '-':
			res = prev - cur;
			break;
		case '*':
			res = prev * cur;
			break;
		case '/':
			if (cur === 0) {
				alert('На ноль делить нельзя');
				clear();
				return;
			}
			res = prev / cur;
			break;
		default:
			return;
	}

	curInput = String(res);
	// Сохраняем результат в prevInput, чтобы можно было продолжить вычисления
	prevInput = String(res); 
	// Сохраняем последний операнд (текущее число перед нажатием =) для повтора
	lastOperand = cur; 
	
	resScreen = true;
	updateDisplay();
}

function clear() {
	curInput = '0';
	prevInput = '';
	operation = null;
	resScreen = false;
	updateDisplay();
}

function clearEntry() {
	curInput = '0';
	resScreen = false;
	updateDisplay();
}

function backspace() {
	if (resScreen) return;
	if (curInput.length > 1) {
		curInput = curInput.slice(0, -1);
	}
	else {
		curInput = '0';
	}
	updateDisplay();
}

function calcSqrt() {
	const val = parseFloat(curInput);
	if (val >= 0) {
		curInput = Math.sqrt(val).toString();
		updateDisplay();
		resScreen = true;
	}
	else {
		alert('Число ддолжно быть положительным');
	}
}

function calcPer() {
	const val = parseFloat(curInput);
	if (prevInput && operation) {
		// Процент от предыдущего числа
		const perVal = (val / 100) * parseFloat(prevInput);
		curInput = perVal.toString();
		calculate();
	}
	else {
		curInput = (val / 100).toString();
		updateDisplay();
		resScreen = true;
	}
}

function calcRec() {
	const val = parseFloat(curInput);
	if (val !== 0) {
		curInput = (1 / val).toString();
		updateDisplay();
		resScreen = true;
	}
	else {
		alert('Деление на ноль невозможно');
	}
}

function toggleSign() {
	if (curInput !== '0') {
		curInput = (parseFloat(curInput) * -1).toString();
		updateDisplay();
	}
}

function updateDisplay() {
	display.value = curInput;
}