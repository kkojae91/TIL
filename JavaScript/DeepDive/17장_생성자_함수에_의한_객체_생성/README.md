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
