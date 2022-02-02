# 46장. 제너레이터와 async/await

## 46.1 제너레이터란?

- ES6에서 도입된 제너레이터(generator)는 코드 블록의 실행을 일시 중지했다가 필요한 시점에 재개할 수 있는 특수한 함수다.
  - 제너레이터와 일반 함수의 차이는 다음과 같다.
  1. 제너레이터 함수는 함수 호출자에게 함수 실행의 제어권을 양도할 수 있다.
  - 일반 함수를 호출하면 제어권이 함수에게 넘어가고 함수 코드를 일괄 실행한다. 즉, 함수 호출자(caller)는 함수를 호출한 이후 함수 실행을 제어할 수 없다.
  - 제너레이터 함수는 함수 실행을 함수 호출자가 제어할 수 있다. 다시 말해, 함수 호출자가 함수 실행을 일시 중지시키거나 재개시킬 수 있다.
    - 이는 함수의 제어권을 함수가 독점하는 것이 아니라 함수 호출자에게 양도(yield)할 수 있다는 것을 의미한다.
  2. 제너레이터 함수는 함수 호출자와 함수의 상태를 주고받을 수 있다.
  - 일반 함수를 호출하면 매개변수를 통해 함수 외부에서 값을 주입받고 함수 코드를 일괄 실행하여 결과값을 함수 외부로 반환한다. 즉, 함수가 실행되고 있는 동안에는 함수 외부에서 함수 내부로 값을 전달하여 함수의 상태를 변경할 수 없다.
  - 제너레이터 함수는 함수 호출자와 양방향으로 함수의 상태를 주고받을 수 있다. 다시 말해, 제너레이터 함수는 함수 호출자에게 상태를 전달할 수 있고 함수 호출자로부터 상태를 전달받을 수도 있다.
  3. 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
  - 일반 함수를 호출하면 함수 코드를 일괄 실행하고 값을 반환한다.
  - 제너레이터 함수를 호출하면 함수 코드를 실행하는 것이 아니라 이터러블이면서 동시에 이터레이터인 제너레이터 객체를 반환한다.

## 46.2 제너레이터 함수의 정의

- 제너레이터 함수는 function\* 키워드로 선언한다.

  - 그리고 하나 이상의 yield 표현식을 포함한다.

    ```javascript
    // 제너레이터 함수 선언문
    function* genDecFunc() {
      yield 1;
    }

    // 제너레이터 함수 표현식
    const genExpFunc = function* () {
      yield 1;
    };

    // 제너레이터 메서드
    const obj = {
      *genObjMethod() {
        yield 1;
      },
    };

    // 제너레이터 클래스 메서드
    class MyClass {
      *genClsMethod() {
        yield 1;
      }
    }
    ```

  - 에스터리스크(\*)의 위치는 function 키워드와 함수 이름 사이라면 어디든지 상관없다.

    - 하지만 일관성을 유지하기 위해 function 키워드 바로 뒤에 붙이는 것을 권장한다.

  - 제너레이터 함수는 화살표 함수로 정의할 수 없다.

    ```javascript
    const genArrowFunc = * () => {
      yield 1;
      // SyntaxError: Unexpected token '*'
    }
    ```

  - 제너레이터 함수는 new 연산자와 함께 생성자 함수로 호출할 수 없다.

    ```javascript
    function* genFunc() {
      yield 1;
    }

    new genFunc(); // TypeError: genFunc is not a constructor
    ```

## 46.3 제너레이터 객체

