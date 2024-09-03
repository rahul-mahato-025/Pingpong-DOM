document.addEventListener("DOMContentLoaded", () => {
  const gameArena = document.getElementById("game-arena");
  const startButton = document.querySelector("#start-game button");
  const arenaWidth = window.innerWidth;
  const arenaHeight = window.innerHeight;
  const padWidth = arenaWidth / 10;
  const padHeight = arenaHeight / 50;
  const ballSize = 20;
  let ballPosition = { x: arenaWidth / 2, y: arenaHeight / 2 };
  let topPadPosition = { x: arenaWidth / 2, y: 0 };
  let bottomPadPosition = { x: arenaWidth / 2, y: arenaHeight - padHeight };
  let gameStarted = false;
  let intervalId;
  let playerTurn = "player1";
  let gameSpeed = 40;
  let ballDy = -10;
  let ballDx = -10;
  let padVelocity = 20;
  let score = 0;

  function resetGame() {
    ballPosition = { x: arenaWidth / 2, y: arenaHeight / 2 };
    topPadPosition = { x: arenaWidth / 2, y: 0 };
    bottomPadPosition = { x: arenaWidth / 2, y: arenaHeight - padHeight };
    gameSpeed = 40;
    ballDy = -10;
    ballDx = 10;
    playerTurn = "player1";
    score = 0;
  }

  function increaseGameSpeed() {
    if (gameSpeed > 20 && score > 0 && score % 50 === 0) {
      clearInterval(intervalId);
      gameSpeed -= 5;
      gameloop();
    }
  }

  function drawDiv(x, y, className, id = "") {
    const div = document.createElement("div");
    div.classList.add(className);
    div.id = id;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    return div;
  }

  function drawBallAndPad() {
    gameArena.innerHTML = "";
    const topPad = drawDiv(
      topPadPosition.x,
      topPadPosition.y,
      "pad",
      "pad-top"
    );
    gameArena.appendChild(topPad);

    const bottomPad = drawDiv(
      bottomPadPosition.x,
      bottomPadPosition.y,
      "pad",
      "pad-bottom"
    );
    gameArena.appendChild(bottomPad);

    const ball = drawDiv(ballPosition.x, ballPosition.y, "ball", "ball");
    gameArena.appendChild(ball);
  }

  function drawGameOverModal() {
    const gameOverModal = drawDiv(
      arenaWidth / 2,
      arenaHeight / 2,
      "game-over",
      "game-over"
    );
    const h2 = document.createElement("h2");
    h2.textContent = "Game Over !!!";
    const h3 = document.createElement("h3");
    h3.textContent = `Your Score : ${score}`;
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    gameOverModal.appendChild(h2);
    gameOverModal.appendChild(h3);
    gameOverModal.appendChild(restartBtn);
    restartBtn.addEventListener("click", () => {
      resetGame();
      initialize();
    });
    document.body.style.cursor = "default";
    return gameOverModal;
  }

  function handleGameOver() {
    const gameOverModal = drawGameOverModal();
    gameArena.appendChild(gameOverModal);
    gameStarted = false;
  }

  function updateTopPad() {
    if (ballPosition.x <= padWidth / 2) {
      topPadPosition.x = 0;
    } else if (ballPosition.x + ballSize >= arenaWidth - padWidth / 2) {
      topPadPosition.x = arenaWidth - padWidth;
    } else {
      topPadPosition.x = ballPosition.x - padWidth / 2;
    }
  }

  function updateBall() {
    // If the ball collides with the left or right boundary, reverse the ball in the x direction.
    if (ballPosition.x <= 0 || ballPosition.x + ballSize >= arenaWidth)
      ballDx *= -1;
    // If the ball collides with the top pad, reverse the ball in the y direction.
    else if (
      ballPosition.y <= topPadPosition.y + padHeight &&
      ballPosition.x + ballSize >= topPadPosition.x &&
      ballPosition.x + ballSize <= topPadPosition.x + padWidth &&
      playerTurn === "player1"
    ) {
      ballDy *= -1;
      playerTurn = "player2";
    }
    // If the ball collides with the bottom pad, reverse the ball in the y direction and update the score and speed.
    else if (
      ballPosition.y + ballSize >= bottomPadPosition.y &&
      ballPosition.x + ballSize >= bottomPadPosition.x &&
      ballPosition.x + ballSize <= bottomPadPosition.x + padWidth &&
      playerTurn === "player2"
    ) {
      ballDy *= -1;
      score += 10;
      playerTurn = "player1";
      increaseGameSpeed();
    }
    // If the ball collides with the top or bottom boundary, create and show game over modal.
    else if (ballPosition.y < 0 || ballPosition.y >= arenaHeight)
      handleGameOver();

    // Update ball position according to the above calculations.
    ballPosition.x += ballDx;
    ballPosition.y += ballDy;
  }

  function updateBottomPad(e) {
    if (
      e.key === "ArrowRight" &&
      bottomPadPosition.x + padWidth <= arenaWidth
    ) {
      padVelocity = 30;
    } else if (e.key === "ArrowLeft" && bottomPadPosition.x > 0) {
      padVelocity = -30;
    } else {
      padVelocity = 0;
    }

    bottomPadPosition.x += padVelocity;
  }

  function gameloop() {
    intervalId = setInterval(() => {
      drawBallAndPad();
      updateTopPad();
      updateBall();
      if (gameStarted === false) clearInterval(intervalId);
    }, gameSpeed);
  }

  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      document.body.style.cursor = "none";
      document.addEventListener("keydown", updateBottomPad);
      gameloop();
    }
  }

  function initialize() {
    runGame();
  }

  startButton.addEventListener("click", () => initialize());
});
