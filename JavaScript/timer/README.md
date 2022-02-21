# setTimeout, setInterval, requestAnimation의 차이!

이글을 보기에 앞서 아래 링크의 글을 보고 오시기를 추천합니다.

> [Javascript로 sleep 함수 만들기 보러가기](https://kkojae.tistory.com/2)

- 문제: doSomething 함수를 만들고 something1을 출력한 후 something2를 1초에 1번씩 3번 출력하고 something3를 출력한 후 종료한다.

- 현재 문제를 setTimeout을 활용하여 해결한다면, 아래와 같은 코드로 작성할 수 있다.

  ```javascript
  function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async function doSomething() {
    console.log("something1");
    for (let i = 0; i < 3; i++) {
      await sleep(1000);
      console.log("something2");
    }
    console.log("something3");
  }

  doSomething();
  ```

  > 위 doSomething 함수는 async/awiat 키워드를 통해 반복문 블록안으로 들어와 1초 동안 코드가 잠든 후 console.log("something2")가 실행된다.
  >
  > 이때 sleep 함수 밑의 코드는 실행되지 않고 sleep 함수가 끝날때 까지 기다린 후 console.log("something2")가 실행된다.
  >
  > 따라서 처음에 내가 기대했던 출력을 sleep 함수를 새롭게 만들어 해결할 수 있었다.

- 이번에는 setInterval을 활용해 동일한 문제를 해결해보겠다.

  ```javascript
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
  ```

> setInterval을 사용하게 되면 반복문이 필요하지 않게된다. setInterval 역시 내부적으로 동작하는 원리는 setTimeout과 동일하기 때문에, promise와 async/await을 활용해 해당하는 비동기처리가 끝날때 까지 기다린 후 console.log("something3")이 실행되게 만들어 주면 된다.

- 이번에는 requestAnimationFrame을 활용해 동일한 문제를 해결해보자.

  ```javascript
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
  ```

  > requestAnimationFrame(이하 rAF)을 사용하게 되면 setInterval과 마찬가지로 반복문이 필요하지 않게된다. setInterval은 명시적으로 딜레이되는 밀리초(ms)를 작성하지만 rAF은 명시적으로 밀리초를 작성하지 않는다.
  >
  > 위의 차이점만 존재하는 것은 아니다. rAF는 setInterval에 비해 많은 장점들을 가지고 있다.

  1. 지금의 예제와는 맞는 이야기는 아니지만 rAF는 사용자의 사양에 맞는 FPS를 자동으로 설정하기 때문에, 사용자가 불편한 경험을 하지 않게 해준다.
  2. setInterval의 경우 백그라운드에서도 동작하지만 rAF는 백그라운드 동작 및 비활성화시 중지를 하여 성능을 최적화하고 유저에게 보이는 애니메이션만 작동시켜 CPU나 베터리 낭비를 하지 않게 된다.
  3. setInterval의 경우 callback함수가 태스크 큐에 저장되지만 rAF의 callback함수의 경우 태스크 큐보다 우선순위가 높은 애니메이션 큐에 저장되어 setInterval 보다 더 빠르게 동작할 수 있다.

  > setTimeout, setInterval과 내부적으로 동작하는 원리는 비슷하지만 callback함수가 task queue가 아닌 animation queue 저장되다는 점이 다르다. 그렇기 때문에 Promise와 async/await을 활용해 해당하는 비동기 처리가 완료 된후 console.log("something3")가 실행되게 만들어준다.

부족한 부분이나 잘못된 부분이 있다면 댓글로 남겨주시면 감사하겠습니다.
