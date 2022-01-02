# 18장 함수와 일급 객체

## 18.1 일급 객체

- `일급 객체`

  1. `무명의 리터럴로 생성`할 수 있다. 즉, 런타임에 생성이 가능하다.
  2. `변수나 자료구조(객체, 배열 등)에 저장`할 수 있다.
  3. `함수의 매개변수에 전달`할 수 있다.
  4. `함수의 반환값으로 사용`할 수 있다.

  - 자바스크립트의 함수는 1 ~ 4 모두 만족하므로 일급 객체이다.

  ```javascript
  // 1. 함수는 무명의 리터럴로 생성할 수 있다.
  // 2. 함수는 변수에 저장할 수 있다.
  // 런타임(할당 단계)에 함수 리터럴이 평가되어 함수 객체가 생성되고 변수에 할당된다.
  const increase = function (num) {
    return ++num;
  };

  const decrease = function (num) {
    return --num;
  };

  // 2. 함수는 객체에 저장할 수 있다.
  const predicates = { increase, decrease };

  // 3. 함수의 매개변수에 전달할 수 있다.
  // 4. 함수의 반환값으로 사용할 수 있다.
  function makeCounter(predicate) {
    let num = 0;

    return function () {
      num = predicate(num);
      return num;
    };
  }

  // 3. 함수는 매개변수에게 함수를 전달할 수 있다.
  const increaser = makeCounter(predicates.increase);
  console.log(increaser()); // 1
  console.log(increaser()); // 2

  // 3. 함수는 매개변수에게 함수를 전달할 수 있다.
  const decreaser = makeCounter(predicates.decrease);
  console.log(decreaser()); // -1
  console.log(decreaser()); // -2
  ```

  > 함수가 일급 객체라는 것은 함수를 객체와 동일하게 사용할 수 있다는 의미다. 따라서 함수는 값을 사용할 수 있는 곳(`변수 할당문`, `객체의 프로퍼티 값`, `배열의 요소`, `함수 호출의 인수`, `함수 반환문`)이라면 어디서든지 리터럴로 정의할 수 있으며 `런타임(runtime)에 함수 객체로 평가`된다.

- 일급 객체로서 함수가 가지는 가장 큰 특징 2가지

  - 일반 객체와 같이 함수의 `매개변수에 전달`할 수 있다.
  - `함수의 반환값으로 사용`할 수 있다.

- 일반 객체와 함수 객체의 차이점
  - 일반 객체는 호출할 수 없지만, `함수 객체는 호출`할 수 있다. 그리고 함수 객체는 일반 객체에는 없는 `함수 고유의 프로퍼티를 소유`한다.

## 18.2 함수 객체의 프로퍼티

```javascript
function square(number) {
  return number * number;
}

console.log(Object.getOwnPropertyDescriptors(square));
/*
{
  length: {value: 1, writable: false, enumerable: false, configurable: true}
  name: {value: "square", writable: false, enumerable: false, configurable: true}
  arguments: {value: null, writable: false, enumerable: false, configurable: false}
  caller: {value: null, writable: false, enumerable: false, configurable: false}
  prototype: {value: {...}, writable: true, enumerable: false, configurable: false}
}
*/

// __proto__는 square 함수의 프로퍼티가 아니다.
console.log(Object.getOwnPropertyDescriptor(square, "__proto__")); // undefined

// __proto__는 Object.prototype 객체의 접근자 프로퍼티다.
// square 함수는 Object.prototype 객체로부터 __proto__ 접근자 프로퍼티를 상속받는다.
console.log(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__"));
// {get: f, set: f, enumerable: false, configurable: true}
```

> 이처럼 `arguments`, `caller`, `length`, `name`, `prototype` 프로퍼티는 모두 `함수 객체의 데이터 프로퍼티`다. 이들은 일반 객체에는 없는 함수 객체의 고유의 프로퍼티다.
>
> 하지만 `__proto__`는 `접근자 프로퍼티`이며, 함수 객체 고유의 프로퍼티가 아니라 `Object.prototype 객체의 프로퍼티를 상속받은 것`을 알 수 있다. Object.prototype 객체의 프로퍼티는 `모든 객체가 상속받아 사용`할 수 있다. 즉, Object.prototype 객체의 `__proto__접근자 프로퍼티`는 `모든 객체가 사용`할 수 있다.

