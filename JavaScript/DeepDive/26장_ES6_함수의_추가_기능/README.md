# 26장. ES6 함수의 추가 기능

## 26.1 함수의 구분

- ES6 이전의 모든 함수는 사용 목적에 따라 명확한 구분이 없으므로 호출 방식에 특별한 제약이 없고 생성자 함수로 호출되지 않아도 프로토타입 객체를 생성한다.
  - 이는 혼란스러우며 실수를 유발할 가능성이 있고 성능에도 좋지 않ㄴ다.
  - 이러한 문제를 해결하기 위해 ES6에서는 함수를 사용 목적에 따라 세 가지 종류로 명확히 구분했다.
    ES6 함수의 구분 | constructor | prototype | super | arguments
    --|--|--|--|--
    일반 함수(Normal) | O | O | X | O
    메서드(Method) | X | X | O | O
    화살표 함수(Arrow) | X | X | X | X

## 26.2 메서드

- 일반적으로 메서드는 객체에 바인딩된 함수를 일컫는 의미로 사용되었다.
- ES6 사양에서 메서드는 축약 표현으로 정의된 함수만을 의미한다.

  ```javascript
  const obj = {
    x: 1,
    // foo는 메서드다.
    foo() {
      return this.x;
    },
    // bar에 바인딩된 함수는 메서드가 아닌 일반 함수다.
    bar: function () {
      return this.x;
    },
  };

  console.log(obj.foo()); // 1
  console.log(obj.bar()); // 1
  ```

- ES6 사양에서 정의한 메서드(이하 ES6 메서드)는 인스턴스를 생성할 수 없는 non-constructor다.

  - 따라서 ES6 메서드는 생성자 함수로서 호출할 수 없다.

  ```javascript
  new obj.foo(); // TypeError: obj.foo is not a constructor
  new obj.bar(); // bar {}
  ```

- ES6 메서드는 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다.

  ```javascript
  // obj.foo는 constructor가 아닌 ES6 메서드이므로 prototype 프로퍼티가 없다.
  obj.foo.hasOwnProperty("prototype"); // false
  // obj.bar는 constructor인 일반 함수이므로 prototype 프로퍼티가 있다.
  obj.bar.hasOwnProperty("prototype"); // true
  ```

- 표준 빌트인 객체가 제공하는 프로토타입 메서드와 정적 메서드는 모두 non-constructor다.

  ```javascript
  String.prototype.toUpperCase.prototype; // undefined
  String.fromCharCode.prototype; // undefined
  Number.prototype.toFixed.prototype; // undefined
  Number.isFinite.prototype; // undefined
  Array.prototype.map.prototype; // undefined
  Array.from.prototype; // undefined
  ```

- ES6 메서드는 자신을 바인딩한 객체를 가리키는 내부 슬롯 [[HomeObject]]를 갖는다.

  - super 참조는 내부 슬롯 [[HomeObject]]를 사용하여 수퍼클래스의 메서드를 참조하므로 내부 슬롯 [[HomeObject]]를 갖는 ES6 메서드는 super 키워드를 사용할 수 있다.

  ```javascript
  const base = {
    name: "Lee",
    sayHi() {
      return `Hi! ${this.name}`;
    },
  };

  const derived = {
    __proto__: base,
    // sayHi는 ES6 메서드다. ES6 메서드는 [[HomeObject]]를 갖는다.
    // sayHi의 [[HomeObject]]는 derived.prototype을 가리키고
    // super는 sayHi의 [[HomeObject]]의 프로토타입인 base.prototype을 가리킨다.
    sayHi() {
      return `${super.sayHi()}. how are you doing?`;
    },
  };

  console.log(derived.sayHi()); // Hi! Lee. how are you doing?
  ```

