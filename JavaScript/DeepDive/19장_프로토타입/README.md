# 19장 프로토타입

- 자바스크립트는 명령형(impreative), 함수형(functional), 프토타타입 기반(prototype-based), 객체지향 프로그래밍(OOP: Object-Oriented Programming)을 지원하는 멀티 패러다임 프로그래밍 언어다.

- 📄 클래스
  > ES6에서 클래스가 도입되었다. 하지만 ES6 클래스가 기존의 프로토타입 기반 객체지향 모델을 폐지하고 새로운 객체지향 모델을 제공하는 것은 아니다. 사실 클래스도 함수이며, 기존 프로토타입 기반 패턴의 문법적 설탕(Syntax sugar)이라고 볼 수 있다.
  >
  > 클래스와 생성자 함수는 모두 프로토타입 기반의 인스턴스를 생성하지만 정확히 동일하게 동작하지는 않는다. 클래스는 생성자 함수보다 엄격하며 클래스는 생성자 함수에서는 제공하지 않는 기능도 제공한다.
  >
  > 따라서 클래스를 프로토타입 기반 객체 생성 패턴의 단순한 문법적 설탕으로 보기보다는 새로운 객체 생성 메커니즘으로 보는 것이 좀 더 합당하다고 할 수 있다.

## 19.1 객체지향 프로그래밍

- 여러 개의 독립적 단위, 즉 `객체(object)의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임`을 말한다.
- 실세계의 실체(사물이나 개념)를 인식하는 철학적 사고를 프로그래밍에 접목하려는 시도에서 시작한다.

  - 실체는 특징이나 성질을 나타내는 속성(attribute/property)을 가지고 있고, 이를 통해 실체를 인식하거나 구별할 수 있다.
  - **다양한 속성 중에서 프로그램에 필요한 속성만 간추려 내어 표현하려는 것을 추상화(abstraction)**이라 한다.

  ```javascript
  // 이름과 주소 속성을 갖는 객체
  const person = {
    name: "Lee",
    address: "Seoul",
  };

  console.log(person); // {name: 'Lee', address: 'Seoul'}
  ```

  > 이때 프로그래머(subject, 주체)는 이름과 주소 속성으로 표현된 객체(object)인 person을 다른 객체와 구별하여 인식할 수 있다.
  >
  > 이처럼 속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조를 객체라하며, 객체지향 프로그래밍은 독립적인 객체의 집합으로 프로그램을 표현하려는 패러다임이다.

```javascript
const circle = {
  radius: 5, // 반지름

  // 원의 지름: 2r
  getDiameter() {
    return 2 * this.radius;
  },

  // 원의 둘레: 2PIr
  getPerimeter() {
    return 2 * Math.PI * this.radius;
  },

  // 원의 넓이: PIrr
  getArea() {
    return Math.PI * this.radius ** 2;
  },
};

console.log(circle);
// {radius: 5, getDiameter: f, getPerimeter: f, getArea: f}

console.log(circle.getDiameter()); // 10
console.log(circle.getPerimeter()); // 31.41592...
console.log(circle.getArea()); // 78.5398...
```

> 반지름은 원의 상태를 나타내는 데이터이며 원의 지름, 둘레, 넓이를 구하는 것은 동작이다.
>
> `객체 지향 프로그래밍`은 `객체의 상태(state)를 나타내는 데이터`와 `상태 데이터를 조작할 수 있는 동작(behavior)`을 `하나의 논리적인 단위로 묶어 생각`한다.
>
> 따라서 `객체는 상태 데이터와 동작을 하나의 논리적 단위로 묶은 복합적인 자료구조`라고 할 수 있다.

## 19.2 상속과 프로토타입

- `상속(inheritance)`

  - 객체지향 프로그래밍의 핵심 개념으로, 어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는 것을 말한다.

- 자바스크립트는 `프로토타입을 기반으로 상속을 구현`

  - 불필요한 중복을 제거

  ```javascript
  // 생성자 함수
  function Circle(radius) {
    this.radius = radius;
    this.getArea = function () {
      return Math.PI * this.radius ** 2;
    };
  }

  // 반지름이 1인 인스턴스 생성
  const circle1 = new Circle(1);

  // 반지름이 2인 인스턴스 생성
  const circle2 = new Circle(2);

  // Circle 생성자 함수는 인스턴스를 생성할 때마다 동일한 동작을 하는
  // getArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
  // getArea 메서드는 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.
  console.log(circle1.getArea === circle2.getArea);

  console.log(circle1.getArea()); // 3.14159...
  console.log(circle2.getArea()); // 12.5663...
  ```

  > Circle 생성자 함수가 생성하는 모든 객체(인스턴스)는 radius 프로퍼티와 getArea 메서드를 갖는다. radius 프로퍼티 값은 일반적으로 인스턴스마다 다르다 하지만 getArea 메서드는 모든 인스턴스가 동일한 내용의 메서드를 사용하므로 단 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다. 그런데 Circle 생성자 함수는 인스턴스를 생성할 때마다 getArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
  >
  > 이처럼 동일한 생성자 함수에 의해 생성된 모든 인스턴스가 동일한 메서드를 중복 소유하는 것은 메모리를 불필요하게 낭비한다. 또한 인스턴스를 생성할 때마다 메서드를 생성하므로 퍼포먼스에도 악영향을 준다.

  ```javascript
  // 생성자 함수
  function Circle(radius) {
    this.radius = radius;
  }

  // Circle 생성자 함수가 생성한 모든 인스턴스가 getArea 메서드를
  // 공유해서 사용할 수 있도록 프로토타입에 추가한다.
  // 프로토타입은 Circle 생성자 함수의 prototype 프로퍼티에 바인딩되어 있다.
  Circle.prototype.getArea = function () {
    return Math.PI * this.radius ** 2;
  };

  // 인스턴스 생성
  const circle1 = new Circle(1);
  const circle2 = new Circle(2);

  // Circle 생성자 함수가 생성한 모든 인스턴스는 부모 객체의 역할을 하는
  // 프로토타입 Circle.prototype으로부터 getArea 메서드를 상속받는다.
  // 즉, Circle 생성자 함수가 생성하는 모든 인스턴스는 하나의 getArea 메서드를 공유한다.
  console.log(circle1.getArea === circle2.getArea); // true

  console.log(circle1.getArea()); // 3.14159...
  console.log(circle2.getArea()); // 12.5663...
  ```

  > Circle 생성자 함수가 생성한 모든 인스턴스는 자신의 프로토타입, 즉 상위(부모) 객체 역할을 하는 Circle.prototype의 모든 프로퍼티와 메서드를 상속받는다.
  >
  > getArea 메서드는 단 하나만 생성되어 프로토타입인 Circle.prototype의 메서드로 할당되어 있다. 따라서 Circle 생성자 함수가 생성하는 모든 인스턴스는 getArea 메서드를 상속받아 사용할 수 있다. 즉, 자신의 상태를 나타내는 radius 프로퍼티만 개별적으로 소유하고 `내용이 동일한 메서드는 상속을 통해 공유하여 사용`하는 것이다.

