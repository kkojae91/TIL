function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function doSomething() {
  console.log("something1");
  for (let i = 0; i < 5; i++) {
    await sleep(1000);
    console.log("something2");
  }
  console.log("something3");
}

// doSomething();

function doSomething2() {
  console.log("something1");
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log("something2");
    }, 1000);
  }
  console.log("something3");
}

doSomething2();
