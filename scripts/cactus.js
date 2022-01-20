import { GROUND_X_VELOCITY } from "./grounds.js";
import { randomNumber, Timer } from "./utils.js";

const MAX_CACTUS_INTERVAL = 2000;
const MIN_CACTUS_INTERVAL = 300;
let CURRENT_MIN_CACTUS_INTERVAL = 1000;
const MIN_CACTUS_INTERVAL_DECREASE_TIME = 0.02;

export default class Cactus {
  static cactusElems = [];

  #timer;

  setUp = () => {
    Cactus.cactusElems.forEach((elem) => elem.remove());
    Cactus.cactusElems = [];

    CURRENT_MIN_CACTUS_INTERVAL = 1000;

    if (this.#timer) this.#timer.resetTime();
    else
      this.#timer = new Timer(
        randomNumber(CURRENT_MIN_CACTUS_INTERVAL, MAX_CACTUS_INTERVAL),
        () => {
          const newCactusEl = document.createElement("img");
          newCactusEl.src = "./images/cactus.png";
          newCactusEl.classList.add("cactus");
          document.querySelector(".game").append(newCactusEl);

          Cactus.cactusElems.push(newCactusEl);

          this.#timer.maxTime = randomNumber(
            CURRENT_MIN_CACTUS_INTERVAL,
            MAX_CACTUS_INTERVAL
          );
        }
      );
  };

  update = (delta, gameSpeed) => {
    if (
      CURRENT_MIN_CACTUS_INTERVAL > MIN_CACTUS_INTERVAL &&
      CURRENT_MIN_CACTUS_INTERVAL -
        MIN_CACTUS_INTERVAL_DECREASE_TIME * delta * gameSpeed >
        MIN_CACTUS_INTERVAL
    )
      CURRENT_MIN_CACTUS_INTERVAL -=
        MIN_CACTUS_INTERVAL_DECREASE_TIME * delta * gameSpeed;

    this.#timer.checkTime(delta * gameSpeed);

    Cactus.cactusElems.forEach((elem, i) => {
      const styles = getComputedStyle(elem);

      if (parseFloat(styles.getPropertyValue("--right")) >= 100) {
        elem.remove();
        Cactus.cactusElems = Cactus.cactusElems.filter(
          (_, index) => index !== i
        );
      }

      elem.style.setProperty(
        "--right",
        parseFloat(styles.getPropertyValue("--right")) +
          GROUND_X_VELOCITY * delta * gameSpeed
      );
    });
  };
}