## 19.3 프로토타입 객체

- `프로토타입 객체(프로토타입)`란 객체지향 프로그래밍의 근간을 이루는 `객체 간 상속(inhertance)을 구현하기 위해 사용`된다.
- 프로토타입은 어떤 객체의 상위(부모) 객체의 역할을 하는 객체로서 다른 객체에 공유 프로퍼티(메서드 포함)를 제공한다. **프로토타입을 상속받은 하위(자식) 객체는 상위 객체의 프로퍼티를 자신의 프로퍼티처럼 자유롭게 사용**할 수 있다.

### 19.3.1 `__proto__` 접근자 프로퍼티

- 모든 객체는 `__proto__` 접근자 프로퍼티를 통해 자신의 프로토타입, 즉 `[[Prototype]] 내부 슬롯에 간접적으로 접근`할 수 있다.

#### `__proto__`는 접근자 프로퍼티다.

- 자바스크립트는 원칙적으로 내부 슬롯과 내부 메서드에 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지 않는다.

  - 단, 일부 내부 슬롯과 내부 메서드에 한하여 간접적으로 접근할 수 있는 수단을 제공하기는 한다.
  - [[Prototype]] 내부 슬롯에도 직접 접근할 수 없으며 `__proto__` 접근자 프로퍼티를 통해 간접적으로 [[Prototype]] 내부 슬롯의 값, 즉 프로토타입에 접근할 수 있다.
    - 접근자 프로퍼티는 [[Get]], [[Set]] 프로퍼티 어트리뷰트로 구성된 프로퍼티다.

  ```javascript
  const obj = {};
  const parent = { x: 1 };

  // getter 함수인 get __proto__가 호출되어 obj 객체의 프로토타입을 취득
  obj.__proto__;

  // setter 함수인 set __proto__가 호출되어 obj 객체의 프로토타입을 교체
  obj.__proto__ = parent;

  console.log(obj.x); // 1
  ```

#### `__proto__` 접근자 프로퍼티는 상속을 통해 사용된다.

- `__proto__` 접근자 프로퍼티는 객체가 직접 소유하는 프로퍼티가 아니라 `Object.prototype의 프로퍼티`다.
- 모든 객체는 상속을 통해 `Object.prototype.__proto__` 접근자 프로퍼티를 사용할 수 있다.

  ```javascript
  const person = { name: "Lee" };

  // person 객체는 __proto__ 프로퍼티를 소유하지 않는다.
  console.log(person.hasOwnProperty("__proto__")); // false

  // __proto__ 프로퍼티는 모든 객체의 프로토타입 객체인 Object.prototype의 접근자 프로퍼티다.
  console.log(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__"));
  // {get: f, set: f, enumerable: false, configurable: true}

  // 모든 객체는 Object.prototype의 접근자 프로퍼티 __proto__를 상송받아 사용할 수 있다.
  console.log({}.__proto__ === Object.prototype); // true
  ```

- 📄 Object.prototype
  > 모든 객체는 프로토타입의 계층 구조인 프로토타입 체인에 묶여 있다. **자바스크립트 엔진은 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 `__proto__` 접근자 프로퍼티가 가리키는 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색**한다. 프로토타입 체인의 종점. 즉 `프로토타입 체인의 최상위 객체는 Object.prototype`이며, 이 객체의 프로퍼티와 메서드는 `모든 객체에 상속`된다.

#### `__proto__` 접근자 프로퍼티를 통해 프로토타입에 접근하는 이유.

- [[Prototype]] 내부 슬롯 값, 즉 프로토타입에 접근하기 위해 `접근자 프로퍼티를 사용하는 이유는 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지`하기 위해서다.

  ```javascript
  const parent = {};
  const child = {};

  // child 프로토타입을 parent로 설정
  child.__proto__ = parent;

  //parent 프로토타입을 child로 설정
  parent.__proto__ = child; // TypeError: Cyclic __proto__ value
  ```

  > 위 예제가 정상적으로 처리되면 서로가 자신의 프로토타입이 되는 비정상적인 프로토타입 체인이 만들어지기 때문에 `__proto__` 접근자 프로퍼티는 에러를 발생시킨다.
  >
  > 프로토타입 체인은 단방향 링크드 리스트로 구현되어야 한다.
  >
  > 따라서 아무런 체크 없이 무조건적으로 프로토타입을 교체할 수 없도록 `__proto__` 접근자 프로퍼티를 통해 프로토타입에 접근하고 교체하도록 구현되어 있다.