- ES6 메서드가 아닌 함수는 super 키워드를 사용할 수 없다.
  - ES6 메서드가 아닌 함수는 내부 슬롯 [[HomeObject]]를 갖지 않기 때문이다.
  ```javascript
  const derived = {
    __proto__: base,
    // sayHi는 ES6 메서드가 아니다.
    // 따라서 sayHi는 [[HomeObject]]를 갖지 않으므로 super 키워드를 사용할 수 없다.
    sayHi: function () {
      // SyntaxError: 'super' keyword unexpected here
      return `${super.sayHi()}. how are you doing?`;
    },
  };
  ```
  > ES6 메서드는 본연의 기능(super)을 추가하고 의미적으로 맞지 않는 기능(constructor)은 제거했다. 따라서 메서드를 정의할 때 프로퍼티 값으로 익명 함수 표현식을 할당하는 ES6 이전의 방식은 사용하지 않는 것이 좋다.

## 26.3 화살표 함수

- 화살표 함수(arrow function)은 function 키워드 대신 화살표(=>, fat arrow)를 사용하여 기존의 함수 정의 방식보다 간략하게 함수를 정의할 수 있다.
  - 화살표 함수는 표현만 간략한 것이 아니라 내부 동작도 기존의 함수보다 간략하다.
  - 특히 화살표 함수는 콜백 함수 내부에서 this가 전역 객체를 가리키는 문제를 해결하기 위한 대안으로 유용하다.

### 26.3.1 화살표 함수 정의

#### 함수 정의

- 화살표 함수는 함수 선언문으로 정의할 수 없고 함수 표현식으로 정의해야 한다. 호출 방식은 기존 함수와 동일하다.
  ```javascript
  const multiply = (x, y) => x * y;
  multiply(2, 3); // 6
  ```

#### 매개변수 정의

- 매개변수가 여러 개인 경우 소괄호 () 안에 매개변수를 선언한다.

  ```javascript
  const arrow = (x, y) => {
    // do something...
  };
  ```

- 매개변수가 한 개인 경우 소괄호 ()를 생략할 수 있다.

  ```javascript
  const arrow = (x) => {
    // do something...
  };
  ```

- 매개변수가 없는 소괄호 ()를 생략할 수 없다.
  ```javascript
  const arrow = () => {
    // do something...
  };
  ```

#### 함수 몸체 정의

- 함수 몸체가 하나의 문으로 구성된다면 함수 몸체를 감싸는 중괄호 {}를 생략할 수 있다.

  - 이때 함수 몸체 내부의 문이 값으로 평가될 수 있는 표현식인 문이라면 암묵적으로 반환된다.

    ```javascript
    // concise body
    const power = (x) => x ** 2;
    power(2); // 4

    // 위 표현은 다음과 동일하다.
    // block body
    const power = (x) => {
      return x ** 2;
    };
    ```

  - 함수 몸체를 감싸는 중괄호 {}를 생략한 경우 함수 몸체 내부의 문이 표현식이 아닌 문이라면 에러가 발생한다.

    - 표현식이 아닌 문은 반환할 수 없기 때문이다.

      ```javascript
      const arrow = () => const x = 1; // SyntaxError: Unexpected toke 'const'

      // 위 표현은 다음과 같이 해석된다.
      const arrow = () => { return const x = 1;};
      ```

    - 따라서 함수 몸체가 하나의 문으로 구성된다 해도 함수 몸체의 문이 표현식이 아닌 문이라면 중괄호를 생략할 수 없다.
      ```javascript
      const arrow = () => {
        const x = 1;
      };
      ```

  - 객체 리터럴을 반환하는 경우 객체 리터럴을 소괄호 ()로 감싸 주어야 한다.

    ```javascript
    const create = (id, content) => ({ id, content });
    create(1, "JavaScript"); // {id: 1, content: 'JavaScript'}

    // 위 표현은 다음과 동일하다.
    const create = (id, content) => {
      return { id, content };
    };
    ```

  - 객체 리터를을 소괄호 ()로 감싸지 않으면 객체 리터럴의 중괄호 {}를 함수 몸체를 감싸는 중괄호 {}로 잘못 해석한다.
    ```javascript
    // {id, content}를 함수 몸체 내의 쉼표 연산자문으로 해석한다.
    const create = (id, content) => {
      id, content;
    };
    create(1, "JavaScript"); // undefined
    ```
  - 함수 몸체가 여러 개의 문으로 구성된다면 함수 몸체를 감싸는 중괄호 {}를 생략할 수 없다.
    - 이때 반환값이 있다면 명시적으로 반환해야 한다.
    ```javascript
    const sum = (a, b) => {
      const result = a + b;
      return result;
    };
    ```
  - 화살표 함수도 즉시 실행 함수(IFE)로 사용할 수 있다.

    ```javascript
    const person = ((name) => ({
      sayHi() {
        return `Hi? My name is ${name}.`;
      },
    }))("Lee");

    console.log(person.sayHi()); // Hi? My name is Lee.
    ```

  - 화살표 함수도 일급 객체이므로 고차 함수(Higher-Order Function, HOF)에 인수로 전달할 수 있다.

    - 일반적이 함수 표현식보다 표현이 간결하고 가독성이 좋다.

    ```javascript
    // ES5
    [1, 2, 3].map(function (v) {
      return v * 2;
    });

    // ES6
    [1, 2, 3].map((v) => v * 2); // [2, 4, 6]
    ```

    > 이처럼 화살표 함수는 콜백 함수로서 정의할 때 유용하다. 화살표 함수는 표현만 간략한 것만이 아니다. 화살표 함수는 일반 함수의 기능을 간략화했으며 this도 편리하게 설계되었다.

