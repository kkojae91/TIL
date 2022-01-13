# 24장. 클로저

- 클로저는 함수와 그 함수가 선언된 렉시컬 환경과의 조합이다.

  - A closure is this combination of a function and the lexical environment within which that function was declared.

- 클로저는 자바스크립트 고유 개념이 아니다.

  - 함수를 일급 객체로 취급하는 함수형 프로그래밍 언어에서 사용되는 중요한 특성이다.

- 자바스크립트는 렉시컬 스코프를 따르는 프로그래밍 언어다.

  ```javascript
  const x = 1;

  function outerFunc() {
    const x = 10;
    innerFunc();
  }

  function innerFunc() {
    console.log(x); // 1
  }

  outerFunc();
  ```

  > innerFunc안에 console.log(x)의 값은 1이다. 이는 자바스크립트가 렉시컬 스코프를 따르는 언어이기 때문이다.

## 24.1 렉시컬 스코프

- 렉시컬 스코프

  - 자바스크립트 엔진은 함수를 어디서 호출했는지가 아니라 함수를 어디에 정의했는지에 따라 상위 스코프를 결정한다.

  ```javascript
  const x = 1;

  function foo() {
    const x = 10;
    bar();
  }

  function bar() {
    console.log(x);
  }

  foo(); // 1
  bar(); // 1
  ```

  > 위 예제의 foo 함수와 bar 함수는 모두 전역에서 정의된 전역 함수다. 함수의 상위 스코프는 함수를 어디서 정의했느냐에 따라 결정되므로 foo 함수와 bar 함수의 상위 스코프는 전역이다.
  >
  > 함수를 어디서 호출하는지는 함수의 상위 스코프를 결정에 어떠한 영향도 주지 못한다. 즉, 함수의 상위 스코프는 함수를 정의한 위치에 의해 정적으로 결정되고 변하지 않는다.

- 렉시컬 환경의 "외부 렉시컬 환경에 대한 참조"에 저장할 참조값. 즉 **상위 스코프에 대한 참조는 함수 정의가 평가되는 시점에 함수가 정의된 한경(위치)에 의해 결정**된다.

## 24.2 함수 객체의 내부 슬롯 [[Environment]]

- 함수는 `자신의 내부 슬롯 [[Environment]]` 에 자신이 정의된 환경, 즉 **상위 스코프의 참조를 저장**한다.

  > 함수가 정의된 한경(위치)과 호출되는 환경(위치)은 다를 수 있다. 따라서 렉시컬 스코프가 가능하려면 함수는 자신이 호출되는 환경과는 상관없이 자신이 정의된 환경, 즉 상위 스코프(함수 정의가 위치하는 스코프가 바로 상위 스코프다)를 기억해야 한다.

- 자신의 내부 슬롯 [[Environment]]에 저장된 `상위 스코프의 참조`는 **현재 실행 중인 실행 컨텍스트의 렉시컬 환경을 가리킨다.**

  > 함수 정의가 평가되어 함수 객체를 생성하는 시점은 함수가 정의된 환경, 즉 상위 함수(또는 전역 코드)가 평가 또는 실행되고 있는 시점이며, 이때 현재 실행 중인 실행 컨텍스트는 상위 함수(또는 전역 코드)의 실행 컨텍스트이기 때문이다.

- 해당하는 함수 평가가 끝나고 함수가 호출되면 함수 내부로 코드 제어권이 이동한다. 이때 **함수 렉시컬 환경의 구성 요소인 외부 렉시컬 환경에 대한 참조에는 함수 객체의 내부 슬롯 [[Environment]]에 저장된 렉시컬 환경의 참조가 할당**된다.

## 24.3 클로저와 렉시컬 환경

```javascript
const x = 1;

// 1.
function outer() {
  const x = 10;
  const inner = function () {
    console.log(x);
  }; // 2.

  return inner;
}

// outer 함수를 호출하면 중첩 함수 inner를 반환한다.
// 그리고 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 팝되어 제거된다.
const innerFunc = outer(); // 3.
innerFunc(); // 10
```

> outer 함수를 호출(3.)하면 outer 함수는 중첩 함수 inner를 반환하고 생명 주기(life cycle)를 마감한다. 즉, outer 함수의 실행이 종료되면 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 제거(pop)된다. 이때 outer 함수의 지역 변수 x와 변수 값 10을 저장하고 있던 outer 함수의 실행 컨텍스트가 제거되었으므로 outer 함수의 지역 변수 x 또한 생명 주기를 마감한다. 따라서 outer 함수의 지역 변수 x는 더는 유효하지 않게 되어 x 변수에 접근할 수 있는 방법이 없어보인다.
>
> 그러나 위 코드의 실행 결과(4.)는 outer 함수의 지역 변수 x의 값인 10이다. 이미 생명 주기가 종료되어 실행 컨텍스트 스택에서 제거된 outer 함수의 지역 변수 x가 다시 부활이라도 한 듯이 동작하고 있다.