#### `__proto__` 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않는다.

- `__proto__` 접근자 프로퍼티는 ES5까지 ECMAScript 사양에 포함되지 않은 비표준이었다.
- ES6에서 `__proto__`를 표준으로 채택했다.(IE는 11버전 이상부터 지원)
- 하지만, 코드 내에서 `__proto__` 접근자 프로퍼티를 직접 사용하는 것은 권장하지 않는다.

  - **모든 객체가 `__proto__` 접근자 프로퍼티를 사용할 수 있는 것은 아니기 때문**

  ```javascript
  // obj는 프로토타입 체인의 종점이다. 따라서 Object.__proto__를 상속받을 수 없다.
  const obj = Object.create(null);

  // obj는 Object.__proto__를 상속받을 수 없다.
  console.log(obj.__proto__); // undefined

  // 따라서 __proto__보다 Object.getPrototypeOf 메서드를 사용하는 편이 좋다.
  console.log(Object.getPrototypeOf(obj)); // null
  ```

  > `__proto__` 접근자 프로퍼티 대신 프로토타입의 참조를 취득하고 싶은 경우에는 Object.getPrototypeOf 메서드를 사용하고, **프로토타입을 교체하고 싶은 경우에는 Object.setPrototypeOf 메서드를 사용하는 것을 권장**한다.

  ```javascript
  const obj = {};
  const parent = { x: 1 };

  // obj 객체의 프로토타입을 취득
  Object.getPrototypeOf(obj); // obj.__proto__;
  // obj 객체의 프로토타입을 교체
  Object.setPrototypeOf(obj, parent); // obj.__proto__ = parent;

  console.log(obj.x); // 1
  ```

  > Object.getPrototypeOf 메서드와 Object.setPrototypeOf 메서드는 `get Object.prototype.__proto__`와 `set Object.prototypeOf.__proto__`의 처리내용과 정확히 일치한다.
  >
  > Object.getPrototypeOf 메서드는 ES5에서 도입된 메서드 IE9 이상에서 지원된다.
  >
  > Object.setPrototypeOf 메서드는 ES6에서 도입된 메서드 IE11 이상에서 지원한다.

### 19.3.2 함수 객체의 prototype 프로퍼티

- **함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 생성할 인스턴스의 프로토타입을 가리킨다.**

  ```javascript
  // 함수 객체는 prototype 프로퍼티를 소유한다.
  (function () {}.hasOwnProperty("prototype")); // -> true

  // 일반 객체는 prototype 프로퍼티를 소유하지 않는다.
  ({}.hasOwnProperty("prototype")); // -> false
  ```

- non-structor인 `화살표 함수`와 `ES6 메서드 축약 표현`으로 정의한 메서드는 **prototype 프로퍼티를 소유하지 않으며 프로토타입도 생성하지 않는다.**

  ```javascript
  // 화살표 함수는 non-constructor다.
  const Person = (name) => {
    this.name = name;
  };

  // non-constructor는 prototype 프로퍼티를 소유하지 않는다.
  console.log(Person.hasOwnProperty("prototype")); // false

  // non-constructor는 프로토타입을 생성하지 않는다.
  console.log(Person.prototype); // undefined

  // ES6 메서드 축약 표현으로 정의한 메서드는 non-structor다.
  const obj = {
    foo() {},
  };

  // non-constructor는 prototype 프로퍼티를 소유하지 않는다.
  console.log(obj.foo.hasOwnProperty("prototype")); // false

  // non-constructor는 프로토타입을 생성하지 않는다.
  console.log(obj.foo.prototype); // undefined
  ```

  > 생성자 함수로 호출하기 위해 정의하지 않은 일반 함수(함수 선언문, 함수 표현식)도 prototype 프로퍼티를 소유하지만 객체를 생성하지 않는 일반 함수의 prototype 프로퍼티는 아무런 의미가 없다.
  >
  > 모든 객체가 가지고 있는(엄밀히 말하면 Object.prototype으로부터 상속받은) `__proto__` 접근자 프로퍼티와 함수 객체만이 가지고 있는 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킨다.
  >
  > 하지만 이들 프로퍼티를 사용하는 주체가 다르다
  > 구분 | 소유 | 값 | 사용 주체 | 사용 목적
  > --|--|--|--|--
  > `__proto__` 접근자 프로퍼티 | 모든 객체 | 프로토타입의 참조 | 모든 객체 | 객체가 자신의 프로토타입에 접근 또는 교체하기 위해 사용
  > prototype 프로퍼티 | constructor | 프로토타입의 참조 | 생성자 함수 | 생성자 함수가 자신이 생성할 객체(인스턴스)의 프로토타입을 할당하기 위해 사용

  ```javascript
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  const me = new Person("Lee");

  // 결국 Person.prototype과 me.__proto__는 결국 동일한 프로토타입을 가리킨다.
  console.log(Person.prototype === me.__proto__); // true
  ```

### 19.3.3 프로토타입의 constructor 프로퍼티와 생성자 함수