### 26.3.2 화살표 함수와 일반 함수의 차이

#### 01. 화살표 함수는 인스턴스를 생성할 수 없는 non-constructor다.

```javascript
const Foo = () => {};
// 화살표 함수는 생성자 함수로서 호출할 수 없다.
new Foo(); // TypeError: Foo is not a constructor
```

- 화살표 함수는 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다.

```javascript
const Foo = () => {};
// 화살표 함수는 prototype 프로퍼티가 없다.
Foo.hasOwnProperty("prototype"); // false
```

#### 02. 중복된 매개변수 이름을 선언할 수 없다.

- 일반 함수는 중복된 매개변수 이름을 선언해도 에러가 발생하지 않는다.

  ```javascript
  function normal(a, a) {
    return a + a;
  }
  console.log(normal(1, 2)); // 3
  ```

- 단, strict mode에서 중복된 매개변수 이름을 선언하면 에러가 발생한다.

  ```javascript
  "use strict";
  function normal(a, a) {
    return a + a;
  }
  // SyntaxError: Duplicate parameter name not allowed in this context
  ```

- 화살표 함수에서도 중복된 매개변수 이름을 선언하면 에러가 발생한다.
  ```javascript
  const arrow = (a, a) => a + a;
  // SyntaxError: Duplicate parameter name not allowed in this context
  ```

#### 03. 화살표 함수는 함수 자체의 this, arguments, super, new.target 바인딩을 갖지 않는다.

- 화살표 함수 내부에서 this, arguments, super, new.target을 참조하면 스코프 체인을 통해 상위 스코프의 this, arguments, super, new.target을 참조한다.

- 만약 화살표 함수와 화살표 함수가 중첩되어 있다면 상위 화살표 함수에도 this, arguments, super, new.target 바인딩이 없으므로 스코프 체인 상에서 가장 가까운 상위 함수 중에서 화살표 함수가 아닌 함수의 this, arguments, super, new.target을 참조한다.

### 26.3.3 this

- 화살표 함수가 일반 함수와 구별되는 가장 큰 특징은 this다.

  - 화살표 함수는 다른 함수의 인수로 전달되어 콜백 함수로 사용되는 경우가 많다.
  - 일반 함수로서 호출되는 모든 함수 내부의 this는 전역 객체를 가리킨다. (strict mode일 경우 undefined에 바인딩된다.)

