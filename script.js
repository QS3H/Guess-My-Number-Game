"use strict";

const state = {
  secretNumber: 0,
  score: 20,
  highscore: localStorage.getItem("highscore") || 0,
  gameRange: { min: 1, max: 20 },
  timer: null,
  seconds: 0,
  isGameOver: false,
};

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

const updateTimer = function () {
  if (state.isGameOver) return;
  state.seconds++;
  const minutes = Math.floor(state.seconds / 60);
  const remainingSeconds = state.seconds % 60;
  document.querySelector(".time").textContent = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
};

const startNewGame = function () {
  const difficulty = document.getElementById("difficulty").value;
  switch (difficulty) {
    case "easy":
      state.gameRange = { min: 1, max: 10 };
      state.score = 10;
      break;
    case "hard":
      state.gameRange = { min: 1, max: 50 };
      state.score = 30;
      break;
    default:
      state.gameRange = { min: 1, max: 20 };
      state.score = 20;
  }

  document.querySelector(
    ".between"
  ).textContent = `(Between ${state.gameRange.min} and ${state.gameRange.max})`;
  document.querySelector(".guess").max = state.gameRange.max;
  document.querySelector(".guess").min = state.gameRange.min;

  state.secretNumber =
    Math.trunc(
      Math.random() * (state.gameRange.max - state.gameRange.min + 1)
    ) + state.gameRange.min;
  state.isGameOver = false;
  state.seconds = 0;

  displayMessage("Start guessing...");
  document.querySelector(".score").textContent = state.score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";
  document.querySelector(".highscore").textContent = state.highscore;
  document.querySelector(".hint").style.display = "none";
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";

  clearInterval(state.timer);
  state.timer = setInterval(updateTimer, 1000);
};

const showHint = function () {
  const guess = Number(document.querySelector(".guess").value);
  const distance = Math.abs(guess - state.secretNumber);
  let hint = "";

  if (distance > state.gameRange.max / 2) {
    hint = "You're very far!";
  } else if (distance > state.gameRange.max / 4) {
    hint = "Getting closer!";
  } else {
    hint = "Very close!";
  }
  displayMessage(hint);
  document.querySelector(".hint").style.display = "none";
};

// Event Listeners
document.querySelector(".check").addEventListener("click", function () {
  if (state.isGameOver) return;

  const guess = Number(document.querySelector(".guess").value);

  // When there is no input
  if (!guess) {
    displayMessage("⛔️ No number!");
    document.querySelector(".message").parentElement.classList.add("shake");
    setTimeout(() => {
      document
        .querySelector(".message")
        .parentElement.classList.remove("shake");
    }, 500);
  }
  // When guess is out of range
  else if (guess < state.gameRange.min || guess > state.gameRange.max) {
    displayMessage(
      `Number must be between ${state.gameRange.min} and ${state.gameRange.max}!`
    );
  }
  // When player wins
  else if (guess === state.secretNumber) {
    displayMessage("🎉 Correct Number!");
    document.querySelector(".number").textContent = state.secretNumber;
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";
    clearInterval(state.timer);
    state.isGameOver = true;

    if (state.score > state.highscore) {
      state.highscore = state.score;
      localStorage.setItem("highscore", state.highscore);
      document.querySelector(".highscore").textContent = state.highscore;
    }
  }
  // When guess is wrong
  else {
    if (state.score > 1) {
      displayMessage(
        guess > state.secretNumber ? "📈 Too high!" : "📉 Too low!"
      );
      state.score--;
      document.querySelector(".score").textContent = state.score;

      // Show hint button after 3 wrong guesses
      if (state.score <= state.gameRange.max - 3) {
        document.querySelector(".hint").style.display = "block";
      }
    } else {
      displayMessage("💥 You lost the game!");
      document.querySelector(".score").textContent = 0;
      clearInterval(state.timer);
      state.isGameOver = true;
    }
  }
});

document.querySelector(".again").addEventListener("click", startNewGame);
document.querySelector(".hint").addEventListener("click", showHint);
document.getElementById("difficulty").addEventListener("change", startNewGame);

// Keyboard support
document.querySelector(".guess").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    document.querySelector(".check").click();
  }
});

// Initialize game
document.querySelector(".highscore").textContent = state.highscore;
startNewGame();