- 제너레이터 함수를 호출하면 일반 함수처럼 함수 코드 블록을 실행하는 것이 아니라 제너레이터 객체를 생성해 반환한다.

  - 제너레이터 함수가 반환한 제너레이터 객체는 이터러블(iterable)이면서 동시에 이터레이터(iterator)다.
  - 제너레이터 객체는 next 메서드를 가지는 이터레이터이므로 Symbol.iterator 메서드를 호출해서 별도로 이터레이터를 생성할 필요가 없다.

  ```javascript
  // 제너레이터 함수
  function* genFunc() {
    yield 1;
    yield 2;
    yield 3;
  }

  // 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
  const generator = genFunc();

  // 제너레이터 객체는 이터러블이면서 동시에 이터레이터다.
  // 이터러블은 Symbol.iterator 메서드를 직접 구현하거나 프로토타입 체인을 통해 상속받은 객체다.
  console.log(Symbol.iterator in generator); // true
  // 이터레이터는 next 메서드를 갖는다.
  console.log("next" in generator); // true
  ```

- 제너레이터 객체는 next 메서드를 갖는 이터레이터이지만 이터레이터에는 없는 returnm throw 메서드를 갖는다.

  - 제너레이터 객체의 세 개의 메서드를 호출하면 다음과 같이 동작한다.

    - next 메서드를 호출하면 제너레이터 함수의 yield 표현식까지 코드 블록을 실행하고 yield된 값을 value 프로퍼티 값으로, false를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.
    - return 메서드를 호출하면 인수로 전달받은 값을 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.

      ```javascript
      function* genFunc() {
        try {
          yield 1;
          yield 2;
          yield 3;
        } catch (e) {
          console.error(e);
        }
      }

      const generator = genFunc();

      console.log(generator.next()); // {value: 1, done: false}
      console.log(generator.return("End!")); // {value: 'End!', done: true}
      ```

    - throw 메서드를 호출하면 인수로 전달받은 에러를 발생시키고 undefined를 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.

      ```javascript
      function* genFunc() {
        try {
          yield 1;
          yield 2;
          yield 3;
        } catch (e) {
          console.error(e);
        }
      }

      const generator = genFunc();

      console.log(generator.next()); // {value: 1, done: false}
      console.log(generator.throw("Error!")); // {value: undefined, done: true}
      ```

## 46.4 제너레이터의 일시 중지와 재개

