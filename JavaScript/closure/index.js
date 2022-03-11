function sum(x) {
  return function (y) {
    return x + y;
  };
}

const add = sum(2);
console.log(add(3)); // ??

function counter() {
  let count = 0;

  return {
    increase() {
      count++;
    },
    decrease() {
      count--;
    },
    value() {
      return count;
    },
  };
}

const kkojaeCounter = counter();
console.log(kkojaeCounter);
kkojaeCounter.increase();
kkojaeCounter.increase();
kkojaeCounter.increase();
console.log(kkojaeCounter.value());
kkojaeCounter.decrease();
console.log(kkojaeCounter.value());