### 18.2.1 argmuents 프로퍼티

- 함수 객체의 arguments 프로퍼티 값은 arguments 객체다.
- arguments 객체는 `함수 호출시 전달된 인수(argument)들의 정보`를 담고 있는 `순회 가능`한(iterable) `유사 배열 객체`이며, 함수 내부에서 `지역 변수처럼 사용`된다.

- 자바스크립트는 함수의 매개변수와 인수의 개수가 일치하는지 확인하지 않는다.

  - 따라서 함수 호출 시 매개변수 개수만큼 인수를 전달하지 않아도 에러가 발생하지 않는다.

  ```javascript
  function multiply(x, y) {
    console.log(arguments);
    return x * y;
  }

  console.log(multiply()); // NaN
  console.log(multiply(1)); // NaN
  console.log(multiply(1, 2)); // 2
  console.log(multiply(1, 2, 3)); // 2
  ```

  > 함수를 정의할 때 선언한 `매개변수는 함수 몸체 내부에서 변수와 동일하게 취급`된다. 즉, 함수가 호출되면 함수 몸체 내에서 암묵적으로 매개변수가 선언되고 undefined로 초기화된 이후 인수가 할당된다.

- arguments 객체는 매개변수 개수를 확정할 수 없는 `가변 인자 함수를 구현할 때 유용`하다.

  ```javascript
  function sum() {
    let res = 0;

    // arguments 객체는 length 프로퍼티가 있는 유사 배열 객체이므로 for 문으로 순회할 수 있다.
    for (let i = 0; i < arguments.length; i++) {
      res += arguments[i];
    }

    return res;
  }

  console.log(sum()); // 0
  console.log(sum(1, 2)); // 3
  console.log(sum(1, 2, 3)); // 6
  ```

  > arguments 객체는 배열 형태로 인자 정보를 담고 있지만 실제 배열이 아닌 `유사 배열 객체(array-like object)`다. 유사 배열 객체란 length 프로퍼티를 가진 객체로 for문으로 순회할 수 있는 객체를 말한다.

- 유사 배열 객체는 배열이 아니므로 배열 메서드를 사용할 경우 에러가 발생한다.
- 배열 메서드를 사용하려면 `Function.prototype.call`, `Function.prototype.apply`를 사용해 `간접 호출`해야 한다.

  ```javascript
  function sum() {
    // arguments 객체를 배열로 변환
    const array = Array.prototype.slice.call(arguments);
    return array.reduce(function (pre, cur) {
      return pre + cur;
    }, 0);
  }

  console.log(sum(1, 2)); // 3
  console.log(sum(1, 2, 3, 4, 5)); // 15
  ```

  - ES6 에서는 Rest 파라미터가 도입되어 이러한 번거로움을 해결했다.

  ```javascript
  function sum(...args) {
    return args.reduce((pre, cur) => pre + cur, 0);
  }

  console.log(sum(1, 2)); // 3
  console.log(sum(1, 2, 3, 4, 5)); // 15
  ```

### 18.2.2 caller 프로퍼티

- caller 프로퍼티는 ECMAScript 사양에 포함되지 않은 비표준 프로퍼티다. (사용 X)
- 함수 객체의 `caller 프로퍼티는 함수 자신을 호출한 함수를 가리킨다.`

  ```javascript
  function foo(func) {
    return func();
  }

  function bar() {
    return "caller : " + bar.caller;
  }

  // 브라우저에서의 실행한 결과
  console.log(foo(bar)); // caller : function foo(func) {...}
  console.log(bar()); // caller : null
  ```

  > 위 결과는 브러우저에서 실행한 결과이고, Node.js에서 위 예제를 실행하면 다른 결과가 나온다. 48장 모듈에서 자세히 알아보자.