- 제너레이터는 yield 키워드와 next 메서드를 통해 실행을 일시 중지했다가 필요한 시점에 다시 재개할 수 있다.

  - yield 키워드는 제너레이터 함수의 실행을 일시 중지시키거나 yield 키워드 뒤에 오는 표현식의 평가 결과를 제너레이터 함수 호출자에게 반환한다.

    ```javascript
    // 제너레이터 함수
    function* genFunc() {
      yield 1;
      yield 2;
      yield 3;
    }

    // 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
    // 이터러블이면서 동시에 이터레이터인 제너레이터 객체는 next 메서드를 갖는다.
    const generator = genFunc();

    // 처음 next 메서드를 호출하면 첫 번째 yield 표현식까지 실행되고 일시 중지된다.
    // next 메서드는 이터레이터 리절트 객체({value, done})를 반환한다.
    // value 프로퍼티에는 첫 번째 yield 표현식에서 yield된 값 1이 할당된다.
    // done 프로퍼티에는 제너레이터 함수가 끝까지 실행되었는지를 나타내는 false가 할당된다.
    console.log(generator.next()); // {value: 1, done: false}

    // 다시 next 메서드를 호출하면 두 번째 yield 표현식까지 실행되고 일시 중지된다.
    // next 메서드는 이터레이터 리절트 객체({value, done})를 반환한다.
    // value 프로퍼티에는 두 번재 yield 표현식에서 yield 된 값 2가 할당된다.
    // done 프로퍼티에는 제너레이터 함수가 끝까지 실행되었는지를 나타내는 false가 할당된다.
    console.log(generator.next()); // {value: 2, done: false}

    // 다시 next 메서드를 호출하면 세 번째 yield 표현식까지 실행되고 일시 중지된다.
    // next 메서드는 이터레이터 리절트 객체({value, done})를 반환한다.
    // value 프로퍼티에는 세 번째 yield 표현식에서 yield된 값 3이 할당된다.
    // done 프로퍼티에는 제너레이터 함수가 끝까지 실행되었는지를 나타내는 false가 할당된다.
    console.log(generator.next()); // {value: 3, done: false}

    // 다시 next 메서드를 호출하면 남은 yield 표현식이 없으므로 제너레이터 함수의 마지막까지 실행한다.
    // next 메서드는 이터레이터 리절트 객체({value, done})를 반환한다.
    // value 프로퍼티에는 제너레이터 함수의 반환값 undefined가 할당된다.
    // done 프로퍼티에는 제너레이터 함수가 끝까지 실행되었음을 나타내는 true가 할당된다.
    console.log(generator.next()); // {value: undefined, done: true}
    ```

    > 제너레이터 객체의 next 메서드를 호출하면 yield 표현식까지 실행되고 일시 중지(suspend)된다. 이때 함수의 제어권이 호출자로 양도(yield)된다. 이때 제너레이터 객체의 next 메서드는 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환한다. next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 yield 표현식에서 yield된 값(yield 키워드 뒤의 값)이 할당되고 done 프로퍼티에는 제너레이터 함수가 끝까지 실행되었는지를 나타내는 불리언 값이 할당된다.

  - 이터레이터의 next 메서드와 달리 제너레이터 객체의 next 메서드에는 인수를 전달할 수 있다.

    - 제너레이터 객체의 next 메서드에 전달한 인수는 제너레이터 함수의 yield 표현식을 할당받는 변수에 할당된다.
    - yield 표현식을 할당받는 변수에 yield 표현식의 평가 결과가 할당되지 않는 것에 주의!!

    ```javascript
    function* genFunc() {
      // 처음 next 메서드를 호출하면 첫 번째 yield 표현식까지 실행되고 일시 중지된다.
      // 이때 yield된 값 1은 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에 할당된다.
      // x 변수에는 아직 아무것도 할당되지 않았다. x 변수의 값은 next 메서드가 두 번재 호출될 때 결정된다.
      const x = yield 1;

      // 두 번째 next 메서드를 호출할 때 전달한 인수 10은 첫 번째 yield 표현식을 할당받는
      // x변수에 할당된다. 즉, const x = yield 1;은 두 번째 next 메서드를 호출했을 때 완료된다.
      // 두 번째 next 메서드를 호출하면 두 번째 yield 표현식 까지 실행되고 일시 중지된다.
      // 이때 yield된 값 x + 10은 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에 할당된다.
      const y = yield x + 10;

      // 세 번째 next 메서드를 호출할 때 전달한 인수 20은 두 번째 yield 표현식을 할당받는 y 변수에 할당된다.
      // 즉, const y = yield (x+10);는 세 번째 next 메서드를 호출했을 때 완료된다.
      // 세 번째 next 메서드를 호출하면 함수 끝까지 실행된다.
      // 이때 제너레이터 함수의 반환값 x + y는 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에 할당된다.
      // 일반적으로 제너레이터의 반환값은 의미가 없다.
      // 따라서 제너레이터에서는 값을 반환할 필요가 없고 return은 종료의 의미로만 사용해야 한다.
      return x + y;
    }

    // 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
    // 이터러블이며 동시에 이터레이터인 제너레이터 객체는 next 메서드를 갖는다.
    const generator = genFunc(0);

    // 처음 호출한 next 메서드에는 인수를 전달하지 않는다.
    // 만약 처음 호출하는 next 메서드에 인수를 전달하면 무시된다.
    // next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 첫 번째 yield된 값 1이 할당된다.
    let res = generator.next();
    console.log(res); // {value: 1, done: false}

    // next 메서드에 인수로 전달한 10은 genFunc 함수의 x 변수에 할당된다.
    // next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 두 번째 yield된 값 20이 할당된다.
    res = generator.next(10);
    console.log(res); // {value: 20, done: false}

    // next 메서드에 인수로 전달한 20은 genFunc 함수의 y 변수에 할당된다.
    // next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 제너레이터 함수의 반환값 30이 할당된다.
    res = generator.next(20);
    console.log(res); // {value: 30, done: true}
    ```

    > 이처럼 제너레이터 함수는 next 메서드와 yield 표현식을 통해 함수 호출자와 함수의 상태를 주고받을 수 있다. 함수 호출자는 next 메서드를 통해 yield 표현식까지 함수를 실행시켜 제너레이터 객체가 관리하는 상태(yield된 값)을 꺼내올 수 있고, next 메서드에 인수를 전달해서 제너레이터 객체에 상태(yield 표현식을 할당받는 변수)를 밀어넣을 수 있다.

