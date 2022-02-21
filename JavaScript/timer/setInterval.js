function delay() {
  let count = 0;

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      console.log("something2");
      count++;

      if (count >= 3) {
        clearInterval(intervalId);
        resolve();
      }
    }, 1000);
  });
}

async function doSomething() {
  console.log("something1");
  await delay();
  console.log("something3");
}

doSomething();
