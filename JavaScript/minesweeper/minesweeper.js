// JavaScript source code
let board = [];
let rows = 10;
let cols = 10;
let totalMines = 15;
let isGameOver = false;
let flagsPlaced = 0;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => { startGame(); });

function startGame() {
	// Получаем значения
	rows = parseInt(document.getElementById('rowsInput').value) || 10;
	cols = parseInt(document.getElementById('colsInput').value) || 10;
	totalMines = parseInt(document.getElementById('minesInput').value) || 15;

	// Ограничения безопасности
	if (totalMines >= (rows * cols)) {
		alert("Слишком много мин!");
		return;
	}
	
	isGameOver = false;
	document.getElementById('status-message').innerText = "Жги неверных!!!";
	document.getElementById('board').innerHTML = "";
	
	// Обновляем под новый размер
	const boardElement = document.getElementById('board');
	boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
	boardElement.style.gridTemplateRows = `repeat(${rows}, 30px)`;

	flagsPlaced = 0; // важно сбросить счётчик

	// Очистка старых флагов, если игра перезапускается без перезагрузки страницы
	const allCells = document.querySelectorAll('.cell');
	allCells.forEach(cell => {
		cell.classList.remove('flagged');
		cell.innerText = ''; // убираем текст, если был
		delete cell.dataset.isMine;      // <--- Обязательно!
		delete cell.dataset.neighbors;   // <--- Обязательно!
	});

	createBoard();
	placeMines();
	countNeighbors();
}

function createBoard() {
	board = [];
	for (let r = 0; r < rows; r++) {
		let rowArray = [];
		for (let c = 0; c < cols; c++) {
			let cell = document.createElement('div');
			cell.classList.add('cell');
			cell.dataset.row = r;
			cell.dataset.col = c;

			// Обработчик ЛКМ
			cell.addEventListener('mousedown', (e) => {
				if (isGameOver) return;
				handleLeftClick(cell, e);
			});

			// Обработчик ПКМ
			cell.addEventListener('contextmenu', (e) => {
				e.preventDefault(); // Запрещает стандартное меню браузера
				if (!isGameOver && !cell.classList.contains('opened')) {
					toggleFlag(cell);
				}
			});

			document.getElementById('board').appendChild(cell);
			rowArray.push(cell);
		}
		board.push(rowArray);
	}
}

function placeMines() {
	let minesPlaced = 0;
	while (minesPlaced < totalMines) {
		const r = Math.floor(Math.random() * rows);
		const c = Math.floor(Math.random() * cols);
		const cell = board[r][c];

		// Если мины еще нет
		if (!cell.dataset.isMine) {
			cell.dataset.isMine = 'true';
			minesPlaced++;
		}
	}
}

function countNeighbors() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0;  c < cols; c++) {
			if (board[r][c].dataset.isMine === 'true') continue;

			let count = 0;
			// Проверяем соседей
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					const nr = r + dr;
					const nc = c + dc;
					if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
						if (board[nr][nc].dataset.isMine === 'true') {
							count++;
						}
					}
				}
			}
			board[r][c].dataset.neighbors = count;
		}
	}
}

function handleLeftClick(cell, e) {
	// ВАЖНО: Проверяем, какая кнопка нажата. 
	// e.button === 0 -> Левая кнопка
	// e.button === 2 -> Правая кнопка
	if (e && e.button !== 0) {
		return; // Если это не левая кнопка (например, правая), ничего не делаем здесь.
		// Флаг обработается в contextmenu.
	}
	const r = parseInt(cell.dataset.row);
	const c = parseInt(cell.dataset.col);

	// Одновременное нажатие ЛКМ и ПКМ
	// Если клетка открыта и число вокруг равно количеству флагов -> открываем соседей
	if (cell.classList.contains('opened') && cell.innerText !== '') {
		const neighborCount = parseInt(cell.innerText);
		const flaggedNeighbors = getFlaggedNeighborsCount(r, c);

		if (neighborCount === flaggedNeighbors) {
			revealNeighbors(r, c);
			return;
		}
	}

	// Защита от открытия уже открытых или помеченных флагом клеток
	if (cell.classList.contains('opened') || cell.classList.contains('flagged')) {
		return;
	}

	//Обычная логика открытия
	if (cell.dataset.isMine === 'true') {
		gameOver(cell);
	}
	else {
		revealCell(r, c);
	}
}

function toggleFlag(cell) {
    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        flagsPlaced--;
    } else {
        cell.classList.add('flagged');
        flagsPlaced++;
    }
    checkWinCondition();
}

function revealCell(r, c) {
    const cell = board[r][c];

    if (cell.classList.contains('opened') || cell.classList.contains('flagged')) return;

    cell.classList.add('opened');

    const neighbors = parseInt(cell.dataset.neighbors);

    if (neighbors > 0) {
        cell.innerText = neighbors;
        // Добавляем цвет в зависимости от числа
        cell.classList.add(`color-${neighbors}`);
    } else {
        // Рекурсивно открываем пустые клетки
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealCell(nr, nc);
                }
            }
        }
    }
    checkWinCondition();
}

function revealNeighbors(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const neighborCell = board[nr][nc];
                if (!neighborCell.classList.contains('opened') && !neighborCell.classList.contains('flagged')) {
                    // Эмуляция клика для обработки мин и рекурсии
                    handleLeftClick(neighborCell, null);
                }
            }
        }
    }
}

function getFlaggedNeighborsCount(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (board[nr][nc].classList.contains('flagged')) {
                    count++;
                }
            }
        }
    }
    return count;
}

function gameOver(mineCell) {
    isGameOver = true;
    mineCell.classList.add('exploded');
    mineCell.innerText = '💥';

    document.getElementById('status-message').innerText = "Вы проиграли!";
    document.getElementById('status-message').style.color = "red";

    // Показать все мины
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].dataset.isMine === 'true') {
                board[r][c].classList.add('mine');
                board[r][c].innerText = '💣';
            }
        }
    }
}

function checkWinCondition() {
    let allNonMinesOpened = true;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = board[r][c];
            if (cell.dataset.isMine !== 'true' && !cell.classList.contains('opened')) {
                allNonMinesOpened = false;
                break;
            }
        }
    }

    if (allNonMinesOpened && !isGameOver) {
        isGameOver = true;
        document.getElementById('status-message').innerText = "Поздравляем! Вы выиграли!";
        document.getElementById('status-message').style.color = "green";
    }
}