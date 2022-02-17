# JS로 Sleep Function 만들기

- 문제: doSomething 함수를 만들고 something1을 출력한 후 something2를 1초에 1번씩 3번 출력하고 something3를 출력한 후 종료한다.

  - setTimeout 함수를 사용하면 간다하게 처리할 수 있다고 생각했고, 작성한 코드는 아래와 같다.
  - 내가 기대하는 것처럼 동작하지 않는다.

  ```javascript
  function doSomething() {
    console.log("something1");
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        console.log("something2");
      }, 1000);
    }
    console.log("something3");
  }

  doSomething();
  ```

  > 위 예제의 doSomething 함수를 만들고 나는 console에 아래와 같이 출력되기를 기대했다.

  ```
  something1
  1초를 기다리고 something2
  1초를 기다리고 something2
  1초를 기다리고 something2
  something3
  ```

  > 하지만, 실제 동작은 기대하는 것과는 다르게 출력되었다.

  ```
  something1
  something3
  1초를 기다리고 something2
  something2
  something2
  ```

- 원인 : 위 상황을 정확하게 이해하기 많은 지식들이 동반되어야겠지만,
  실행 컨텍스트, 이밴트 루프, 콜스택, 태스크 큐, 마이크로 태스크 큐에 대한 기본적인 지식이 필요한 것 같다.
  (실행 컨텍스트에 대해서는 사전 지식이 있다 가정하고 정리해보려한다.)

  - 콜 스택(call stack)
    실행 컨텍스트 스택 이 바로 콜 스택이다.
    함수를 호출하면 함수 실행 컨텍스트가 순차적으로 콜 스택에 푸시되어 순차적으로 실행된다. 자바스크립트 엔진은 단 하나의 콜 스택을 사용하기 때문에 최상위 실행 컨텍스트(실행 중인 실행 컨텍스트)가 종료되어 콜 스택에서 제거되기 전까지는 다른 어떤 태스크도 실행되지 않는다.

  - 태스크 큐(task queue/event queue/callback queue)
    setTimeout이나 setInterval과 같은 비동기 함수의 콜백 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역이다. 태스크 큐와는 별도로 프로미스의 후속 처리 메서드의 후속 처리 메서드의 콜백함수가 일시적으로 보관되는 마이크로태스크 큐도 존재한다.
  - 마이크로 태스크 큐(microtask queue/job queue)
    마이크로 태스크 큐는 태스크 큐와는 별도의 큐다. 마이크로태스크 큐에는 프로미스의 후속 처리 메서드의 콜백 함수가 일시 저장된다. 그 외의 비동기 함수의 콜백 함수나 이밴트 핸들러는 태스크 큐에 일시 저장된다.
    콜백 함수나 이벤트 핸들러를 일시 저장한다는 점에서 태스크 큐와 동일하지만 마이크로태스크 큐는 태스크 큐보다 우선순위가 높다. 즉, 이벤트 루프는 콜 스택이 비면 먼저 마이크로태스크 큐에서 대기하고 있는 함수를 가져와 실행한다. 이후 마이크로태스크 큐가 비면 태스크 큐에서 대기하고 있는 함수를 가져와 실행한다.
  - 이벤트 루프(event loop)
    이벤트 루프는 브라우저에 내장되어 있는 기능 중 하나다.
    이벤트 루프는 콜 스택에 현재 실행 중인 실행 컨텍스트가 있는지, 그리고 태스크 큐에 대기 중인 함수(콜백 함수, 이벤트 핸들러 등)가 있는지 반복해서 확인한다. 만약 콜 스택이 비어 있고 태스크 큐에 대기 중인 함수가 있다면 이밴트 루프는 순차적(FIFO, First In First Out)으로 태스크 큐에 대기 중인 함수를 콜 스택으로 이동시킨다. 이때 콜 스택으로 이동한 함수는 실행된다. 즉, 태스크 큐에 일시 보관된 함수들은 비동기 처리 방식으로 동작한다.

  ```javascript
  function doSomething() {
    console.log("something1");
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        console.log("something2");
      }, 1000);
    }
    console.log("something3");
  }

  doSomething();
  ```

  > 위 예제가 브라우저 환경에서 어떻게 동작하는지 하나씩 살펴 보자

  1. 전역 코드가 평가되어 전역 실행 컨텍스트가 생성되고 콜 스택에 푸시된다.
  2. 전역 코드가 실행되기 시작하여 doSomething 함수를 실행한다.
  3. doSomething함수가 평가되어 doSomething 실행 컨텍스트가 생성되고 콜 스택에 푸시된다.
  4. doSomething 함수 코드가 실행되기 시작하여 console.log("something1")을 출력한다.
  5. (for문 첫번째 루프) setTimeout 함수가 호출된다. 이때 setTimeout 함수의 함수 실행 컨텍스트가 생성되고 콜스택에 푸시되어 현재 실행 중인 실행 컨텍스트가 된다.
  6. setTimeout 함수가 실행되면 콜백 함수를 호출 스케줄링하고 종료되어 콜 스택에서 팝된다.
  7. 브라우저가 수행하는 7-1과 자바스크립트 엔진이 수행하는 7-2는 병행 처리된다.
     7-1. 브라우저는 타이머를 설정하고 타이머의 만료를 기다린다. 이후 타이머(1000ms)가 만료되면 콜백 함수가 태스크 큐에 푸시된다. 이처리 또한 자바스크립트 엔진이 아니라 브라우저가 수행한다. 이처럼 setTimeout 함수로 호출 스케줄링한 콜백 함수는 정확히 지연 시간 후에 호출된다는 보장은 없다. 지연 시간 이후에 콜백 함수가 태스크 큐에 푸시되어 대기하게 되지만 콜 스택이 비어야 호출되므로 약간의 시간차가 발생할 수 있기 때문이다.
     7-2. (for문 두번째 루프) setTimeout 함수가 호출된다. 이때 setTimeout 함수의 함수 실행 컨텍스트가 생성되고 콜스택에 푸시되어 현재 실행 중인 실행 컨텍스트가 된다. 그리고 setTimeout 함수가 실행되면 콜백 함수를 호출 스케줄링하고 종료되어 콜 스택에서 팝된다.
  8. 위와 같이 반복문이 종료될때까지 반복된다고 생각해주면 된다. 반복문이 종료되면 console.log("something3")를 호출하고 doSomething 실행 컨텍스트가 팝되고, 전역 실행 컨텍스트가 팝된다.
  9. 이벤트 루프에 의해 콜 스택이 비어 있음이 감지되고 태스크 큐에서 대기 중인 for문의 콜백 함수가 이벤트 루프에 의해 콜 스택에 (FIFO 방식으로) 푸시되고 현재 실행 중인 실행 컨텍스트가 된다.
  10. console.log("something2")가 출력된 이후 for문의 콜백 함수가 종료되어 콜 스택에서 팝된다.
  11. 이후 모든 태스크 큐에 있는 for문의 콜백 함수가 콜 스택에 푸쉬 되고 팝되기를 반복해서 최종적으로 콜스택이 비게 된다.

  > 자바스크립트가 위와 같은 순서로 동작하기 때문에 기대하는 것과는 다르게 console에 출력이 된다.

- 해결 : 프로미스와 async/await을 이용해 sleep function을 만들어 비동기 처리 방식으로 해결했다.

  - 프로미스(promise)
    ES6에서 비동기 처리를 위한 또 다른 패턴으로 프로미스를 도입했다. 프로미스는 전통적인 콜백 패턴이 가진 단점을 보완하며 비동기 처리 시점을 명확하게 표현할 수 있다는 장점이 있다.
  - async/await
    async와 await은 프로미스를 기반으로 동작한다. async/await를 사용하면 프로미스의 then/catch 후속 메서드에 콜백 함수를 전달해서 비동기 처리 결과를 후속 처리할 필요 없이 마치 동기 처럼 프로미스를 사용할 수 있다. 다시 말해, 프로미스의 후속 처리 메서드 없이 마치 동기 처럼 프로미스가 처리 결과를 반환하도록 구현할 수 있다.

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

  ```
  something1
  1초 후 something2
  1초 후 something2
  1초 후 something2
  something3
  ```

참고 도서 - 모던 자바스크립트 Deep Dive
