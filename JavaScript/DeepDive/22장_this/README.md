# 22장. this

## 22.1 this 키워드

- this는 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 `자기 참조 변수(self-referencing variable)`다.

  - this를 통해 **자신이 속한 객체 또는 자신이 생성할 인스턴스의 프로퍼티나 메서드를 참조**할 수 있다.

- this가 가리키는 값, 즉 **this 바인딩은 함수 호출 방식에 의해 동적으로 결정**된다.

- 📄 this 바인딩

  > 바인딩이란 식별자와 값을 연결하는 과정을 의미한다. 예를 들어, 변수 선언은 변수 이름(식별자)과 확보된 메모리 공간의 주소를 바인딩하는 것이다. this 바인딩은 this(키워드로 분류되지만 식별자 역할을 한다.)와 this가 가리킬 객체를 바인딩 하는 것이다.

- this는 코드 어디에서든 참조 가능하다.

  - 전역에서도 함수 내부에서도 참조할 수 있다.

  ```javascript
  // this는 어디서든지 참조 가능하다.
  // 전역에서 this는 전역 객체 window를 가리킨다.
  console.log(this); // window

  function square(number) {
    // 일반 함수 내부에서 this는 전역 객체 window를 가리킨다.
    console.log(this); // window
    return number * number;
  }
  square(2);

  const person = {
    name: "Lee",
    getName() {
      // 메서드 내부에서 this는 메서드를 호출한 객체를 가리킨다.
      console.log(this); // {name: 'Lee', getName: f}
      return this.name;
    },
  };
  console.log(person.getName()); // Lee

  function Person(name) {
    this.name = name;
    // 생성자 함수 내부에서 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
    console.log(this); // Person {name: 'Lee'}
  }

  const me = new Person("Lee");
  ```

  > 하지만 this는 객체의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수이므로 일반적으로 객체의 메서드 내부 또는 생성자 함수 내부에서만 의미가 있다. 따라서 strict mode가 적용된 일반 함수 내부의 this에는 undefined가 바인딩된다. **일반 함수 내부에서 this를 사용할 필요가 없기 때문**이다.

## 22.2 함수 호출 방식과 this 바인딩

- this 바인딩(this에 바인딩될 값)은 함수 호출 방식, 즉 함수가 어떻게 호출되었는지에 따라 동적으로 결정된다.

- 📄 렉시컬 스코프와 this 바인딩은 결정 시기가 다르다.
  > 함수의 상위 스코프를 결정하는 방식인 렉시컬 스코프(lexical scope)는 함수 정의가 평가되어 함수 객체가 생성되는 시점에 상위 스코프를 결정한다. 하지만 this 바인딩은 함수 호출 시점에 결정된다.

```javascript
// this 바인딩은 함수 호출 방식에 따라 동적으로 결정된다.
const foo = function () {
  console.dir(this);
};

// 동일한 함수도 다양한 방식으로 호출할 수 있다.

// 1. 일반 함수 호출
// foo 함수를 일반적인 방식으로 호출
// foo 함수 내부의 this는 전역 객체 window를 가리킨다.
foo(); // window

// 2. 메서드 호출
// foo 함수를 프로퍼티 값으로 할당하여 호출
// foo 함수 내부의 this는 메서드를 호출한 객체 obj를 가리킨다.
const obj = { foo };
obj.foo(); // obj

// 3. 생성자 함수 호출
// foo 함수를 new 연산자와 함께 생성자 함수로 호출
// foo 함수 내부의 this는 생성자 함수가 생성한 인스턴스를 가리킨다.
new foo(); // foo {}

// 4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출
// foo 함수 내부의 this는 인수에 의해 결정된다.
const bar = { name: "bar" };

foo.call(bar); // bar
foo.apply(bar); // bar
foo.bind(bar)(); // bar
```

### 22.2.1 일반 함수 호출

- 기본적으로 this는 `전역 객체(global object)가 바인딩`된다.

  - **어떠한 함수라도 일반 함수로 호출되면 this에 전역 객체가 바인딩된다.**

  ```javascript
  function foo() {
    console.log("foo's this: ", this); // foo's this: window
    function bar() {
      console.log("bar's this: ", this); // bar's this: window
    }
    bar();
  }
  foo();
  ```

  > 위 예제처럼 전역 함수는 물론이고 중첩 함수를 일반 함수로 호출하면 함수 내부의 this에는 전역 객체가 바인딩된다.
  >
  > 다만, this는 객체의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수이므로 객체를 생성하지 않는 일반 함수에서 this는 의미가 없다.

- `strict mode가 적용`된 **일반 함수 내부의 this는 undefined가 바인딩**된다.

  ```javascript
  function foo() {
    "use strict";

    console.log("foo's this: ", this); // foo's this: undefined
    function bar() {
      console.log("bar's this: ", this); // bar's this: undefined
    }
    bar();
  }
  foo();
  ```

