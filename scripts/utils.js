export class Timer {
  constructor(maxTime, callback) {
    this.time = maxTime;
    this.maxTime = maxTime;
    this.callback = callback;
  }

  checkTime = (decrementTime) => {
    if (this.time <= 0) {
      this.callback();
      this.time = this.maxTime;
    } else {
      this.time -= decrementTime;
    }
  };

  resetTime = () => {
    this.time = this.maxTime;
  };
}

export function randomNumber(min, max) {
  return Math.random() * (max - min + 1) + min;
}
