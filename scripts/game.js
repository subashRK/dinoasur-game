import Cactus from "./cactus.js";
import Dino from "./dino.js";
import Grounds from "./grounds.js";
import { Timer } from "./utils.js";

const GAME_SPEED_INCREASE_TIME = 0.00001;
const SCORE_INCREASE_INTERVAL = 100;

const startTextElem = document.querySelector(".start-text");
const highScoreElem = document.querySelector(".high-score");
const scoreElem = document.querySelector(".current-score");

const dino = new Dino(document.querySelector(".dino"));
const grounds = new Grounds(
  document.querySelector("[data-ground-1]"),
  document.querySelector("[data-ground-2]")
);
const cactus = new Cactus();

let gameSpeed = 1;
let score = 0;
let highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
let lastTime;

highScoreElem.textContent = Math.floor(highScore);

const isCollide = (rect1, rect2, sizeReductionValue = 0) => {
  return (
    rect1.bottom > rect2.top + sizeReductionValue &&
    rect1.left < rect2.right - sizeReductionValue &&
    rect1.right > rect2.left + sizeReductionValue &&
    rect1.top < rect2.bottom - sizeReductionValue
  );
};

const isLost = () => {
  const dinoRect = dino.rect();

  return Cactus.cactusElems.some((elem) =>
    isCollide(dinoRect, elem.getBoundingClientRect(), 10)
  );
};

const handleLost = () => {
  if (score > JSON.parse(localStorage.getItem("highScore")))
    localStorage.setItem("highScore", JSON.stringify(score));

  dino.die();
  startTextElem.classList.remove("hide");

  document.addEventListener("keydown", handleStart, { once: true });
  document.addEventListener("click", handleStart, { once: true });
};

const update = (time) => {
  let delta;

  if (!lastTime) {
    lastTime = time;
    return requestAnimationFrame(update);
  }

  if (isLost()) return handleLost();

  delta = time - lastTime;
  lastTime = time;
  gameSpeed += GAME_SPEED_INCREASE_TIME * delta;
  score += (delta * gameSpeed) / SCORE_INCREASE_INTERVAL;

  scoreElem.textContent = Math.floor(score);
  if (score > highScore) {
    highScore = score;
    highScoreElem.textContent = Math.floor(score);
  }

  grounds.update(delta, gameSpeed);
  dino.update(delta, gameSpeed);
  cactus.update(delta, gameSpeed);

  requestAnimationFrame(update);
};

const handleStart = () => {
  document.removeEventListener("click", handleStart, { once: true });
  document.removeEventListener("keydown", handleStart, { once: true });

  startTextElem.classList.add("hide");

  dino.setUp();
  grounds.setUp();
  cactus.setUp();

  lastTime = null;
  gameSpeed = 1;
  score = 0;

  highScoreElem.textContent = Math.floor(highScore);
  scoreElem.textContent = Math.floor(score);

  requestAnimationFrame(update);
};

document.addEventListener("keydown", handleStart, { once: true });
document.addEventListener("click", handleStart, { once: true });
