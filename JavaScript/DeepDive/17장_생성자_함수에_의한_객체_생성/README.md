# 17장 생성자 함수에 의한 객체 생성

## 17.1 Object 생성자 함수

- new 연산자와 함께 Object 생성자 함수를 호출하면 빈 객체를 생성하여 반환한다.
- 빈 객체를 생성한 이후 프로퍼티 또는 메서드를 추가하여 객체를 완성할 수 있다.

  ```javascript
  // 빈 객체의 생성
  const person = new Object();

  // 프로퍼티 추가
  person.name = "Lee";
  person.sayHello = function () {
    console.log("Hi! My name is " + this.name);
  };

  console.log(person); // {name: 'Lee', sayHello: f}
  person.sayHello(); // Hi! My name is Lee
  ```

  > 생성자 함수(constructor)란 new 연산자와 함께 호출하여 객체(인스턴스)를 생성하는 함수를 말한다. 생성자 함수에 의해 생성된 객체를 인스턴스(instance)라 한다.

- 자바스크립트는 Object 생성자 함수 이외에도 String, Number, Boolean, Function, Array, Date, RegExp, Promise 등의 빌트인(built-in) 생성자 함수를 제공한다.

  ```javascript
  // String 생성자 함수에 의한 String 객체 생성
  const strObj = new String("Lee");
  console.log(typeof strObj); // object
  console.log(strObj); // String {'Lee'}

  // Number 생성자 함수에 의한 Number 객체 생성
  const numObj = new Number(123);
  console.log(typeof numObj); // object
  console.log(numObj); // Number {123}

  // Boolean 생성자 함수에 의한 Boolean 객체 생성
  const boolObj = new Boolean(true);
  console.log(typeof boolObj); // object
  console.log(boolObj); // Object {true}

  // Function 생성자 함수에 의한 Function 객체(함수) 생성
  const func = new Function("x", "return x * x");
  console.log(typeof func); // function
  console.dir(func); // f anonymous(x)

  // Array 생성자 함수에 의한 Array 객체(배열) 생성
  const arr = new Array(1, 2, 3);
  console.log(typeof arr); // object
  console.log(arr); // [1, 2, 3]

  // RegExp 생성자 함수에 의한 RegExp 객체(정규 표현식) 생성
  const regExp = new RegExp(/ab+c/i);
  console.log(typeof regExp); // object
  console.log(regExp); // /ab+c/i

  // Date 생성자 함수에 의한 Date 객체 생성
  const date = new Date();
  console.log(typeof date); // object
  console.log(date); // Mon May 04 2020 08:36:33 GMT+0900 (대한민국 표준시)
  ```

## 17.2 생성자 함수

### 17.2.1 객체 리터럴에 의한 객체 생성 방식의 문제점

- 객체 리터럴에 의한 객체 생성 방식은 직관적이고 간편하다.

  - 하지만, 동일한 프로퍼티를 갖는 객체를 여러개 생성해야 하는 경우 매번 같은 프로퍼티를 기술해야 하기 때문에 비효율적이다.

  ```javascript
  const circle1 = {
    radiius: 5,
    getDiameter() {
      return 2 * this.radius;
    },
  };

  console.log(circle1.getDiameter()); // 10

  const circle2 = {
    radius: 10,
    getDiameter() {
      return 2 * this.radius;
    },
  };

  console.log(circle2.getDiameter()); // 20
  ```

  > `객체 리터럴`에 의해 객체를 생성하는 경우 **프로퍼티 구조가 동일함에도 불구하고 매번 같은 프로퍼티와 메서드를 기술해야하는 단점**이 있다.

### 17.2.2 생성자 함수에 의한 객체 생성 방식의 장점

- `생성자 함수에 의한 객체 생성 방식`은 마치 객체(인스턴스)를 생성하기 위한 탬플릿(클래스)처럼 생성자 함수를 사용하여 **프로퍼티 구조가 동일한 객체 여러 개를 간편하게 생성**할 수 있다.

  ```javascript
  // 생성자 함수
  function Circle(radius) {
    // 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
    this.radius = radius;
    this.getDiameter = function () {
      return 2 * this.radius;
    };
  }

  const circle1 = new Circle(5); // 반지름이 5인 Circle 객체를 생성
  const circle2 = new Circle(10); // 반지름이 10인 Circle 객체를 생성

  console.log(circle1.getDiameter()); // 10
  console.log(circle2.getDiameter()); // 20
  ```