- 화살표 함수는 함수 자체의 this 바인딩을 갖지 않는다.

  - 따라서 화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 그대로 참조한다. 이를 lexical this라 한다.

  ```javascript
  class Prefixer {
    constructor(prefix) {
      this.prefix = perfix;
    }

    add(arr) {
      return arr.map((item) => this.prefix + item);
    }
  }

  const prefixer = new Prefixer("-webkit-");
  console.log(prefixer.add(["transition", "user-select"]));
  // ['-webkit-transition', '-webkit-user-select']
  ```

  - 만약, 화살표 함수와 화살표 함수가 중첩되어 있다면 상위 화살표 함수에도 this 바인딩이 없으므로 스코프 체인 상에서 가장 가까운 상위 함수 중에서 화살표 함수가 아닌 함수의 this를 참조한다.

  - 프로퍼티에 할당한 화살표 함수도 스코프 체인상에서 가장 가까운 상위 함수 중에서 화살표 함수가 아닌 함수의 this를 참조한다.

    ```javascript
    // increase 프로퍼티에 할당한 화살표 함수의 상위 스코프는 전역이다.
    // 따라서 increase 프로퍼티에 할당한 화살표 함수의 this는 전역 객체를 가리킨다.
    const counter = {
      num: 1,
      increase: () => ++this.num,
    };

    console.log(counter.increase()); // NaN
    ```

  - 화살표 함수는 함수 자체의 this 바인딩을 갖지 않기 때문에 Function.prototype.call/apply/bind 메서드를 사용해도 화살표 함수 내부의 this를 교체할 수 없다.

    ```javascript
    window.x = 1;

    const normal = function () {
      return this.x;
    };
    const arrow = () => this.x;

    console.log(normal.call({ x: 10 })); // 10
    console.log(arrow.call({ x: 10 })); // 1
    ```

- 메서드를 화살표 함수로 정의하는 것은 피해야한다.

  ```javascript
  // Bad
  const person = {
    name: "Lee",
    sayHi: () => console.log(`Hi! ${this.name}`),
  };

  // sayHi 프로퍼티에 할당한 화살표 함수 내부의 this는 상위 스코프인 전역의 this가 가리키는
  // 전역 객체를 가리키므로 이 예제를 브라우저에서 실행하면 this.name은 빈 문자열을 갖는 window.name과 같다.
  // 전역 객체 window에는 빌트인 프로퍼티 name이 존재한다.
  person.sayHi(); // Hi!
  ```

  - 메서드를 정의할 때는 ES6 메서드 축약 표현으로 정의한 ES6 메서드를 사용하는 것이 좋다.

  ```javascript
  // Good
  const person = {
    name: "Lee",
    sayHi() {
      console.log(`Hi! ${this.name}`);
    },
  };

  person.sayHi(); // Hi! Lee
  ```

- 프로토타입 객체의 프로퍼티에 화살표 함수를 할당하는 경우도 동일한 문제가 발생한다.

  ```javascript
  // Bad
  function Person(name) {
    this.name = name;
  }

  Person.prototype.sayHi = () => console.log(`Hi! ${this.name}`);

  const person = new Person("Lee");
  // 이 예제를 브라우저에서 실행하면 this.name은 빈 문자열을 갖는 window.name과 같다.
  person.sayHi(); // Hi!
  ```

  - 프로퍼티를 동적 추가할 때는 ES6 메서드 정의를 사용할 수 없으므로 일반 함수를 할당한다.

  ```javascript
  // Good
  function Person(name) {
    this.name = name;
  }

  Person.prototype.sayHi = function () {
    console.log(`Hi! ${this.name}`);
  };

  const person = new Person("Lee");
  person.sayHi(); // Hi! Lee
  ```