- **모든 프로토타입은 constructor 프로퍼티를 갖는다.**
- **constructor 프로퍼티는 prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킨다.**
- 이 연결은 생성자 함수가 생성될 때, 즉 함수 객체가 생성될 때 이뤄진다.

  ```javascript
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  const me = new Person("Lee");

  // me 객체의 생성자 함수는 Person이다.
  console.log(me.constructor === Person); // true
  ```

  > 위 예제에서 Person 생성자 함수는 me 객체를 생성했다. 이때 me 객체는 프로토타입의 constructor 프로퍼티를 통해 생성자 함수와 연결된다. me 객체에는 constructor 프로퍼티가 없지만 me 객체의 프로토타입인 Person.prototype에는 constructor 프로퍼티가 있다. 따라서 me 객체는 프로토타입인 Person.prototype의 constructor 프로퍼티를 상속받아 사용할 수 있다.

## 19.4 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

- 리터럴 표기법에 의해 생성된 객체도 상속을 위해 프로토타입이 필요하다.
  - 따라서 리터럴 표기법에 의해 생성된 객체도 가상적인 생성자 함수를 갖는다.
  - 프로토타입은 생성자 함수와 더불어 생성되며 prototype, constructor 프로퍼티에 의해 연결되어 있기 때문이다.
- **프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍(pair)으로 존재**한다.

| 리터럴 표기법      | 생성자 함수 | 프로토타입         |
| ------------------ | ----------- | ------------------ |
| 객체 리터럴        | Object      | Object.prototype   |
| 함수 리터럴        | Function    | Function.prototype |
| 배열 리터럴        | Array       | Array.prototype    |
| 정규 표현식 리터럴 | RegExp      | RegExp.prototype   |

## 19.5 프로토타입의 생성 시점

### 19.5.1 사용자 정의 생성자 함수와 프로토타입 생성 시점

- 생성자 함수로서 호출할 수 있는 함수, 즉 **constructor는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.**

  ```javascript
  // 함수 정의(constructor)가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.
  console.log(Person.prototype); // {constructor: f}

  // 생성자 함수
  function Person(name) {
    this.name = name;
  }
  ```

  > 함수 선언문은 런타임 이전에 자바스크립트엔진에 의해 먼저 실행된다. 따라서 함수 선언문으로 정의된 Person 생성자 함수는 어떤 코드보다 먼저 평가되어 함수 객체가 된다. 이때 프로토타입도 더불어 생성된다. 생성된 프로토타입은 Person 생성자 함수의 prototype 프로퍼티에 바인딩된다.

- 생성자 함수로서 호출할 수 없는 함수, 즉 **non-constructor는 프로토타입이 생성되지 않는다.**

  ```javascript
  // 화살표 함수는 non-constructor다.
  const Person = (name) => {
    this.name = name;
  };

  // non-constructor는 프로토타입이 생성되지 않는다.
  console.log(Person.prototype); // undefined
  ```

- 사용자 정의 생성자 함수는 자신이 평가되어 함수 객체로 생성되는 시점에 프로토타입도 더불어 생성되며, 생성된 프로토타입의 프로토타입은 언제나 Object.prototype이다.

### 19.5.2 빌트인 생성자 함수와 프로토타입 생성 시점

- 모든 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성된다.

  - 생성된 프로토타입은 빌트인 생성자 함수의 prototype 프로퍼티에 바인딩된다.

- `📄 전역 객체(global object)`
  > 전역 객체는 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 생성되는 특수한 객체다. 전역 객체는 클라이언트 사이드 환경(브라우저)에서는 window, 서버 사이드 환경(Node.js)에서는 global 객체를 의미한다.
  >
  > 전역 객체는 표준 빌트인 객체(Object, String, Number, Function, Array, ...)들과 환경에 따른 호스트 객체(클라이언트 Web API 또는 Node.js의 호스트 API), 그리고 var 키워드로 선언한 전역 변수와 전역 함수를 프로퍼티로 갖는다. Math, Reflect, JSON을 제외한 표준 빌트인 객체는 모두 생성자 함수다.

## 19.6 객체 생성 방식과 프로토타입의 결정

### 19.6.1 객체 리터럴에 의해 생성된 객체의 프로토타입

- 자바스크립트 엔진은 객체 리터럴을 평가하여 객체를 생성할 때 추상 연산 OrdinaryObjectCreate를 호출한다.

  - 이때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토타입은 Object.prototype이다.
  - 즉, 객체 리터럴에 의해 생성되는 객체의 프로토타입은 Object.prototype이다.

  ```javascript
  const obj = { x: 1 };

  // 객체 리터럴에 의해 생성된 obj 객체는 Object.prototype을 상속받는다.
  console.log(obj.constructor === Object); // true
  console.log(obj.hasOwnProperty("x")); // true
  ```

### 19.6.2 Object 생성자 함수에 의해 생성된 객체의 프로토타입

- Object 생성자 함수를 인수 없이 호출하면 빈 객체가 생성된다.
- Object 생성자 함수를 호출하면 객체 리터럴과 마찬가지로 추상 연산 OrdinaryObjectCreate가 호출된다.

  - 이때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토타입은 Object.prototype이다.
  - 즉, Object 생성자 함수에 의해 생성되는 객체의 프로토타입은 Object.prototype이다.

  ```javascript
  const obj = new Object();
  obj.x = 1;

  // Object 생성자 함수에 의해 생성된 obj객체는 Object.prototype을 상속받는다.
  console.log(obj.constructor === Object); // true
  console.log(obj.hasOwnProperty("x")); // true
  ```

### 19.6.3 생성자 함수에 의해 생성된 객체의 프로토타입