- 메서드 내에서 정의한 `중첩 함수도 일반 함수로 호출`되면 **중첩 함수 내부의 this에는 전역 객체가 바인딩**된다.

  ```javascript
  // var 키워드로 선언한 전역 변수 value 전역 객체의 프로퍼티다.
  var value = 1;
  // const 키워드로 선언한 전역 변수 value는 전역 객체의 프로퍼티가 아니다.
  // const value = 1;

  const obj = {
    value: 100,
    foo() {
      console.log("foo's this: ", this); // foo's this: {value: 100, foo: f}
      console.log("foo's this.value: ", this.value); // foo's this.value: 100

      // 메서드 내에서 정의한 중첩 함수
      function bar() {
        console.log("bar's this: ", this); // bar's this: window
        console.log("bar's this.value: ", this.value); // bar's this.value: 1
      }

      // 메서드 내에서 정의한 중첩 함수도 일반 함수로 호출되면 중첩 함수 내부의 this에는 전역 객체가 바인딩된다.
      bar();
    },
  };

  obj.foo();
  ```

- `콜백 함수가 일반 함수로 호출`된다면 **콜백 함수 내부의 this에도 전역 객체가 바인딩**된다.

  ```javascript
  var value = 1;

  const obj = {
    value: 100,
    foo() {
      console.log("foo's this: ", this); // foo's this: {value: 100, foo: f}
      // 콜백 함수 내부의 this에는 전역 객체가 바인딩 된다.
      setTimeout(function () {
        console.log("callback's this: ", this); // callback's this: window
        console.log("callback's this.value: ", this.value); // callback's this.value: 1
      }, 100);
    },
  };

  obj.foo();
  ```

- 메서드 내부의 중첩 함수나 콜백 함수의 this 바인딩을 메서듸 this와 바인딩과 일치시키기 위한 방법

  ```javascript
  var value = 1;

  const obj = {
    value: 100,
    foo() {
      // this 바인딩(obj)을 변수 that에 할당한다.
      const that = this;

      // 콜백 함수 내부에서 this 대신 that을 참조한다.
      setTimeout(function () {
        console.log(that.value); // 100
      }, 100);
    },
  };

  obj.foo();
  ```

- **자바스크립트는 this를 명시적으로 바인딩할 수 있는 `Function.prototype.apply/call/bind 메서드`를 제공**한다.

  ```javascript
  var value = 1;

  const obj = {
    value: 100,
    foo() {
      // 콜백 함수에 명시적으로 this를 바인딩 한다.
      setTimeout(
        function () {
          console.log(this.value); // 100
        }.bind(this),
        100
      );
    },
  };

  obj.foo();
  ```

- 화살표 함수를 사용해서 this 바인딩을 일치시킬 수도 있다.

  - `화살표 함수 내부의 this`는 **상위 스코프의 this를 가리킨다.**

  ```javascript
  var value = 1;

  const obj = {
    value: 100,
    foo() {
      // 화살표 함수 내부의 this는 상위 스코프의 this를 가리킨다.
      setTimeout(() => console.log(this.value), 100); // 100
    },
  };

  obj.foo();
  ```

### 22.2.2 메서드 호출

- 메서드 내부의 this에는 메서드를 호출한 객체, 즉 메서드를 호출할 때 메서드 이름 앞의 `마침표(.) 연산자 앞에 기술한 객체가 바인딩`된다.

  - 주의점 : 메서드 내부의 this는 메서드를 소유한 객체가 아닌! `메서드를 호출한 객체에 바인딩`된다는 것!

  ```javascript
  const person = {
    name: "Lee",
    getName() {
      // 메서드 내부의 this는 메서드를 호출한 객체에 바인딩된다.
      return this.name;
    },
  };

  // 메서드 getName을 호출한 객체는 person 이다.
  console.log(person.getName()); // Lee
  ```

  > 따라서 getName 프로퍼티가 가리키는 함수 객체, 즉 getName 메서드는 다른 객체의 프로퍼티에 할당하는 것으로 다른 객체의 메서드가 될 수도 있고 일반 변수에 할당하여 일반 함수로 호출될 수도 있다.

  ```javascript
  const anotherPerson = {
    name: "Kim",
  };
  // getName 메서드를 anotherPerson 객체의 메서드로 할당
  anotherPerson.getName = person.getName;

  // getName 메서드를 호출한 객체는 anotherPerson이다.
  console.log(anotherPerson.getName()); // Kim

  // getName 메서드를 변수에 할당
  const getName = person.getName;

  // getName 메서드를 일반 함수로 호출
  console.log(getName()); // ''
  // 일반 함수로 호출된 getName 함수 내부의 this.name은 브라우저 환경에서 window.name과 같다.
  // 브라우저 환경에서 window.name은 브라우저 창의 이름을 나타내는 빌트인 프로퍼티이며 기본값은 ''이다.
  // Node.js 환경에서 this.name은 undefined다.
  ```

- 프로토타입 메서드 내부에서 사용된 this도 일반 메서드와 마찬가지로 해당 메서드를 호출한 객체에 바인딩된다.

  ```javascript
  function Person(name) {
    this.name = name;
  }

  Person.prototype.getName = function () {
    return this.name;
  };

  const me = new Person("Lee");

  // getName 메서드를 호출한 객체는 me다.
  console.log(me.getName()); // 1. Lee

  Person.prototype.name = "Kim";

  // getName 메서드를 호출한 객체는 Person.prototype 이다.
  console.log(Person.prototype.getName()); // 2. Kim
  ```

