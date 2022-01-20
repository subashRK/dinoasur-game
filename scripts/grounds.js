export const GROUND_X_VELOCITY = 0.05;
const GROUND_WIDTH = 300;

export default class Grounds {
  constructor(elem1, elem2) {
    this.elems = [elem1, elem2];
  }

  setUp = () => {
    this.elems.forEach((elem, i) =>
      i === 0
        ? elem.style.setProperty("--left", 0)
        : elem.style.setProperty("--left", GROUND_WIDTH)
    );
  };

  update = (delta, gameSpeed) => {
    this.elems.forEach((elem, i) => {
      if (
        parseFloat(getComputedStyle(elem).getPropertyValue("--left")) <=
        -GROUND_WIDTH
      )
        elem.style.setProperty(
          "--left",
          parseFloat(
            getComputedStyle(this.elems[(i + 1) % 2]).getPropertyValue("--left")
          ) + GROUND_WIDTH
        );

      elem.style.setProperty(
        "--left",
        parseFloat(getComputedStyle(elem).getPropertyValue("--left")) +
          GROUND_X_VELOCITY * delta * gameSpeed * -1
      );
    });
  };
}