- new 연산자와 함께 생성자 함수를 호출하여 인스턴스를 생성하면 다른 객체 생성 방식과 마찬가지로 추상 연산 OrdinaryObjectCreate가 호출된다.

  - 이때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체다.
  - 즉, 생성자 함수에 의해 생성되는 객체의 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체다.

  ```javascript
  function Person(name) {
    this.name = name;
  }

  // 프로토타입 메서드
  Person.prototype.sayHello = function () {
    console.log(`Hi! My name is ${this.name}`);
  };

  const me = new Person("Lee");
  const you = new Person("Kim");

  me.sayHello(); // Hi! My name is Lee
  you.sayHello(); // Hi! My name is Kim
  ```

  > Person 생성자 함수를 통해 생성된 모든 객체는 프로토타입에 추가된 sayHello 메서드를 상속받아 자신의 메서드처럼 사용할 수 있다.

## 19.7 프로토타입 체인

```javascript
function Person(name) {
  this.name = name;
}

// 프로토타입 메서드
Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`);
};

const me = new Person("Lee");

// hasOwnProperty는 Object.prototype의 메서드다.
console.log(me.hasOwnProperty("name")); // true
```

> Person 생성자 함수에 의해 생성된 me 객체는 Object.prototype의 메서드인 hasOwnProperty를 호출할 수 있다. 이것은 me 객체가 Person.prototype뿐만 아니라 Object.prototype도 상속받았다는 것을 의미한다.

- 프로토타입의 프로토타입은 언제나 Object.prototype이다.

  ```javascript
  Object.getPrototypeOf(me) === Person.prototype; // true

  Object.getPrototypeOf(Person.prototype) === Object.prototype; // true
  ```

  > 자바스크립트는 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 [[Prototype]] 내부 슬롯의 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다. 이를 프로토타입 체인이라 한다. 프로토타입 체인은 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 메커니즘이다.

- **Object.prototype을 프로토타입 체인의 종점(end of prototype chain)이라 한다.**

  - Object.prototype의 프로토타입, 즉 [[Prototype]]의 내부 슬롯의 값은 null이다.
  - 프로토타입 체인의 종점인 Object.prototype에서도 프로퍼티를 검색할 수 없는 경우 undefined를 반환한다.
    - 이때 에러가 발생하지 않는점이 주의하자!

- 프로토타입 체인은 상속과 프로퍼티 검색을 위한 메커니즘이라 할 수 있다.
- 스코프 체인은 식별자 검색을 위한 메커니즘이라 할 수 있다.
  > **스코프 체인과 프로토타입 체인은 서로 연관없이 별도로 동작하는 것이 아니라 서로 협력하여 식별자와 프로퍼티를 검색하는데 사용된다.**

### 19.8 오버라이딩과 프로퍼티 섀도잉

- `📄 오버라이딩(overriding)`

  > 상위 클래스가 가지고 있는 메서드를 하위 클래스가 재정의하여 사용하는 방식

- `📄 프로퍼티 섀도잉(property shadowing)`
  > 상속 관계에 의해 프로퍼티가 가려지는 현상

```javascript
const Person = (function () {
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  // 프로토타입 메서드
  Person.prototype.sayHello = function () {
    console.log(`Hi! My name is ${this.name}`);
  };

  // 생성자 함수를 반환
  return Person;
})();

const me = new Person("Lee");

// 인스턴스 메서드
me.sayHello = function () {
  console.log(`Hey! My name is ${this.name}`);
};

// 인스턴스 메서드가 호출된다. 프로토타입 메서드는 인스턴스 메서드에 의해 가려진다.
me.sayHello(); // Hey! My name is Lee
```

> 프로토타입이 소유한 프로퍼티(메서드 포함)를 프로토타입 프로퍼티, 인스턴스가 소유한 프로퍼티를 인스턴스 프로퍼티라고 부른다.
>
> 프로토타입 프로퍼티와 같은 이름의 프로퍼티를 인스턴스에 추가하면 프로토타입 체인을 따라 프로토타입 프로퍼티를 검색하여 프로토타입 프로퍼티를 덮어쓰는 것이 아니라 인스턴스 프로퍼티로 추가한다. 이때 인스턴스 메서드 sayHello는 프로토타입 메서드 sayHello를 오버라이딩했고 프로토타입 메서드 sayHello는 가려진다(프로퍼티 섀도잉).

- 프로퍼티를 삭제하는 경우도 마찬가지다. 위 예제에서 추가한 인스턴스 메서드 sayHello를 삭제해보자.

  ```javascript
  // 인스턴스 메서드를 삭제한다.
  delete me.sayHello;
  // 인스턴스에는 sayHello 메서드가 없으므로 프로토타입 메서드가 호출된다.
  me.sayHello(); // Hi! My name is Lee
  ```

  > 당연히 프로토타입 메서드가 아닌 인스턴스 메서드 sayHello가 삭제된다.

- 다시 한번 sayHello 메서드를 삭제하여 프로토타입 메서드의 삭제를 시도해보자.

  ```javascript
  // 프로토타입 체인을 통해 프로토타입 메서드가 삭제되지 않는다.
  delete me.sayHello;
  // 프로토타입 메서드가 호출된다.
  me.sayHello(); // Hi! My name is Lee
  ```

  > 이와 같이 하위 객체를 통해 프로토타입의 프로퍼티를 변경 또는 삭제하는 것은 불가능하다. 다시 말해 하위 객체를 통해 프로토타입에 get 엑세스는 허용되나 set 엑세스는 허용되지 않는다.

- **프로토타입 프로퍼티를 변경 또는 삭제하려면 하위 객체를 통해 프로토타입 체인으로 접근하는 것이 아니라 프로토타입에 직접 접근**해야 한다.

  ```javascript
  // 프로토타입 메서드 변경
  Person.prototype.sayHello = function () {
    console.log(`Hey! My name is ${this.name}`);
  };
  me.sayHello(); // Hey! My name is Lee

  // 프로토타입 메서드 삭제
  delete Person.prototype.sayHello;
  me.sayHello(); // TypeError: me.sayHello is not a function
  ```

## 19.9 프로토타입의 교체

- 프로토타입은 임의의 다른 객체로 변경할 수 있다.
  - 이러한 특징을 활용하여 **객체 간의 상속 관계를 동적으로 변경**할 수 있다.

### 19.9.1 생성자 함수에 의한 프로토타입의 교체

```javascript
const Person = (function () {
  function Person(name) {
    this.name = name;
  }

  // 1. 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    sayHello() {
      console.log(`Hi! My name is ${this.name}`);
    },
  };

  return Person;
})();