- 📄 this

  > this는 객체 자신의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수(self-refercing variable)다. this가 가리키는 값, 즉 `this바인딩은 함수 호출 방식에 따라 동적으로 결정`된다.
  >
  > | 함수 호출 방식           | this가 가리키는 값(this 바인딩)            |
  > | ------------------------ | ------------------------------------------ |
  > | **일반 함수로서 호출**   | **전역 객체**                              |
  > | **메서드로서 호출**      | **메서드를 호출한 객체(마침표 앞의 객체)** |
  > | **생성자 함수로서 호출** | **생성자 함수가 (미래에) 생성할 인스턴스** |

  ```javascript
  // 함수는 다양한 방식으로 호출될 수 있다.
  function foo() {
    console.log(this);
  }

  // 일반적인 함수로서 호출
  // 전역 객체는 브라우저 환경에서는 window, Node.js 환경에서는 global을 가리킨다.
  foo(); // window

  const obj = { foo }; //ES6 프로퍼티 축약 표현

  // 메서드로서 호출
  obj.foo(); // obj

  // 생성자 함수로서 호출
  const inst = new Foo(); // inst
  ```

- **생성자 함수는 이름 그대로 객체(인스턴스)를 생성하는 함수**다.

  - 일반 함수와 동일한 방법으로 생성자 함수를 정의하고 new 연산자와 함께 호출하면 해당 함수는 생성자 함수로 동작한다.
  - 만약 new 연산자와 함께 생성자 함수를 호출하지 않으면 생성자 함수가 아니라 일반 함수로 동작한다.

  ```javascript
  // new 연산자와 함께 호출하지 않으면 생성자 함수로 동작하지 않는다.
  // 즉, 일반 함수로서 호출된다.
  const circle3 = Circle(15);

  // 일반 함수로서 호출된 Circle은 반환무이 없으므로 암묵적으로 undefined를 반환한다.
  console.log(circle3); // undefined

  // 일반 함수로서 호출된 Circle 내의 this는 전역 객체를 가리킨다.
  console.log(radius); // 15
  ```

### 17.2.3 생성자 함수의 인스턴스 생성 과정

- 생성자 함수의 함수 몸체에서 수행해야 하는 것

  - `인스턴스 생성` -> **필수!**
  - 생성된 `인스턴스를 초기화`(인스턴스 프로퍼티 추가 및 초기값 할당) -> **옵션!**

  ```javascript
  // 생성자 함수
  function Circle(radius) {
    // 인스턴스 초기화
    this.radius = radius;
    this.getDiameter = function () {
      return 2 * this.radius;
    };
  }

  // 인스턴스 생성
  const circle1 = new Circle(5); // 반지름이 5인 Circle 객체를 생성
  ```

  > 생성자 함수 내부의 코드를 살펴보면 this에 프로퍼티를 추가하고 필요에 따라 전달된 인수를 프로퍼티의 초기값으로 할당하여 인스턴스를 초기화 한다. 하지만 인스턴스를 생성하고 반환하는 코드는 보이지 않는다. 자바스크립트 엔진은 `암묵적인 처리를 통해 인스턴스를 생성하고 반환`한다. (new 연산자와 함께 생성자 함수를 호출할 경우!)

  - 인스턴스 객체를 반환하는 과정

    1. **인스턴스 생성과 this 바인딩**

    - 암묵적으로 빈 객체가 생성된다.
    - 빈 객체가 생성자 함수가 생성한 인스턴스다.(미완성 빈 객체)
    - 암묵적으로 생성된 `빈 객체(인스턴스)를 this에 바인딩` 한다.

      - 생성자 함수 내부의 this가 생성자 함수가 생성할 인스턴스를 가리키는 이유가 바로 이것이다.
      - 📄 `바인딩(name binding)`
        > 바인딩이란 `식별자와 값을 연결하는 과정을 의미`한다. 예를 들어, 변수 선언은 변수 이름(식별자)과 확보된 메모리 공간의 주소를 바인딩하는 것이다. this 바인딩은 this(키워드로 분류되지만 식별자 역할을 한다)와 this가 가리킬 객체를 바인딩 하는 것이다.

      ```javascript
      function Circle(radius) {
        // 1. 암묵적으로 인스턴스가 생성되고 this에 바인딩된다.
        console.log(this); // Circle {}

        this.radius = radius;
        this.getDiameter = function () {
          return 2 * this.radius;
        };
      }
      ```

    2. **인스턴스 초기화**

    - 생성자 함수에 기술되어 있는 코드가 한 줄씩 실행되어 `this에 바인딩되어 있는 인스턴스를 초기화` 한다. (이 처리는 개발자가 기술한다.)

    ```javascript
    function Circle(radius) {
      // 1. 암묵적으로 인스턴스가 생성되고 this에 바인딩된다.

      // 2. this에 바인딩되어 있는 인스턴스를 초기화한다.
      this.radius = radius;
      this.getDiameter = function () {
        return 2 * this.radius;
      };
    }
    ```

    3. **인스턴스 반환**

    - `생성자 함수 내부의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환`된다.

      ```javascript
      function Circle(radius) {
        // 1. 암묵적으로 빈 객체가 생성되고 this에 바인딩된다.

        // 2. this에 바인딩되어 있는 인스턴스를 초기화한다.
        this.radius = radius;
        this.getDiameter = function () {
          return 2 * this.radius;
        };

        // 3. 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.
      }

      // 인스턴스 생성. Circle 생성자 함수는 암묵적으로 this를 반환한다.
      const circle = new Circle(1);
      console.log(circle); // Circle {radius: 1, getDiameter: f}
      ```

    - this가 아닌 `다른 객체를 명시적으로 반환`하면 this가 반환되지 못하고 `return 문에 명시된 객체가 반환`된다.

      ```javascript
      function Circle(radius) {
        // 1. 암묵적으로 빈 객체가 생성되고 this에 바인딩된다.

        // 2. this에 바인딩되어 있는 인스턴스를 초기화한다.
        this.radius = radius;
        this.getDiameter = function () {
          return 2 * this.radius;
        };

        // 3. 암묵적으로 this를 반환한다.
        // 명시적으로 객체를 반환하면 암묵적인 this 반환이 무시된다.
        return {};
      }

      // 인스턴스 생성. Circle 생성자 함수는 명시적으로 반환한 객체를 반환한다.
      const circle = new Circle(1);
      console.log(circle); // {}
      ```

    - 명시적으로 `원시 값을 반환`하면 원시 값 반환은 무시되고 `암묵적으로 this가 반환`된다.

      ```javascript
      function Circle(radius) {
        // 1. 암묵적으로 빈 객체가 생성되고 this에 바인딩된다.

        // 2. this에 바인딩되어 있는 인스턴스를 초기화한다.
        this.radius = radius;
        this.getDiameter = function () {
          return 2 * this.radius;
        };

        // 3. 암묵적으로 this를 반환한다.
        // 명시적으로 원시 값을 반환하면 원시 값 반환은 무시되고 암묵적으로 this가 반환된다.
        return 100;
      }

      // 인스턴스 생성. Circle 생성자 함수는 명시적으로 반환한 객체를 반환한다.
      const circle = new Circle(1);
      console.log(circle); // Circle {radius: 1, getDiameter: f}
      ```

      > 위와 같은 이유들이 있기 때문에 `생성자 함수 내부에서는 return 문을 반드시 생략`해야 한다.