- 위 상황 처럼 외부 함수보다 중첩 함수가 더 오래 유지되는 경우 중첩 함수는 **이미 생명 주기가 종료한 외부 함수의 변수를 참조**할 수 있고, 이러한 중첩 함수를 `클로저(closure)라고 부른다.`

- 자바스크립트의 모든 함수는 자신의 상위 스코프를 기억한다고 했다. 모든 함수가 기억하는 상위 스코프는 함수를 어디서 호출하든 상관없이 유지된다.

  - 따라서 함수를 어디서 호출하든 상관없이 함수는 언제나 자신이 기억하는 상위 스코프의 식별자를 참조할 수 있으며 식별자에 바인딩된 값을 변경할 수도 있다.
    > 위 예제에서 outer 함수의 실행이 종료하면 inner 함수를 반환하면서 outer 함수의 생명 주기가 종료된다. 즉 outer 함수의 실행 컨텍스트가 실행 컨텍스트 스택에서 제거된다.
    >
    > 이때, outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 제거되지만 outer 함수의 렉시컬 환경까지 소멸하는 것은 아니다.
    >
    > outer 함수의 렉시컬 환경은 inner gkatndml [[Environment]] 내부 슬롯에 참조되고 있고 inner 함수는 전역 변수 innerFunc에 의해 참조되고 있으므로 가비지 컬렉션 대상이 되지 않기 때문이다.
    >
    > 중첩 함수의 inner는 외부 함수 outer 보다 더 오래 생존했다. 이때 외부 함수보다 더 오래 생존한 중첩 함수는 외부 함수의 생존 여부(실행 컨텍스트의 생존 여부)와 상관없이 자신이 정의된 위치에 의해 결정된 상위 스코프를 기억한다. 이처럼 중첩 함수 inner의 내부에서는 상위 스코프를 참조할 수 있으므로 상위 스코프의 식별자를 참조할 수 있고 식별자의 값을 변경할 수 있다.

- 자바스크립트의 모든 함수는 상위 스코프를 기억하므로 이론적으로 모든 함수는 크로저다.

  - 하지만 일반적으로 모든 함수를 클로저라고 하지는 않는다.
  - 예1) 상위 스코프의 식별자를 참조하지 않을 경우 클로저라고 하지 않는다.

    ```javascript
    function foo() {
      const x = 1;
      const y = 2;

      // 일반적으로 클로저라고 하지 않는다.
      function bar() {
        const z = 3;

        debugger;
        // 상위 스코프의 식별자를 참조하지 않는다.
        console.log(z);
      }

      return bar;
    }

    const bar = foo();
    bar();
    ```

  - 예2) 상위 스코프의 식별자를 참조하지만, 외부 함수인 foo 보다 bar 함수의 생명주기가 짧기 때문에 클로저라고 하지 않는다.

    ```javascript
    function foo() {
      const x = 1;

      // bar 함수는 클로저였지만 곧바로 소멸한다.
      // 이러한 함수는 일반적으로 클로저라고 하지 않는다.
      function bar() {
        debugger;
        // 상위 스코프의 식별자를 참조한다.
        console.log(x);
      }
      bar();
    }

    foo();
    ```

  - 클로저의 예1) **클로저는 중첩 함수가 `상위 스코프의 식별자를 참조`하고 있고 `중첩 함수가 외부 함수보다 더 오래 유지되는 경우`에 한정하는 것이 일반적**이다.

    ```javascript
    function foo() {
      const x = 1;
      const y = 2;

      // 클로저
      // 중첩 함수 bar는 외부 함수보다 더 오래 유지되며 상위 스코프의 식별자를 참조한다.
      function bar() {
        debugger;

        console.log(x);
      }

      return bar;
    }

    const bar = foo();
    bar();
    ```

    > 위 예제에서 클로저인 중첩 함수 bar는 상위 스코프의 x, y 식별자 중에서 x만 참조하고 있다. 이런 경우 대부분의 모던 브라우저는 최적화를 통해 상위 스코프의 식별자 중에서 클로저가 참조하고 있는 식별자만을 기억한다.
    >
    > **클로저에 의해 참조되는 상위 스코프의 변수**를 `자유 변수(free variable)`이라 부른다.

- 클로저는 상위 스코프의 식별자 중에서 **기억해야 할 식별자만 기억**한다.

## 24.4 클로저의 활용

- 클로저는 **상태(state)를 안전하게 변경하고 유지하기 위해 사용**한다.

  - 상태가 의도치 않게 변경되지 않도록 상태를 안전하게 은닉(information hiding)하고 틀정 함수에게만 상태 변경을 허용하기 위해 사용한다.

  ```javascript
  // 함수를 반환하는 고차 함수
  // 이 함수는 카운트 상태를 유지하기 위한 자유 변수 counter를 기억하는 클로저를 반환한다.
  const counter = (function () {
    // 카운트 상태를 유지하기 위한 자유 변수
    let counter = 0;

    // 함수를 인수로 전달받는 클로저를 반환
    return function (predicate) {
      // 인수로 전달 받은 보조 함수에 상태 변경을 위임한다.
      counter = predicate(counter);
      return counter;
    };
  })();

  // 보조 함수
  function increase(n) {
    return ++n;
  }

  // 보조 함수
  function decrease(n) {
    return --n;
  }

  // 보조 함수를 전달하여 호출
  console.log(counter(increase)); // 1
  console.log(counter(increase)); // 2

  // 자유 변수를 공유한다.
  console.log(counter(decrease)); // 1
  console.log(counter(decrease)); // 0
  ```