## 46.5 제너레이터의 활용

### 46.5.1 이터러블의 구현

- 제너레이터 함수를 사용하면 이터레이션 프로토콜을 준수해 이터러블을 생성하는 방식보다 간단히 이터러블을 구현할 수 있다.

  - 먼저 이터레이션 프로토콜을 준수하여 무한 피보나치 수열을 생성하는 함수를 구현해보자.

    ```javascript
    // 무한 이터러블을 생성하는 함수
    const infiniteFibonacci = (function () {
      let [pre, cur] = [0, 1];

      return {
        [Symbol.iterator]() {
          return this;
        },
        next() {
          [pre, cur] = [cur, pre + cur];
          // 무한 이터러블이므로 done 프로퍼티를 생략한다.
          return {
            value: cur,
          };
        },
      };
    })();

    // infiniteFibonacci는 무한 이터러블이다.
    for (const num of infiniteFibonacci) {
      if (num > 1000) {
        break;
      }
      console.log(num); // 1 2 3 5 8 ... 2584 4181 6765
    }
    ```

  - 이번에는 제너레이터를 사용하여 무한 피보나치 수열을 생성하는 함수를 구현해 보자.

    - 제너레이터 함수를 사용하면 이터레이션 프로토콜을 준수해 이터러블을 생성하는 방식보다 간단히 이터러블을 구현할 수 있다.

    ```javascript
    // 무한 이터러블을 생성하는 제너레이터 함수
    const infiniteFibonacci = (function* () {
      let [pre, cur] = [0, 1];

      while (true) {
        [pre, cur] = [cur, pre + cur];
        yield cur;
      }
    })();

    // infiniteFibonacci는 무한 이터러블이다.
    for (const num of infiniteFibonacci) {
      if (num > 10000) {
        break;
      }

      console.log(num); // 1 2 3 5 8 ... 2584 4181 6765
    }
    ```

### 46.5.2 비동기 처리

- 제너레이터 함수는 next 메서드와 yield 표현식을 통해 함수 호출자와 함수 상태를 주고 받을 수 있다.

  - 이러한 특성을 활용하면 프로미스를 사용한 비동기 처리를 동기 처럼 구현할 수 있다.
  - 다시 말해, 프로미스의 후속 처리 메서드 then/catch/finally 없이 비동기 처리 결과를 반환하도록 구현할 수 있다.

    ```javascript
    // node-fetch는 Node.js 환경에서 window.fetch 함수를 사용하기 위한 패키지다.
    // 브라우저 환경에서 이 예제를 실행한다면 아래 코드는 필요 없다.
    // https://github.com/node-fetch/node-fetch
    const fetch = require("node-fetch");

    // 제너레이터 실행기
    const async = (generatorFunc) => {
      const generator = generatorFunc(); // 2.

      const onResolved = (arg) => {
        const result = generator.next(arg); // 5.

        return result.done
          ? result.value // 9 .
          : result.value.then((res) => onResolved(res)); // 7.
      };

      return onResolved; // 3.
    };

    async(function* fetchTodo() {
      // 1.
      const url = "https://jsonplaceholder.typicode.com/todos/1";

      const response = yield fetch(url); // 6.
      const todo = yield response.json(); // 8.
      console.log(todo);
      // {userId: 1, id: 1, title: 'delectus aut autem', completed: false}
    })(); // 4.
    ```
