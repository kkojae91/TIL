const $container = document.querySelector(".container");
const $normalCount = document.querySelector(".normal-count");
const $throttleCount = document.querySelector(".throttle-count");

console.log("front");

let normalCount = 0;
$container.addEventListener("scroll", () => {
  $normalCount.textContent = ++normalCount;
});

const throttle = (callback, delay) => {
  let timerId;

  return (event) => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback(event);
      timerId = null;
    }, delay);
  };
};

const throttleCallback = (event) => {
  console.log(event);
  $throttleCount.textContent = ++throttleCount;
};

let throttleCount = 0;
$container.addEventListener("scroll", throttle(throttleCallback, 1000));

console.log("back");
