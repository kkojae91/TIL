# JS로 Sleep Function 만들기

- 예제 :

  - something1을 출력한 후 something2를 1초에 한 번씩 5번 출력하고 something3를 출력해라.
  - setTimeout함수를 사용하면 쉽게 해결할 수 있다고 생각해서 바로 적용할 경우 생각했던 것과 동일하게 출력되지 않는다.
  - 내가 첫 번째로 오해해서 작성했던 코드는 아래와 같다.

    ```javascript
    function doSomething() {
      console.log("something1");
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          console.log("something2");
        }, 1000);
      }
      console.log("something3");
    }

    doSomething();
    ```

    > setTimeout은 1000ms 후에 콜백 함수가 즉시 호출되는 것을 보장해주지 않는다. 1000ms 시간은 마이크로 태스크 큐에 콜백 함수를 등록하는 시간을 지연할 뿐이다. 마이크로 태스크 큐에 들어간 콜백 함수들은 이밴트 루프에 의해 콜스택의 모든 함수들이 종료된 이후에 큐에 들어있는 콜백 함수들이 순차적으로 실행되기 때문에 위 예제의 경우 something1, something3, something2 \* 5가 동시에 쭉 출력된다.

  - 위와 같은 오류를 범하지 않기 위해서는 비동기 처리 함수를 만들어 주어야 한다.
  - async/await을 활용하면 쉽게 만들 수 있다.

    ```javascript
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

    doSomething();
    ```

    > async/await을 활용해여 반복문 안에 sleep 함수를 넣어 1000ms 씩 지연을 시켜주면 기대했던 것과 동일하게 출력이 된다. something1, 1000ms 후 something2, 1000ms 후 something2, 1000ms 후 something2, 1000ms 후 something2, 1000ms 후 something2, something3가 순차적으로 출력된다.
    >
    > 위 예제를 온전히 이해하기 위해서는 이밴트 루프와 콜스택, 태스크 큐, 마이크로 태스트 큐, promise에 대해 추가적으로 학습을 해야할 필요가 있다.
