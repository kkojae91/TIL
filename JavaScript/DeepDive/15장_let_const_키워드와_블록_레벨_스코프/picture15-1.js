let i = 10;

function foo() {
  let i = 100;

  for (let i = 1; i < 3; i++) {
    console.log(i);
  }

  console.log(i);
}

foo();

console.log(i);