const me = new Person("Lee");
```

> 1.에서 Person.prototype에 객체 리터럴을 할당했다. 이는 Person 생성자 함수가 생성할 객체의 프로토타입을 객체 리터럴로 교체한 것이다.
>
> 프로토타입으로 교체한 객체 리터럴에는 constructor 프로퍼티가 없다. 따라서 me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나온다.

```javascript
// 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
console.log(me.constructor === Person); // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색된다.
console.log(me.constructor === Object); // true
```

> 이처럼 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.

- 프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가하여 프로토타입의 constructor 프로퍼티를 되살린다.

  ```javascript
  const Person = (function () {
    function Person(name) {
      this.name = name;
    }

    // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
    Person.prototype = {
      // constructor 프로퍼티와 생성자 함수 간의 연결을 설정
      constructor: Person,
      sayHello() {
        console.log(`Hi! My name is ${this.name}`);
      },
    };

    return Person;
  })();

  const me = new Person("Lee");

  // constructor 프로퍼티가 생성자 함수를 가리킨다.
  console.log(me.constructor === Person); // true
  console.log(me.constructor === Object); // false
  ```

- 생성자 함수에 의한 프로토타입 교체는 Person 생성자 함수의 prototype 프로퍼티가 교체된 프로토타입을 가리킨다.

### 19.9.2 인스턴스에 의한 프로토타입의 교체

```javascript
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 프로토타입으로 교체할 객체
const parent = {
  sayHello() {
    console.log(`Hi! My name is ${this.name}`);
  },
};

// 1. me 객체의 프로토타입을 parent 객체로 교체한다.
Object.setPrototypeOf(me, parent);
// 위 코드는 아래의 코드와 동일하게 동작한다.
// me.__proto__ = parent;

me.sayHello(); // Hi! My name is Lee
```

> 1.에서 me 객체의 프로토타입을 parent객체로 교체했다. 생성자 함수에 의한 프로토타입의 교체와 마찬가지로 프로토타입으로 교체한 객체에는 constructor 프로퍼티가 없으므로 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다. 따라서 프로토타입의 constructor 프로퍼티로 me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나온다.

```javascript
// 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
console.log(me.constructor === Person); // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색된다.
console.log(me.constructor === Object); // true
```

- 프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가하고 생성자 함수의 prototype 프로퍼티를 재설정하여 파괴된 생성자 함수와 프로토타입 간의 연결을 되살려 보자!

  ```javascript
  function Person(name) {
    this.name = name;
  }

  const me = new Person("Lee");

  // 프로토타입으로 교체할 객체
  const parent = {
    // constructor 프로퍼티와 생성자 함수 간의 연결을 설정
    constructor: Person,
    sayHello() {
      console.log(`Hi! My name is ${this.name}`);
    },
  };

  // 생성자 함수의 prototype 프로퍼티와 프로토타입 간의 연결을 설정
  Person.prototype = parent;

  // me 객체의 프로토타입을 parent 객체로 교체한다.
  Object.setPrototypeOf(me, parent);
  // 위 코드는 아래의 코드와 동일하게 동작한다.
  // me.__proto__ = parent;

  me.sayHello(); // Hi! My name is Lee

  // constructor 프로퍼티가 생성자 함수를 가리킨다.
  console.log(me.constructor === Person); // true
  console.log(me.constructor === Object); // false

  // 생성자 함수의 prototype 프로퍼티가 교체된 프로토타입을 가리킨다.
  console.log(Person.prototype === Object.getPrototypeOf(me)); // true
  ```

  > 이처럼 프로토타입 교체를 통해 객체 간의 상속 관계를 동적으로 변경하는 것은 꽤나 번거롭다. 따라서 프로토타입은 직접 교체하지 않는 것이 좋다. 상속 관계를 인위적으로 설정하려면 직접 상속이 더 편리하고 안전하다. 또 ES6에서 도입된 클래스를 사용하면 간편하고 직관적으로 상속 관계를 구현할 수 있다.

- 인스턴스에 의한 프로토타입 교체는 Person 생성자 함수의 prototype 프로퍼티가 교체된 프로토타입을 가리키지 않는다.

## 19.10 instanceof 연산자

- instanceof 연산자는 이항 연산자로서 `좌변에 객체를 가리키는 식별자`, `우변에 생성자 함수를 가리키는 식별자를 피연산자`로 받는다.

  - 만약 `우변의 피연산자가 함수가 아닌 경우 TypeError가 발생`한다.
  - **우변의 생성자 함수의 prototype에 바인딩된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 true로 평가되고, 그렇지 않은 경우에는 false로 평가된다.**

  ```javascript
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  const me = new Person("Lee");

  // Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
  console.log(me instanceof Person); // true
  // Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
  console.log(me instanceof Object); // true
  ```

  - instancof 연산자는 프로토타입의 constructor 프로퍼티가 가리키는 생성자 함수를 찾는 것이 아니라 생성자 함수의 prototype에 바인딩된 객체가 프로토타입 체인 상에 존재하는지 확인한다.

- 생성자 함수의 prototype 프로퍼티와 프로토타입 간의 연결은 파괴되지 않으므로 instanceof는 아무런 영향을 받지 않는다.

  ```javascript
  const Person = (function () {
    function Person(name) {
      this.name = name;
    }

    // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
    Person.prototype = {
      sayHello() {
        console.log(`Hi! My name is ${this.name}`);
      },
    };

    return Person;
  })();

  const me = new Person("Lee");

  // constructor 프로퍼티와 생성자 함수 간의 연결이 파괴되어도 instanceof는 아무런 영향을 받지 않는다.
  console.log(me.constructor === Person); // false

  // Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
  console.log(me instanceof Person); // true
  // Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
  console.log(me instanceof Object); // true
  ```

## 19.11 직접 상속

### 19.11.1 Object.create에 의한 직접 상속

- Object.create 메서드는 명시적으로 프로토타입을 지정하여 새로운 객체를 생성한다.

  - Object.create 메서드도 다른 객체 생성 방식과 마찬가지로 추상 연산 OrdinaryObjectCreate를 호출한다.
  - Object.create 첫 번째 매개변수에는 생성할 객체의 프로토타입으로 지정할 객체를 전달한다.
  - 두 번째 매개변수에는 생성할 객체의 프로퍼티 키와 프로퍼티 디스크립터 객체로 이뤄진 객체를 전달한다. (두 번째 인수는 옵션이므로 생략 가능)

- `Object.create 메서드의 장점`

  - new 연산자가 없이도 객체를 생성할 수 있다.
  - 프로토타입을 지정하면서 객체를 생성할 수 있다.
  - 객체 리터럴에 의해 생성된 객체도 상속받을 수 있다.

```javascript
// 프로토타입이 null인 객체, 즉 프로토타입 체인의 종점에 위치하는 객체를 생성한다.
const obj = Object.create(null);