### 22.2.3 생성자 함수 호출

- **생성자 함수 내부의 this에는 생성자 함수가 (미래에) 생성할 인스턴스가 바인딩**된다.

  ```javascript
  // 생성자 함수
  function Circle(radius) {
    // 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
    this.radius = radius;
    this.getDiameter = function () {
      return 2 * this.radius;
    };
  }

  // 반지름이 5인 Circle 객체를 생성
  const circle1 = new Circle(5);
  // 반지름이 10인 Circle 객체를 생성
  const circle2 = new Circle(10);

  console.log(circle1.getDiameter()); // 10
  console.log(circle2.getDiameter()); // 20
  ```

### 22.2.4 Function.prototype.apply/call/bind 메서드에 의한 간접 호출

- apply, call, bind 메서드는 Function.prototype의 메서드다. 즉, 이들 메서드는 모든 함수가 상속받아 사용할 수 있다.

```javascript
function getThisBinding() {
  return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

console.log(getThisBinding()); // window

// getThisBinding 함수를 호출하면서 인수로 전달한 객체를 getThisBinding 함수의 this에 바인딩한다.
console.log(getThisBinding.apply(thisArg)); // {a:1}
console.log(getThisBinding.call(thisArg)); // {a:1}
```

> apply와 call 메서드의 본질적인 기능은 함수를 호출하는 것이다. `apply와 call 메서드`는 **함수를 호출하면서 첫 번째 인수로 전달한 특정 객체를 호출한 함수의 this에 바인딩**한다.
>
> apply와 call 메서드는 호출할 함수에 인수를 전달하는 방식만 다를 뿐 동일하게 동작한다.

```javascript
function getThisBinding() {
  console.log(arguments);
  return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

// getThisBinding 함수를 호출하면서 인수로 전달한 객체를 getThisBinding 함수의 this에 바인딩한다.
// apply 메서드는 호출할 함수의 인수를 배열로 묶어 전달한다.
console.log(getThisBinding.apply(thisArg, [1, 2, 3]));
// Arguments(3) [1, 2, 3, callee: f, Symbol(Symbol.iterator): f]
// {a: 1}

// call 메서드는 호출할 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달한다.
console.log(getThisBinding.call(thisArg, 1, 2, 3));
// Arguments(3) [1, 2, 3, calle: f, Symbol(Symbol.iterator): f]
// {a: 1}
```

> `apply 메서드`는 **호출할 함수의 인수를 배열로 묶어 전달**한다.
>
> `call 메서드`는 **호출할 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달**한다.

- **apply와 call 메서드의 대표적인 용도**

  - arguments 객체와 같은 `유사 배열 객체에 배열 메서드를 사용하는 경우`

  ```javascript
  function convertArgsToArray() {
    console.log(arguments);

    // arguments 객체를 배열로 변환
    // Array.prototype.slice를 인수 없이 호출하면 배열의 복사본을 생성한다.
    const arr = Array.prototype.slice.call(arguments);
    // const arr = Array.prototype.slice.apply(arguments);
    console.log(arr);

    return arr;
  }

  convertArgsToArray(1, 2, 3); // [1, 2, 3]
  ```

- `Function.prototype.bind 메서드`는 apply와 call 메서드와 달리 **함수를 호출하지 않고 this로 사용할 객체만 전달**한다.

  ```javascript
  function getThisBinding() {
    return this;
  }

  // this로 사용할 객체
  const thisArg = { a: 1 };

  // bind 메서드는 함수에 this로 사용할 객체를 전달한다.
  // bind 메서드는 함수를 호출하지는 않는다.
  console.log(getThisBinding.bind(thisArg)); // getThisBinding
  // bind 메서드는 함수를 호출하지는 않으므로 명시적으로 호출해야 한다.
  console.log(getThisBinding.bind(thisArg)()); // {a: 1}
  ```

- `bind 메서드`는 메서드의 this와 내부의 중첩 함수 또는 콜백 함수의 **`this가 불일치하는 문제를 해결하기 위해 사용`**된다.

  ```javascript
  const person = {
    name: "Lee",
    foo(callback) {
      // bind 메서드로 callback 함수 내부의 this 바인딩을 전달
      setTimeout(callback.bind(this), 100);
    },
  };

  person.foo(function () {
    console.log(`Hi! My name is ${this.name}.`); // Hi! My name is Lee
  });
  ```

| 함수 호출 방식                                             | this 바인딩                                                            |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| 일반 함수 호출                                             | 전역 객체                                                              |
| 메서드 호출                                                | 메서드를 호출한 객체                                                   |
| 생성자 함수 호출                                           | 생성자 함수가 (미래에) 생성할 인스턴스                                 |
| Function.prototype.apply/call/bind 메서드에 의한 간접 호출 | Function.prototype.apply/call/bind 메서드에 첫 번째 인수로 전달한 객체 |
