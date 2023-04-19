let gameBoard = document.querySelector(".game-board"),
  scoreElement = document.querySelector(".score"),
  highScoreElement = document.querySelector(".high-score"),
  arrowBtns = document.querySelectorAll(".controls i"),
  snakeBiteAudio = new Audio('./sound/snakehit.mp3');
  gameOverAudio = new Audio('./sound/gameover.mp3');

let isGameOver = false,
  setIntervalId,
  foodX,
  foodY,
  velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let snakeX = 10,
  snakeY = 20;
let score = 0;

let highScore = localStorage.getItem("high-score");
highScoreElement.innerText = `High score: ${highScore}`;

// Changing the position of food item
const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

// Changing the direction of snake
const moveSnake = (e) => {
  if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    moveSnake({
      key: btn.dataset.key,
    });
  });
});

// Game Over Function
const handleGameOver = () => {
  clearInterval(setIntervalId);
  gameOverAudio.play();
  alert("Game over..! Press OK to replay");
  location.reload();
};

// Defining the init food function
const initFood = () => {
  if (isGameOver) return handleGameOver();
  let htmlMarkup = `<div class='food' style='grid-area:${foodY} / ${foodX}'></div>`;

  snakeX += velocityX;
  snakeY += velocityY;

  // Checking snake hitting the bounding, if hits then game over
  if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
    isGameOver = true;
  }

  // Checking snake hits the food that time change the food position and add snakeBody
  if (snakeX === foodX && snakeY === foodY) {
    snakeBiteAudio.play();
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;
    highScore = score > highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    highScoreElement.innerText = `High score: ${highScore}`;
    scoreElement.innerText = `Score: ${score}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class='snake' style='grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}'></div>`;

    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      isGameOver = true;
    }
  }
  gameBoard.innerHTML = htmlMarkup;
};

document.addEventListener("keydown", moveSnake);

changeFoodPosition();
// initFood();
setIntervalId = setInterval(initFood, 150);