### 18.2.3 length 프로퍼티

- 함수 객체의 `length 프로퍼티`는 `함수를 정의할 때 선언한 매개변수의 개수`를 가리킨다.

  ```javascript
  function foo() {}
  console.log(foo.length); // 0

  function bar(x) {
    return x;
  }
  console.log(bar.length); // 1

  function baz(x, y) {
    return x * y;
  }
  console.log(baz.length); // 2
  ```

  > arguments 객체의 length 프로퍼티는 인자의 개수를 가리키고, 함수 객체의 length 프로퍼티는 매개 변수의 개수를 가리킨다.

### 18.2.4 name 프로퍼티

- 함수 객체의 `name 프로퍼티는 함수 이름`을 나타낸다.
- name 프로퍼티는 ES6 이후 정식 표준이 되었다.
- 주의점 :

  - `익명 함수 표현식`의 경우 `ES5 에서 name 프로퍼티는 빈문자열을 값`으로 갖는다.
  - `익명 함수 표현식`의 경우 `ES6에서는 함수 객체를 가리키는 식별자를 값`으로 갖는다.

  ```javascript
  // 기명 함수 표현식
  var namedFunc = function foo() {};
  console.log(namedFunc.name); // foo

  // 익명 함수 표현식
  var anonymousFunc = function () {};
  // ES5 : name 프로퍼티는 빈 문자열을 값으로 갖는다.
  // ES6 : name 프로퍼티는 함수 객체를 가리키는 변수 이름을 값으로 갖는다.
  console.log(anonymousFunc.name); // anonymousFunc

  // 함수 선언문(Function declaration)
  function bar() {}
  console.log(bar.name); // bar
  ```

### 18.2.5 `__proto__접근자 프로퍼티`

- 모든 객체는 [[Prototype]]이라는 내부 슬롯을 갖는다.
- `__proto__프로퍼티`는 [[Prototype]] 내부 슬롯이 가리키는 프로토타입 객체에 접근하기 위해 사용하는 접근자 프로퍼티다.
- [[Prototype]] 내부슬롯에 직접 접근할 수 없으며 `__proto__ 접근자 프로퍼티`를 통해 `간접적으로 프로토타입 객체에 접근`할 수 있다.

  ```javascript
  const obj = { a: 1 };

  // 객체 리터럴 방식으로 생성한 객체의 프로토타입 객체는 Object.prototype이다.
  console.log(obj.__proto__ === Object.prototype); // true

  // 객체 리터럴 방식으로 생성한 객체는 프로토타입 객체인 Object.prototype의 프로퍼티를 상속받는다.
  // hasOwnProperty 메서드는 Object.prototype의 메서드다.
  console.log(obj.hasOwnProperty("a")); // true
  console.log(obj.hasOwnProperty("__proto__")); // false
  ```

- 📄 hasOwnProperty 메서드
  > hasOwnProperty 메서드는 이름에서 알 수 있듯이 인수로 전달받은 `프로퍼티 키가 객체 고유의 프로퍼티 키인 경우에만 true를 반환`하고 `상속받은 프로토타입의 프로퍼티 키인 경우 false를 반환`한다.

### 18.2.6 prototype 프로퍼티

- `prototype 프로퍼티`는 생성자 함수로 호출할 수 있는 함수 객체, 즉 `constructor만이 소유하는 프로퍼티`다.
- 일반 객체와 생성자 함수로 호출할 수 없는 `non-constructor에는 prototype 프로퍼티가 없다.`
- prototype 프로퍼티는 함수가 객체를 생성하는 생상자 함수로 호출될 때 `생성자 함수가 생성할 인스턴스의 프로토타입 객체를 가리킨다.`

```javascript
// 함숫 객체는 prototype 프로퍼티를 소유한다.
(function () {}.hasOwnProperty("prototype")); // true

// 일반 객체는 prototype 프로퍼티를 소유하지 않는다.
({}.hasOwnProrperty("prototype")); // false
```