- 클래스 필드 정의 제안을 사용하여 클래스 필드에 화살표 함수를 할당할 수도 있다.

  ```javascript
  // Bad
  class Person {
    // 클래스 필드 정의 제안
    name = "Lee";
    // 클래스가 생성한 인스턴스(this)의 sayHi 프로퍼티에 화살표 함수를 할당한다.
    // 따라서 sayHi 프로퍼티는 인스턴스 프로퍼티다.
    // this.sayHi = () => console.log(`Hi! ${this.name}`);
    sayHi = () => console.log(`Hi! ${this.name}`);
  }

  const person = new Person();
  person.sayHi(); // Hi! Lee
  ```

  > sayHi 클래스 필드에 할당한 화살표 함수의 상위 스코프는 사실 클래스 외부다. 하지만 this는 클래스 외부의 this를 참조하지 않고 클래스가 생성할 인스턴스를 참조한다. 따라서 sayHi 클래스 필드에 할당한 화살표 함수 내부에서 참조한 this는 constructor 내부의 this 바인딩과 같다. constructor 내부의 this 바인딩은 클래스가 생성한 인스턴스를 가리키므로 sayHi 클래스 필드에 할당한 화살표 함수 내부의 this 또한 클래스가 생성한 인스턴스를 가리킨다. 하지만 클래스 필드에 할당한 화살표 함수는 프로토타입 메서드가 아니라 인스턴스 메서드가 된다.

  - 따라서 메서드를 정의할 때는 ES6 메서드 축약 표현으로 정의한 ES6 메서드를 사용하는 것이 좋다.

  ```javascript
  // Good
  class person {
    // 클래스 필드 정의
    name = "Lee";

    sayHi() {
      console.log(`Hi! ${this.name}`);
    }
  }
  const person = new Person();
  person.sayHi(); // Hi! Lee
  ```

### 26.3.4 super

- 화살표 함수는 함수 자체의 super 바인딩을 갖지 않는다.

  - 따라서 화살표 함수 내부에서 super를 참조하면 this와 마찬가지로 상위 스코프의 super를 참조한다.

  ```javascript
  class Base {
    constructor(name) {
      this.name = name;
    }

    sayHi() {
      return `Hi! ${this.name}`;
    }
  }

  class Derived extends Base {
    // 화살표 함수의 super는 상위 스코프인 constructor의 super를 가리킨다.
    sayHi = () => `${super.sayHi()} how are you doing?`;
  }

  const derived = new Derived("Lee");
  console.log(derived.sayHi()); // Hi! Lee how are you doing?
  ```

### 26.3.5 arguments

- 화살표 함수는 함수 자체의 arguments 바인딩을 갖지 않는다.

  - 따라서 화살표 함수 내부에서 arguments를 참조하면 this와 마찬가지로 상위 스코프의 arguments를 참조한다.

  ```javascript
  (function () {
    // 화살표 함수 foo의 arguments는 상위 스코프인 즉시 실행함수의 arguments를 가리킨다.
    const foo = () => console.log(arguments); // [Arguments] {'0': 1, '1': 2}
    foo(3, 4);
  })(1, 2);

  // 화살표 함수 foo의 arguments는 상위 스코프인 전역의 arguments를 가리킨다.
  // 하지만 전역에는 arguments 객체가 존재하지 않는다. arguments 객체는 함수 내부에서만 유효하다.
  const foo = () => console.log(arguments);
  foo(1, 2); // ReferenceError: arguments is not defined
  ```

  > 화살표 함수로 가변인자 함수를 구현해야 할 때는 반드시 Rest 파라미터를 사용해야 한다.

## 26.4 Rest 파라미터

### 26.4.1 기본 문법

- Rest 파라미터(나머지 매개변수)는 매개변수 이름 앞에 세개의 점 ...을 붙여서 정의한 매개변수를 의미한다.
- Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받는다.

  ```javascript
  function foo(...rest) {
    // 매개변수 rest는 인수들의 목록을 배열로 전달받는 Rest 파라미터다.
    console.log(rest); // [1, 2, 3, 4, 5]
  }

  foo(1, 2, 3, 4, 5);
  ```

- 일반 매개변수와 Rest 파라미터는 함께 사용할 수 있다.

  - 이때 함수에 전달된 인수들은 매개변수와 Rest 파라미터에 순차적으로 할당된다.

  ```javascript
  function foo(param, ...rest) {
    console.log(param); // 1
    console.log(rest); // [2, 3, 4, 5]
  }

  foo(1, 2, 3, 4, 5);

  function bar(param1, param2, ...rest) {
    console.log(param1); // 1
    console.log(param2); // 2
    console.log(rest); // [3, 4, 5]
  }

  bar(1, 2, 3, 4, 5);
  ```