## 24.5 캡슐화와 정보 은닉

- `캡슐화(encapulation)`

  - 객체의 상태(state)를 나타내는 프로퍼티와 프로퍼티를 참조하고 조작할 수 있는 동작(behavior)인 메서드를 하나로 묶는 것을 말한다.

- `정보 은닉(information hiding)`

  - 캡슐화는 객체의 특정 프로퍼티나 메서드를 감출 목적으로 사용하기도 하는데 이를 정보 은닉이라고 한다.

- 대부분의 객체지향 프로그래밍 언어는 클래스를 정의하고 그 클래스를 구성하는 멤버(프로퍼티와 메서드)에 대하여 public, private, protected 같은 접근 제한자(access modifier)를 선언하여 공개 범위를 한정할 수 있다.
  - public으로 선언된 프로퍼티와 메서드는 클래스 외부에서 참조할 수 있지만, private으로 선언된 경우는 클래스 외부에서 참조할 수 없다.
  - 자바스크립트는 public, private, protected 같은 접근 제한자를 제공하지 않는다.
    - 자바스크립트에서는 개발자끼리 암묵적으로 변수 앞에 \_(언더바)를 붙여 private 프로퍼티를 선언한다.
    - 예1) let \_age

```javascript
function Person(name, age) {
  this.name = name; // public
  let _age = age; // private

  // 인스턴스 메서드
  this.sayHi = function () {
    console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
  };
}

const me = new Person("Lee", 20);
me.sayHi(); // Hi! My name is Lee. I am 20.
console.log(me.name); // Lee
console.log(me._age); // undefined

const you = new Person("Kim", 30);
you.sayHi(); // Hi! My name is Kim. I am 30.
console.log(you.name); // Kim
console.log(you._age); // undefined
```

> 위 예제의 name 프로퍼티는 현재 외부로 공개되어 있어서 자유롭게 참조하거나 변경할 수 있다. 즉, name 프로퍼티는 public하다. 하지만 \_age 변수는 Person 생성자 함수의 지역 변수이므로 Person 생성자 함수 외부에서 참조하거나 변경할 수 없다. 즉 \_age 변수는 private 하다.

- 위 예제의 sayHi 메서드는 인스턴스 메서드이므로 Person 객체가 생성될 때마다 중복 생성된다. sayHi 메서드를 프로토타입 메서드로 변경하여 sayHi 메서드의 중복 생성을 방지해보자.

```javascript
function Person(name, age) {
  this.name = name;
  let _age = age;
}

// 프로토타입 메서드
Person.prototype.sayHi = function () {
  // Person 생성자 함수의 지역 변수 _age를 참조할 수 없다.
  console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
};
```

> 이때 Person.prototype.sayHi 메서드 내에서 Person 생성자 함수의 지역 변수 \_age를 참조할 수 없는 문제가 발생한다.

- 즉시 실행 함수를 사용하여 Person 생성자 함수와 Person.prototype.sayHi 메서드를 하나의 함수 내에 모아 보자!

```javascript
const Person = (function () {
  let _age = 0; // private

  // 생성자 함수
  function Person(name, age) {
    this.name = name;
    _age = age;
  }

  // 프로토타입 메서드
  Person.prototype.sayHi = function () {
    console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
  };

  // 생성자 함수를 반환
  return Person;
})();

const me = new Person("Lee", 20);
me.sayHi(); // Hi! My name is Lee. I am 20.
console.log(me.name); // Lee
console.log(me._age); // undefined

const you = new Person("Kim", 30);
you.sayHi(); // Hi! My name is Kim. I am 30.
console.log(you.name); // Kim
console.log(you._age); // undefined
```

> 위 코드는 public, private, protected 같은 접근 제한자를 제공하지 않는 자바스크립트에서도 정보 은닉이 가능한 것 처럼 보인다. 하지만 위 코드에는 문제가 있다.

```javascript
const me = new Person("Lee", 20);
me.sayHi(); // Hi! My name is Lee. I am 20.

const you = new Person("Kim", 30);
you.sayHi(); // Hi! My name is Kim. I am 30.

// _age 변수 값이 변경된다.
me.sayHi(); // Hi! My name is Lee. I am 30.
```

> 이처럼 자바스크립트는 정보 은닉을 완전하게 지원하지 않는다. 인스턴스 메서드를 사용한다면 자유 변수를 통해 private을 흉내 낼 수는 있지만 프로토타입 메서드를 사용하면 이마저도 불가능해진다. ES6의 Symbol 또는 WeakMap을 사용하여 private한 프로퍼티를 흉내 내기도 했으나 근본적인 해결책이 되지는 않는다.