### 17.2.4 내부 메서드 [[Call]]과 [[Contruct]]

- 함수는 객체이지만 일반 객체와는 다르다.

  - 일반 객체는 호출할 수 없지만, 함수 객체는 호출할 수 있다.
  - 따라서, 일반 객체가 가지고 있는 내부 슬롯과 내부 메서드는 물론, 함수로서 동작하기 위해 `함수 객체만을 위한 [[Environment]], [[FormalParameters]] 등의 내부 슬롯`과 `[[Call]], [[Construct]] 같은 내부 메서드`를 추가로 가지고 있다.
  - 함수가 **일반 함수로서 호출되면 함수 객체의 내부 메서드 [[Call]]이 호출**되고 new 연산자와 함께 **생성자 함수로서 호출되면 내부 메서드 [[Construct]]가 호출**된다.

  ```javascript
  function foo() {}

  // 일반적인 함수로서 호출 : [[Call]]이 호출된다.
  foo();

  // 생성자 함수로서 호출 : [[Contruct]]가 호출된다.
  new foo();
  ```

  > 내부 메서드 `[[Call]]을 갖는 함수 객체를 callable`이라 하며, 내부 메서드 `[[Contruct]]를 갖는 함수 객체를 construct`, `[[Construct]]를 갖지 않는 함수 객체를 non-constructor`라고 부른다.
  >
  > callable은 호출할 수 있는 객체, 즉 함수를 말한다.
  >
  > constructor는 생성자 함수로서 호출할 수 있는 함수, non-constructor는 객체를 생성자 함수로서 호출할 수 없는 함수를 의미한다.
  >
  > 결론적으로 함수 객체는 `callable이면서 constructor` 이거나 `callable이면서 non-constructor`다. 즉 모든 함수 객체는 호출할 수 있지만 모든 함수 객체를 생성자 함수로서 호출할 수 있는 것은 아니다.

### 17.2.5 constructor와 non-constructor의 구분