obj.a = 1;

console.log(Object.getPrototypeOf(obj) === null); // true

// obj는 Object.prototype의 빌트인 메서드를 사용할 수 없다.
console.log(obj.hasOwnProperty("a"));
// TypeError: obj.hasOwnProperty is not a function
```

- 위 예제와 같은 이유 때문에 Object.prototype의 빌트인 메서드는 직접적으로 호출하기보다는 간접적으로 호출하는게 좋다.

```javascript
// 프로토타입이 null인 객체를 생성한다.
const obj = Object.create(null);
obj.a = 1;

// console.log(obj.hasOwnProperty('a'));
// TypeError: obj.hasOwnProperty is not a function

// Object.prototype의 빌트인 메서드는 객체로 직접 호출하지 않는다.
console.log(Object.prototype.hasOwnProperty.call(obj, "a")); // true
```

### 19.11.2 객체 리터럴 내부에서 `__proto__`에 의한 직접 상속

- ES6에서는 객체 리터럴 내부에서 `__proto__` 접근자 프로퍼티를 사용하여 직접 상속을 구현할 수 있다.

  ```javascript
  const myProto = { x: 10 };

  // 객체 리터럴에 의해 객체를 생성하면서 프로토타입을 지정하여 직접 상속받을 수 있다.
  const obj = {
    y: 20,
    // 객체를 직접 상속받는다.
    // obj -> myProto -> Object.prototype -> null
    __proto__: myProto,
  };
  /*
   * 위 코드는 아래와 동일하다.
   const obj = Object.create(myProto, {
     y: {value: 20, writable: true, enumerable: true, configurable: true}
   });
   */

  console.log(obj.x, obj.y); // 10 20
  console.log(Object.getPrototypeOf(obj) === myProto); // true
  ```

## 19.12 정적 프로퍼티/메서드

- **정적(static) 프로퍼티/메서드는 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출할 수 있는 프로퍼티/메서드를 말한다.**

  ```javascript
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  // 프로토타입 메서드
  Person.prototype.sayHello = function () {
    console.log(`Hi! My name is ${this.name}`);
  };

  // 정적 프로퍼티
  Person.staticProp = "static prop";

  // 정적 메서드
  Person.staticMethod = function () {
    console.log("staticMethod");
  };

  const me = new Person("Lee");

  // 생성자 함수에 추가한 정적 프로퍼티/메서드는 생성자 함수로 참조/호출한다.
  Person.staticMethod(); // staticMethod

  // 정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없다.
  // 인스턴스로 참조/호출할 수 있는 프로퍼티/메서드는 프로토타입 체인 상에 존재해야한다.
  me.staticMethod(); // TypeError: me.staticMethod is not a function
  ```

  > Person 생성자 함수는 객체이므로 자신의 프로퍼티/메서드를 소유할 수 있다. Person 생성자 함수 객체가 소유한 프로퍼티/메서드를 정적 프로퍼티/메서드라고 한다.
  >
  > 정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없다.

## 19.13 프로퍼티 존재 확인

### 19.13.1 in 연산자

- **in 연산자는 객체 내에 특정 프로퍼티가 존재하는지 여부를 확인**한다.

  ```javascript
  const person = {
    name: "Lee",
    address: "Seoul",
  };

  // person 객체에 name 프로퍼티가 존재한다.
  console.log("name" in person); // true
  // person 객체에 address 프로퍼티가 존재한다.
  console.log("address" in person); // true
  // person 객체에 age 프로퍼티가 존재하지 않는다.
  console.log("age" in person); // false
  ```

  > in 연산자는 확인 대상 객체의 프로퍼티뿐만 아니라 확인 대상 객체가 상속받은 모든 프로토타입의 프로퍼티를 확인하느므로 주의가 필요하다!

  ```javascript
  console.log("toString" in person); // true
  ```

  > toString은 Object.prototype의 메서드이기 때문에 toString in person은 true가 출력된다.

- ES6에서 도입된 `Reflect.has 메서드`를 사용하면 **in 연산자와 동일하게 동작**한다.

  ```javascript
  const person = { name: "Lee" };

  console.log(Reflect.has(person, "name")); // true
  console.log(Reflect.has(person, "toString")); // true
  ```

### 19.13.2 Object.prototype.hasOwnProperty 메서드

- `Object.prototype.hasOwnProperty 메서드`를 사용해도 **객체에 특정 프로퍼티가 존재하는지 확인**할 수 있다.
  ```javascript
  console.log(person.hasOwnProperty("name")); // true
  console.log(person.hasOwnProperty("age")); // true
  ```
  > Object.prototype.hasOwnProperty 메서드는 이름에서 알 수 있듯이 인수로 전달받은 프로퍼티 키가 **객체 고유의 프로퍼티 키인 경우에만 `true`를 반환**하고 **상속받은 프로토타입의 프로퍼티의 키인 경우 `false`를 반환**한다.
  ```javascript
  console.log(person.hasOwnProperty('toString)); // false
  ```

## 19.14 프로퍼티 열거

### 19.14.1 for ... in 문

- **객체의 모든 프로퍼티를 순회하며 열거(enumeration)하려면 for ... in 문을 사용**한다.

  ```javascript
  const person = {
    name: "Lee",
    address: "Seoul",
  };

  // for ... in 문의 변수 prop에 person 객체의 프로퍼티 키가 할당된다.
  for (const key in person) {
    console.log(key + ": " + person[key]);
  }
  // name: Lee
  // address: Seoul
  ```

- for ... in 문은 객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중에서 **프로퍼티 어트리뷰트 `[[Enumerable]]의 값이 true인 프로퍼티`를 순회하며 열거(enumeration)한다.**

  ```javascript
  const person = {
    name: "Lee",
    address: "Seoul",
    __proto__: { age: 20 },
  };

  for (const key in person) {
    console.log(key + ": " + person[key]);
  }
  // name: Lee
  // address: Seoul
  // age: 20
  ```

- for ... in 문은 프로퍼티 키가 `심벌인 프로퍼티는 열거하지 않는다.`

  ```javascript
  const sym = Symbol();
  const obj = {
    a: 1,
    [sym]: 10,
  };

  for (const key in obj) {
    console.log(key + ": " + obj[key]);
  }
  // a: 1
  ```

- 상속받은 프로퍼티는 제외하고 객체 자신의 프로퍼티만 열거하려면 **`Object.prototype.hasOwnProperty 메서드`를 사용하여 객체 자신의 프로퍼티인지 확인**해야한다.

  ```javascript
  const person = {
    name: "Lee",
    address: "Seoul",
    __proto__: { age: 20 },
  };

  for (const key in person) {
    // 객체 자신의 프로퍼티인지 확인한다.
    if (!person.hasOwnProperty(key)) {
      continue;
    }

    console.log(key + ": " + person[key]);
  }
  // name: Lee
  // address: Seoul
  ```

- for ... in 문은 프로퍼티를 열거할 때 **순서를 보장하지 않으므로 주의**하기 바란다.

  ```javascript
  const obj = {
    2: 2,
    3: 3,
    1: 1,
    b: "b",
    a: "a",
  };

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    console.log(key + ": " + obj[key]);
  }

  /*
  1: 1
  2: 2
  3: 3
  b: b
  a: a
  */
  ```

- 배열에는 for ... in 문을 사용하지 않고 일반적으로 `for ... of 문` 또는 `Array.prototype.forEach 메서드`를 사용하길 권장한다.

  - 배열도 객체이므로 프로퍼티와 상속받은 프로퍼티가 포함될 수 있다.

  ```javascript
  const arr = [1, 2, 3];
  arr.x = 10; // 배열도 객체이므로 프로퍼티를 가질 수 있다.

  for (const i in arr) {
    // 프로퍼티 x도 출력된다.
    console.log(arr[i]); // 1 2 3 10
  }

  // arr.length는 3이다.
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]); // 1 2 3
  }

  // forEach 메서드는 요소가 아닌 프로퍼티는 제외한다.
  arr.forEach((v) => console.log(v)); // 1 2 3

  // for ... of는 변수 선언분에서 선언한 변수에 키가 아닌 값을 할당한다.
  for (const value of arr) {
    console.log(value); // 1 2 3
  }
  ```

### 19.14.2 Object.keys/values/entries 메서드

- 객체 자신의 고유 프로퍼티만을 열거하기 위해서는 for ... in 문을 사용하는 것 보다 `Object.keys/values/entries 메서드를 사용`하는 것을 권장한다.

#### `Object.keys`

- **객체 자신의 열거 가능한(enumberable)프로퍼티 키를 배열로 반환**한다.

  ```javascript
  const person = {
    name: "Lee",
    address: "Seoul",
    __proto__: { age: 20 },
  };

  console.log(Object.keys(person)); // ['name', 'address']
  ```

#### `Object.values`

- **ES8에서 도입된 Object.values 메서드는 객체 자신의 열거 가능한 프로퍼티 값을 배열로 반환**한다.
  ```javascript
  console.log(Object.values(person)); // ['Lee', 'Seoul']
  ```

#### `Object.entries`

- **ES8에서 도입된 Object.entries 메서드는 객체 자신의 열거 가능한 프로퍼티 키와 값의 쌍의 배열을 배열에 담아 반환**한다.

  ```javascript
  console.log(Object.entries(person)); // [['name', 'Lee'], ['address', 'Seoul']]

  Object.entries(person).forEach(([key, value]) => console.log(key, value));
  /*
  name Lee
  address Seoul
  */
  ```
