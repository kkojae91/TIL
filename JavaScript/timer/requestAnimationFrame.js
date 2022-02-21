function delay() {
  let startTime = new Date().getTime();
  let index = 1;

  return new Promise((resolve) => {
    const callback = () => {
      const currentTime = new Date().getTime();

      if (currentTime - 1000 * index > startTime) {
        index++;
        console.log("something2");
      }

      const rAFId = requestAnimationFrame(callback);

      if (index >= 4) {
        cancelAnimationFrame(rAFId);
        resolve();
      }
    };

    requestAnimationFrame(callback);
  });
}

async function doSomething() {
  console.log("something1");
  await delay();
  console.log("something3");
}

doSomething();
