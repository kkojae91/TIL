const $container = document.querySelector(".container");
const $normalCount = document.querySelector(".normal-count");
const $throttleCount = document.querySelector(".throttle-count");

let normalCount = 0;
$container.addEventListener("scroll", () => {
  $normalCount.textContent = ++normalCount;
});

const throttle = (callback, delayTime) => {
  let timerId;

  return () => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback();
      timerId = null;
    }, delayTime);
  };
};

const throttleCallback = () => {
  console.log();
  $throttleCount.textContent = ++throttleCount;
};

let throttleCount = 0;
$container.addEventListener("scroll", throttle(throttleCallback, 1000));
