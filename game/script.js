import { DURATION, TIMER, ALPHABET, LEVELS } from "../constants";

let lvlDisplay = document.querySelector("#lvl");
let timeDisplay = document.querySelector("#time");
let cornersDisplay = Object.values(document.getElementsByClassName("corner"));
let topDisplay = document.querySelector(".top");
let bottomDisplay = document.querySelector(".bottom");
let boardDisplay = document.querySelector("#board");

let fourLetters = [];
let letter = "";
let randomInRange = 0;
let interval = 0;
let level = 1;

function render(lvl, seconds, rang, roundTrip, negativeOffset) {
  const [min, max] = rang;

  fourLetters.length = 0;
  lvlDisplay.innerHTML = `${lvl}`;
  randomInRange = Math.floor(Math.random() * (max - min) + min);
  cornersDisplay.forEach((el) => el.addEventListener("click", lvlUp));

  startTimer(seconds, timeDisplay);
  setLettersInTheCorners();
  setCentralLetter(negativeOffset);
}

function startTimer(duration, display) {
  let timer = duration;
  let minutes;
  let seconds;

  interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(interval);
      timer = duration;
      topDisplay.remove();
      bottomDisplay.remove();
      boardDisplay.innerHTML = "Game Over";
    }
  }, 1000);
}

function setLettersInTheCorners() {
  letter = setRandomLetter();

  function setRandomLetter() {
    return ALPHABET[
      Math.floor(
        Math.random() * (ALPHABET.length - randomInRange) + randomInRange
      )
    ];
  }

  function shuffleFourLetters() {
    fourLetters.sort(() => Math.random() - 0.5);
  }

  cornersDisplay.forEach((corner) => {
    corner.innerHTML = letter;
    fourLetters.push(letter);
    letter = setRandomLetter();
  });
  shuffleFourLetters();
  letter = fourLetters[fourLetters.length - 1];
}

function setCentralLetter(negativeOffset) {
  if (negativeOffset && randomInRange % 2) {
    const index = ALPHABET.indexOf(letter) - randomInRange;
    const centralLetter =
      index < ALPHABET.length
        ? ALPHABET[index + ALPHABET.length]
        : ALPHABET[index];
    boardDisplay.innerHTML = `${centralLetter} + ${randomInRange}`;
  } else {
    const index = ALPHABET.indexOf(letter) + randomInRange;
    const centralLetter =
      index > ALPHABET.length - 1
        ? ALPHABET[index - ALPHABET.length]
        : ALPHABET[index];
    boardDisplay.innerHTML = `${centralLetter} - ${randomInRange}`;
  }
}

function lvlUp(e) {
  let sec = +timeDisplay.innerHTML.slice(3);
  let duration;

  if (e.target.innerHTML === letter) {
    duration = sec + TIMER;
  } else {
    duration = sec - TIMER;
    level--;
  }

  clearInterval(interval);

  if (level < LEVELS.length) {
    render(
      LEVELS[level].label,
      duration,
      LEVELS[level].range,
      LEVELS[level].roundTrip,
      LEVELS[level].negativeOffset
    );
    level++;
  } else {
    localStorage.setItem("lvl", +localStorage.getItem("lvl") + level);
    level = +localStorage.getItem("lvl");
    topDisplay.remove();
    bottomDisplay.remove();
    boardDisplay.id = "";
    boardDisplay.innerHTML = "your number of correct answers is " + level;
    boardDisplay.addEventListener("click", function () {
      window.location.href =
        "file:///Users/m1/Desktop/InScpoe/Alphabet%20game%20JS/index.html";
    });
  }
}

window.onload = () =>
  render(
    LEVELS[0].label,
    DURATION,
    LEVELS[0].range,
    LEVELS[0].roundTrip,
    LEVELS[0].negativeOffset
  );