- Rest 파라미터는 이름 그대로 먼저 선언된 매개변수에 할당된 인수를 제외한 나머지 인수들로 구성된 배열이 할당된다.

  - 따라서 Rest 파라미터는 반드시 마지막 파라미터이어야 한다.

  ```javascript
  function foo(...rest, param1, param2) {}

  foo(1, 2, 3, 4, 5);
  // SyntaxError: Rest parameter must be last formal parameter
  ```

- Rest 파라미터는 단 하나만 선언할 수 있다.

  ```javascript
  function foo(...rest1, ...rest2) {}

  foo(1, 2, 3, 4, 5);
  // SyntaxError: Rest parameter must be last formal parameter
  ```

- Rest 파라미터는 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 length 프로퍼티에 영향을 주지 않는다.

  ```javascript
  function foo(...rest) {}
  console.log(foo.length); // 0

  function bar(x, ...rest) {}
  console.log(bar.length); // 1

  function baz(x, y, ...rest) {}
  console.log(baz.length); // 2
  ```

### 26.4.2 Rest 파라미터와 arguments 객체

- arguments 객체는 함수 호출 시 전달된 인수(argument)들의 정보를 담고 있는 순회 가능한 유사 배열 객체(array-like object)이며, 함수 내부에서 지역 변수처럼 사용할 수 있다.
- ES6에서는 rest 파라미터를 사용하여 가변 인자 함수의 인수 목록을 배열로 직접 전달받을 수 있다.

  - 이를 통해 유사 배열 객체인 arguments 객체를 배열로 변환하는 번거로움을 피할 수 있다.

- 화살표 함수는 arguments 객체를 갖지 않는다.
  - 화살표 함수로 가변 인자 함수를 구현해야 할 때는 반드시 Rest 파라미터를 사용해야 한다.

## 26.5 매개변수 기본값

- 인수가 전달되지 않은 매개변수의 값은 undefined다.

  - 이를 방치하면 의도치 않은 결과가 나올 수 있다.
    ```javascript
    function sum(x, y) {
      return x + y;
    }
    console.log(sum(1)); // NaN
    ```
  - 따라서 매개변수에 인수가 전달되었는지 확인하여 인수가 전달되지 않은 경우 매개변수에 기본값을 할당할 필요가 있다.

    - 즉, 방어코드가 필요하다.

    ```javascript
    function sum(x, y) {
      // 인수가 전달되지 않아 매개변수의 값이 undefined인 경우 기본값을 할당한다.
      x = x || 0;
      y = y || 0;

      return x + y;
    }

    console.log(sum(1, 2)); // 3
    console.log(sum(1)); // 1
    ```

  - ES6에서 도입된 매개변수 기본값을 사용하면 함수 내에서 수행하던 인수 체크 및 초기화를 간소화할 수 있다.

    ```javascript
    function sum(x = 0, y = 0) {
      return x + y;
    }

    console.log(sum(1, 2)); // 3
    console.log(sum(1)); // 1
    ```

  - 매개변수 기본값은 매개변수에 인수를 전달하지 않은 경우와 undefined를 전달한 경우에만 유효하다.

    ```javascript
    function logName(name = "Lee") {
      console.log(name);
    }

    logName(); // Lee
    logName(undefined); // Lee
    logName(null); // null
    ```

  - Rest 파라미터에는 기본값을 지정할 수 없다.
    ```javascript
    function foo(...rest = []) {
      console.log(rest);
    }
    // SyntaxError: Rest parameter may not have a default initializer
    ```
  - 매개변수 기본값은 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 length 프로퍼티와 arguments 객체에 아무런 영향을 주지 않는다.

    ```javascript
    function sum(x, y = 0) {
      console.log(arguments);
    }

    console.log(sum.length); // 1
    sum(1); // Arguments {'0': 1}
    sum(1, 2); // Arguments {'0': 1, '1': 2}
    ```
