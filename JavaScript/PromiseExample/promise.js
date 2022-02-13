// promise 기본적인 예제...

function delayFunc(time) {
  return new Promise((resolve, reject) => {
    if (time > 5) {
      setTimeout(() => {
        resolve(`template<li>`);
      }, 2000);
    } else {
      reject("실패");
    }
  });
}

// console.log(typeof delayFunc);

delayFunc(10)
  .then((template) => {
    console.log(template);
    return delayFunc(6);
  })
  .then((template) => console.log(template))
  .catch((err) => console.log(err));
