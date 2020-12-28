let activeCellId = 1;
let score = 0;
let foodCellList = [];
let foodCellEaten = [];
let killCellList = [];
const foodCount = 10;
const axisY = 10;
const axisX = 10;
const elementMain = document.querySelector('.main');
const elementScore = document.querySelector('.score');
const elementGrid = window.document.querySelector('.grid');

// Utils
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const createRandomFood = () => {
  for (let indexFood = 1; indexFood <= foodCount; indexFood++) {
    const randomNumber = getRandomInt(1, axisX * axisY);
    const randomCell = document.getElementById(randomNumber);

    if (randomNumber) {
      foodCellList = [...foodCellList, randomNumber];
      randomCell.classList.add('cell-food');
    }
  }
};

const printData = (element, string) => {
  element.innerHTML = string;
};

const removeClass = (element, classToReplace, newClass) => {
  element.classList.replace(classToReplace, newClass);
};

const restartGame = (message) => {
  window.document.querySelector('.grid').remove();
  foodCellList = [];
  killCellList = [];
  buildGrid();
  alert(message);
};

const createGridElement = () => {
  if (window.document.querySelector('.grid')) {
    window.document.querySelector('.grid').remove();
  }

  const gridElement = document.createElement('section');
  gridElement.classList.add('grid');

  return gridElement;
};

// Init
const buildGrid = () => {
  const gridElement = createGridElement();

  for (let index = 1; index <= axisY * axisX; index++) {
    gridElement.append(createCell(index));
  }

  elementMain.append(gridElement);
  createRandomFood();
  setActiveCell(activeCellId);
  window.setInterval(() => kill(), 900);
};

// Actions
const removePreviousActive = () => {
  const activeCells = document.querySelectorAll('.cell-active');

  if (activeCells.length)
    activeCells.forEach((cell) => {
      removeClass(cell, 'cell-active', 'cell');
    });
};

const eatFood = (cellId) => {
  const cellElement = document.getElementById(cellId);
  score = score + 10;
  foodCellEaten = [...foodCellEaten, cellId];
  removeClass(cellElement, 'cell-food', 'cell');
  printData(elementScore, score);

  if (foodCellEaten.length === foodCount) {
    restartGame('You win!');
  }
};

const setActiveCell = (cell, removePrevious = true) => {
  const cellElement = document.getElementById(cell);
  if (removePrevious) {
    removePreviousActive();
  }

  if (killCellList.includes(parseInt(cellElement.id, 10))) {
    restartGame('Game over');
  }

  cellElement.classList.add('cell-active');
  if (cellElement.classList.contains('cell-food')) {
    eatFood(cellElement.id);
  }
};

const createCell = (index) => {
  const newCell = document.createElement('div');
  newCell.classList.add('cell');
  newCell.setAttribute('id', index);
  newCell.setAttribute('position', index);
  newCell.onclick = function () {
    activeCellId = parseInt(this.id, 10);
    setActiveCell(activeCellId);
  };

  return newCell;
};

const actionKey = (event) => {
  const keyPressed = event.code;
  const keyList = {
    ArrowUp: activeCellId - 10,
    ArrowDown: activeCellId + 10,
    ArrowRight: activeCellId + 1,
    ArrowLeft: activeCellId - 1,
  };

  if (keyList[keyPressed]) {
    activeCellId = keyList[keyPressed];

    if (keyList[keyPressed] >= 1 && keyList[keyPressed] <= axisX * axisY) {
      setActiveCell(keyList[keyPressed]);
    }
  }
};

const kill = () => {
  const randomNumber = getRandomInt(1, axisX * axisY);
  const randomCell = document.getElementById(randomNumber);

  if (!foodCellList.includes(randomNumber) && randomCell) {
    randomCell.classList.add('cell-killer');
    killCellList = [...killCellList, randomNumber];
  }

  if (randomNumber === activeCellId) {
    return;
  }
};

document.addEventListener('keydown', actionKey);