- `constructor`: 함수 선언문, 함수 표현식, 클래스(클래스도 함수다)
- `non-constructor`: 메서드(ES6 메서드 축약 표현), 화살표 함수

- 주의점: ECMAScript 사양에서 메서드로 인정하는 **범위가 일반적인 의미의 메서드보다 좁다**는 것이다.

  ```javascript
  // 일반 함수 정의: 함수 선언문, 함수 표현식
  function foo() {}
  const bar = function () {};
  // 프로퍼티 x의 값으로 할당된 것은 일반 함수로 정의된 함수다. 이는 메서드로 인정하지 않는다.
  const baz = {
    x: function () {},
  };

  // 일반 함수로 정의된 함수만이 constructor다
  new foo(); // -> foo {}
  new bar(); // -> bar {}
  new baz.x(); // -> x {}

  // 화살표 함수 정의
  const arrow = () => {};

  new arrow(); // TypeError: arrow is not a constructor

  // 메서드 정의: ES6의 메서드 축약 표현만 메서드로 인정한다.
  const obj = {
    x() {},
  };

  new obj.x(); // TypeError: obj.x is not a constructor
  ```

  > 함수를 프로퍼티 값으로 사용하면 일반적으로 메서드로 통칭한다. 하지만 ECMAScript 사양에서 메서드란 ES6의 메서드 축약 표현만을 의미한다.
  >
  > 다시말해, 함수 정의 방식에 따라 constructor와 non-constructor를 구분한다. 따라서 위 예제와 같이 일반 함수, 즉 함수 선언문과 함수 표현식으로 정의된 함수만이 constructor이고 ES6의 화살표 함수와 메서드 축약 표현으로 정의된 함수는 non-constructor다.

- **non-constructor인 함수 객체를 생성자 함수로서 호출하면 에러가 발생**한다.

  ```javascript
  function foo() {}

  // 일반 함수로서 호출
  // [[Call]]이 호출된다. 모든 함수 객체는 [[Call]]이 구현되어 있다.
  foo();

  // 생성자 함수로서 호출
  // [[Construct]]가 호출 된다. 이때 [[Construct]]를 갖지 않는다면 에러가 발생한다.
  new foo(); // -> foo {}
  ```

  > 주의할 것은 생성자 함수로서 호출될 것을 기대하고 정의하지 않은 일반 함수(callable이면서 constructor)에 new 연선자를 붙여 호출하면 생성자 함수처럼 동작할 수 있다는 것이다.

### 17.2.6 new 연산자

- 일반 함수와 생성자 함수에 특별한 형식적 차이는 없다.

  - 단, new 연산자와 함께 호출하는 함수는 non-constructor가 아닌 constructor이어야 한다.

    ```javascript
    // 생성자 함수로서 정의하지 않은 일반 함수
    function add(x, y) {
      return x + y;
    }

    // 생성자 함수로서 정의하지 않은 일반 함수를 new 연산자와 함께 호출
    let inst = new add();

    // 함수가 객체를 반환하지 않았으므로 반환문이 무시된다. 따라서 빈 객체가 생성되어 반환된다.
    console.log(inst); // {}

    // 객체를 반환하는 일반 함수
    function createUser(name, role) {
      return { name, role };
    }

    // 일반 함수를 new 연산자와 함께 호출
    inst = new createUser("Lee", "admin");
    // 함수가 생성한 객체를 반환한다.
    console.log(inst); // {name: 'Lee', role: 'admin'}
    ```

  - 반대로 new 연산자 없이 생성자 함수를 호출하면 일반 함수로 호출된다.

    - 다시 말해, 함수 객체의 내부 메서드 [[Construct]]가 호출되는 것이 아니라 [[Call]]이 호출된다.

    ```javascript
    // 생성자 함수
    function Circle(radius) {
      this.radius = radius;
      this.getDiameter = function () {
        return 2 * this.radius;
      };
    }

    // new 연산자 없이 생성자 함수 호출하면 일반 함수로서 호출된다.
    const circle = Circle(5);

    console.log(circle); // undefined

    // 일반 함수 내부의 this는 전역 객체 window를 가리킨다.
    console.log(radius); // 5
    console.log(getDiameter()); // 10

    circle.getDiameter();
    // TypeError: Cannot read property 'getDiameter' of undefined
    ```

    > Circle 함수를 new 연산자와 함께 생성자 함수로서 호출하면 함수 내부의 this는 Circle 생성자 함수가 생성할 인스턴스를 가리킨다. 하지만 Circle 함수를 일반적인 함수로서 호출하면 함수 내부의 this는 전역 개체 window를 가리킨다.
    >
    > 위 예제의 Circle 함수는 일반 함수로서 호출되었기 때문에 Circle 함수 내부의 this는 전역 객체 window를 가리킨다. 따라서 radius 프로퍼티와 getDiameter 메서드는 전역 객체의 프로퍼티와 메서드가 된다.

  - `생성자 함수`는 일반적으로 `첫 문자를 대문자`로 기술하는 `파스칼 케이스로 명명`하여 일반 함수와 구별할 수 있도록 노력한다.

