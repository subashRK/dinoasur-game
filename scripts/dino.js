import { Timer } from "./utils.js";

const NEXT_SPRITE_TIME = 150;
const SPRITE_NAME_PREFIX = "./images/dino-run-";
const TOTAL_SPRITES_COUNT = 2;
const MAX_Y_VELOCITY = 13;
const GRAVITY = 0.05;

export default class Dino {
  #currentSpriteCount;
  #timer;
  #isJumping;
  #yVelocity;

  constructor(elem) {
    this.elem = elem;
  }

  setUp = () => {
    this.#currentSpriteCount = 1;
    this.#isJumping = false;
    this.#yVelocity = 0;

    this.elem.style.setProperty("--bottom", 0);

    if (this.#timer) this.#timer.resetTime();
    else
      this.#timer = new Timer(NEXT_SPRITE_TIME, () => {
        if (this.#isJumping) {
          this.elem.src = "./images/dino-stationary.png";
          return;
        }

        this.elem.src =
          SPRITE_NAME_PREFIX +
          (this.#currentSpriteCount % TOTAL_SPRITES_COUNT) +
          ".png";
        this.#currentSpriteCount++;
      });

    const handleJump = (e) => {
      if ((e.code !== "Space" && e.code) || this.#isJumping) return;
      this.#yVelocity = MAX_Y_VELOCITY;
      this.#isJumping = true;
    };

    document.removeEventListener("keydown", handleJump);
    document.addEventListener("keydown", handleJump);
    document.removeEventListener("click", handleJump);
    document.addEventListener("click", handleJump);
  };

  update = (delta, gameSpeed) => {
    this.#timer.checkTime(delta * gameSpeed);

    if (this.#isJumping) this.jump(delta);
  };

  jump = (delta) => {
    const bottom = parseInt(
      getComputedStyle(this.elem).getPropertyValue("--bottom")
    );

    if (bottom + this.#yVelocity < 0) {
      this.elem.style.setProperty("--bottom", 0);
      this.#isJumping = false;
      return;
    }

    if (bottom === 0 && this.#yVelocity < 0) {
      this.#isJumping = false;
      return;
    }

    this.elem.style.setProperty("--bottom", bottom + this.#yVelocity);
    this.#yVelocity -= GRAVITY * delta;
  };

  rect = () => this.elem.getBoundingClientRect();

  die = () => (this.elem.src = "./images/dino-lose.png");
}