### 17.2.7 new.target

- **IE는 new.target을 지원하지 않는다.**
- new.target은 this와 유사하게 constructor인 모든 함수 내부에서 암묵적인 지역 변수와 같이 사용되며 `메타 프로퍼티`라고 부른다.
- 함수 내부에서 `new.target을 사용`하면 new 연산자와 함께 `생성자 함수로서 호출되었는지 확인`할 수 있다.

  - new 연산자와 함께 `생성자 함수로서 호출`되면 함수 내부의 `new.target은 함수 자신`을 가리킨다.
  - new 연산자 없이 `일반 함수로서 호출`된 함수 내부의 `new.target은 undefined`다.

  ```javascript
  // 생성자 함수
  function Circle(radius) {
    // 이 함수가 new 연산자와 함께 호출되지 않았다면 new.target은 undefined다.
    if (!new.target) {
      // new 연산자와 함께 생성자 함수를 재귀 호출하여 생성된 인스턴스를 반환한다.
      return new Circle(radius);
    }

    this.radius = radius;
    this.getDiameter = function () {
      return 2 * this.radius;
    };
  }

  // new 연산자 없이 생성자 함수를 호출하여도 new.target을 통해 생성자 함수로서 호출된다.
  const circle = Circle(5);
  console.log(circle.getDiameter());
  ```

  - 📄 `스코프 세이프 생성자 패턴(scope-safe constructor)`

    > new.target은 ES6에서 도입된 최신 문법으로 IE에서는 지원하지 않는다. **new.target을 사용할 수 없는 상황이라면 스코프 세이프 생성자 패턴을 사용**할 수 있다.

    ```javascript
    // Scope-safe Constructor Pattern
    function Circle(radius) {
      // 생성자 함수가 new 연산자와 함께 호출되면 함수의 선두에서 빈 객체를 생성하고
      // this에 바인딩한다. 이때 this와 Circle은 프로토타입에 의해 연결된다.

      // 이 함수가 new 연산자와 함께 호출되지 않았다면 이 시점의 this는 전역 객체 window를 가리킨다.
      // 즉, this와 Circle은 프로토타입에 의해 연결되지 않는다.
      if (!(this instanceof Circle)) {
        // new 연산자와 함께 호출하여 생성된 인스턴스를 반환한다.
        return new Circle(radius);
      }

      this.radius = radius;
      this.getDiameter = function () {
        return 2 * this.radius;
      };
    }

    // new 연산자 없이 생성자 함수를 호출하여도 생성자 함수로서 호출된다.
    const circle = Circle(5);
    console.log(circle.getDiameter()); // 10
    ```

    > new 연산자와 함께 생성자 함수에 의해 생성된 객체(인스턴스)는 프로토타입에 의해 생성자 함수와 연결된다. 이를 통해 new 연산자와 함께 호출되었는지 확인할 수 있다.

- 참고: 대부분의 `빌트인 생성자 함수` (Object, String, Number, Boolean, Function, Array, Date, RegExp, Promise 등)는 **new 연산자와 함께 호출되었는지 확인한 후 적절한 값을 반환**한다.

  - 예) Object, Function 생성자 함수는 new 연산자 없이 호출해도 new 연산자와 함께 호출했을 때와 동일하게 동작한다.

    ```javascript
    let obj = new Object();
    console.log(obj); // {}

    obj = Object();
    console.log(obj); // {}

    let f = new Function("x", "return x ** x");
    console.log(f); // f anonymous(x) { return x ** x }

    f = Function("x", "return x ** x");
    console.log(f); // f anonymous(x) { return x ** x }
    ```

  - 하지만, **String, Number, Boolean 생성자 함수**는 new 연산자와 함께 호출했을 때 String, Number, Boolean `객체를 생성하여 반환`하지만 `new 연산자 없이 호출하면 문자열, 숫자, 불리언 값을 반환`한다.

    - 이를 통해 `데이터 타입을 변환하기도 한다.`

    ```javascript
    const str = String(123);
    console.log(str, typeof str); // 123 string

    const num = Number("123");
    console.log(num, typeof num); // 123 number

    const bool = Boolean("true");
    console.log(bool, typeof bool); // true boolean
    ```
