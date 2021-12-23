# 10장 객체 리터럴

## 10.1 객체란?

- 자바스크립트는 `객체(object) 기반의 프로그래밍 언어`이다.
- 원시 값을 제외한 나머지 값`(함수, 배열, 정규 표현식 등)은 모두 객체`다.
- 객체 타입(object/reference type)은 다양한 타입의 값(원시 값 또는 다른 객체)을 하나의 단위로 구성한 `복합적인 자료구조(data structure)`다.
- 원시 타입의 값, 즉 원시 값은 변경 불가능한 값(immutable value)이지만 객체 타입의 값, 즉 `객체는 변경 가능한 값(mutable value)`이다.
- 객체는 0개 이상의 프로퍼티로 구성된 집합이며, `프로퍼티는 키(key)와 값(value)으로 구성`된다.
- 프로퍼티 값이 함수일 경우 일반 함수와 구분하기 위해 `메서드(method)라 부른다.`
- 객체는 `프로퍼티와 메서드로 구성된 집합체` 이다.

  - `프로퍼티(property)`: 객체의 상태를 나타내는 값(value)
  - `메서드(method)`: 프로퍼티(상태 데이터)를 참조하고 조작할 수 있는 동작(behavior)
  - 상태와 동작을 하나의 단위로 구조화할 수 있어 유용하다.

  📄 객체와 함수

  > 자바스크립트의 객체는 함수와 밀접한 관계를 가진다. 함수로 객체를 생성하기도 하며 함수 자체가 객체이기도 하다.

## 10.2 객체 리터럴에 의한 객체 생성

- 자바스크립트는 프로토타입 기반 객체지향 언어로서 클래스 기반 객체지향 언어와는 달리 다양한 객체 생성 방법을 지원한다.

  - `객체 리터럴 (가장 일반적인 방법)`
  - Object 생성자 함수
  - 생성자 함수
  - Object.create 메서드
  - 클래스(ES6)

- `객체 리터럴`

  - 객체 리터럴은 `중괄호{...}` 내에 `0개 이상의 프로퍼티로 정의`한다.
  - `변수에 할당되는 시점`에 자바스크립트 엔진은 객체 리터럴을 해석해 `객체를 생성`한다.

    ```javascript
    var person = {
      name: "Lee",
      sayHello: function () {
        console.log(`Hello! My name is ${this.name}.`);
      },
    };

    console.log(typeof person); // object
    console.log(person); // {name: 'Lee', sayHello: f}
    ```

  - 중괄호 내에 프로퍼티를 정의하지 않으면 `빈 객체가 생성`된다.
    ```javascript
    var empty = {};
    console.log(typeof empty); // object
    console.log(empty); // {}
    ```
    > 객체 리터럴의 중괄호는 코드 블록을 의미하지 않는다에 주의!
    > 코드 블록의 닫는 중괄호 뒤에는 세미 콜론을 붙이지 않는다.
    > 객체 리터럴은 값으로 평가되는 표현식이다. 따라서 `객체 리터럴의 닫는 중괄호 뒤에는 세미콜론을 붙인다.`

## 10.3 프로퍼티

- 객체는 `프로퍼티의 집합`이며, 프로퍼티는 `키와 값으로 구성`된다.

  ```javascript
  var person = {
    // 프로퍼티 키는 name, 프로퍼티 값은 'Lee'
    name: "Lee",
    // 프로퍼티 키는 age, 프로퍼티 값은 20
    age: 20,
  };
  ```

  - 프로퍼티 키: 빈 문자열을 포함하는 모든 문자열 또는 심벌 값
  - 프로퍼티 값: 자바스크립트에서 사용할 수 있는 모든 값

- `프로퍼티 키`

  - `프로퍼티 값에 접근`할 수 있는 이름으로서 `식별자 역할`을 한다.
  - 식별자 네이밍 규칙을 따르지 않는 이름에는 반드시 따옴표를 사용해야 한다. (가급적 `네이밍 규칙을 준수하는 프로퍼티 키를 사용하는 것을 권장`)

  ```javascript
  var person = {
    firstName: 'Ung-mo', // 식졀자 네이밍 규칙을 준수하는 프로퍼티 키 (따옴표 생략 가능)
    'last-name': 'Lee', // 식별자 네이밍 규칙을 준수하지 않는 프로퍼티 키 (따옴표 생략 불가능)
    last-name: 'Ko', // SyntaxError: Unexpected token -
  }

  console.log(person); // {firstName: 'Ung-mo', last-name: 'Lee'}
  ```

  - 문자열 또는 문자열로 평가할 수 있는 표현식을 사용해 프로퍼티 `키를 동적으로 생성`할 수 있다.
  - 프로퍼티 키로 사용할 표현식을 `대괄호[...]로 묶어야 한다.`

  ```javascript
  var obj = {};
  var key = "hello";

  // ES5: 프로퍼티 키 동적 생성
  obj[key] = "world";
  // ES6: 계산된 프로퍼티 이름
  // var obj = { [key]: 'world' };

  console.log(obj); // {hello: 'world'}
  ```

  - 빈 문자열을 프로퍼티 키로 사용해도 에러가 발생하지는 않는다. (권장 X)

  ```javascript
  var foo = {
    "": "", // 빈문자열도 프로퍼티 키로 사용할 수 있다.
  };

  console.log(foo); // {'':''}
  ```

  - 프로퍼티 키에 문자열이나 심벌 값 외의 값을 사용하면 암묵적 타입 변환을 통해 문자열이 된다.
  - 예) 프로퍼티 키로 `숫자 리터럴을 사용`하면 따옴표는 붙지 않지만 `내부적으로 문자열로 변환`된다.

  ```javascript
  var foo = {
    0: 1,
    1: 2,
    2: 3,
  };

  console.log(foo); // {0: 1, 1: 2, 2: 3}
  ```

  - var, function과 같은 예약어를 프로퍼티 키로 사용해도 에러가 발생하지 않는다. (권장 X)
  - 하지만, 예기치 않은 에러가 발생할 여지가 있으므로 사용하면 안된다.

  ```javascript
  var foo = {
    var: "",
    function: "",
  };

  console.log(foo); // {var: '', function: ''}
  ```

  - 이미 존재하는 `프로퍼티 키를 중복 선언`하면 나중에 선언된 프로퍼티가 `먼저 선언한 프로퍼티를 덮어 쓴다.`
  - `에러가 발생하지 않는다는 점에 주의!`

  ```javascript
  var foo = {
    name: "Lee",
    name: "Kim",
  };

  console.log(foo); // {name: 'Kim'}
  ```

## 10.4 메서드

- `프로퍼티 값이 함수일 경우` 일반 함수와 구분하기 위해 `메서드(method)라 부른다.`
- 메서드는 객체에 묶여 있는 함수를 의미한다.

  ```javascript
  var circle = {
    radius: 5, // <- 프로퍼티

    // 원의 지름
    getDiameter: function () {
      // <- 메서드
      return 2 * this.radius; // this는 circle을 가리킨다.
    },
  };

  console.log(circle.getDiameter()); // 10
  ```

## 10.5 프로퍼티 접근

- 프로퍼티에 접근하는 방법

  - 마침표 프로퍼티 접근 연산자(.)를 사용하는 `마침표 표기법(dot notation)`
  - 대괄호 프로퍼티 접근 연산자([...])를 사용하는 `대괄호 표기법(bracket notation)`

- 자바스크립트에서 사용 가능한 유효한 이름이면 마침표 표기법과 대괄호 표기법 모두 사용 가능

  ```javascript
  var person = {
    name: "Lee",
  };

  // 마침표 표기법에 의한 프로퍼티 접근
  console.log(person.name); // Lee

  // 대괄호 표기법에 의한 프로퍼티 접근
  console.log(person["name"]); // Lee
  ```

  - 대괄호 표기법을 사용하는 경우 대괄호 프로퍼티 접근 연산자 내부에 지정하는 프로퍼티 키는 반드시 따옴표로 감싼 문자열이어야 한다.

    ```javascript
    var person = {
      name: "Lee",
    };

    console.log(person[name]); // ReferenceError: name is not defined
    ```

  -`객체에 존재하지 않는 프로퍼티에 접근하면 undefined를 반환`한다. 이때 ReferenceError가 발생하지 않는데 주의!!

  ```javascript
  var person = {
    name: "Lee",
  };

  console.log(person.age); // undefined
  ```

  - 프로퍼티 키가 `숫자로 이뤄진 문자열인 경우 따옴표를 생략`할 수 있다.

    ```javascript
    var person = {
      'last-name': 'Lee',
      1: 10
    }

    person.'last-name'; // SyntaxError: Unexpected string
    person.last-name; // 브라우저 환경: NaN
                      // Node.js 환경: ReferenceError: name is not defined
    person[last-name]; // ReferenceError: last is not defined
    person['last-name']; // -> Lee

    // 프로퍼티 키가 숫자로 이뤄진 문자열인 경우 따옴표를 생략할 수 있다.
    person.1; // SyntaxError: Unexpected number
    person.'1'; // SyntaxError: Unexpected string
    person[1]; // 10: person[1] -> person['1']
    person['1']; // 10
    ```

## 10.6 프로퍼티 값 갱신

- `이미 존재하는 프로퍼티에 값을 할당`하면 `프로퍼티 값이 갱신` 된다.

  ```javascript
  var person = {
    name: "Lee",
  };

  // person 객체에 name 프로퍼티가 존재하므로 name 프로퍼티 값이 갱신된다.
  person.name = "Kim";

  console.log(person); // {name: 'Kim'}
  ```

## 10.7 프로퍼티 동적 생성

- `존재하지 않는 프로퍼티에 값을 할당`하면 `프로퍼티가 동적으로 생성되어 추가`되고 프로퍼티 `값이 할당` 된다.

  ```javascript
  var person = {
    name: "Lee",
  };

  // person 객체에는 age 프로퍼티가 존재하지 않는다.
  // 따라서 person 객체에 age 프로퍼티가 동적으로 생성되고 값이 할당된다.
  person.age = 20;

  console.log(person); // {name: 'Lee', age: 20}
  ```

## 10.8 프로퍼티 삭제

- `delete 연산자`는 객체의 `프로퍼티를 삭제`한다.
- `존재하지 않는 프로퍼티를 삭제`하면 아무런 `에러 없이 무시`된다.

  ```javascript
  var person = {
    name: "Lee",
  };

  // 프로퍼티 동적 생성
  person.age = 20;

  // person 객체에 age 프로퍼티가 존재한다.
  // 따라서 delete 연산자로 age 프로퍼티를 삭제할 수 있다.
  delete person.age;

  // person 객체에 address 프로퍼티가 존재하지 않는다.
  // 따라서 delete 연산자로 address 프로퍼티를 삭제할 수 없다. 이때, 에러가 발생하지 않는다.
  delete person.address;

  console.log(person); // {name: 'Lee'}
  ```

## 10.9 ES6에서 추가된 객체 리터럴의 확장 기능

### 10.9.1 프로퍼티 축약 표현

- 프로퍼티 값은 변수에 할당된 값, 즉 식별자 표현식일 수도 있다.

  ```javascript
  // ES5
  var x = 1,
    y = 2;

  var obj = {
    x: x,
    y: y,
  };

  console.log(obj); // {x: 1, y: 2}
  ```

- ES6에서는 프로퍼티 값으로 변수를 사용하는 경우 변수 이름과 프로퍼티 키가 동일한 이름일 때 `프로퍼티 키를 생략(property shorthand)`할 수 있다. 이때 `프로퍼티 키는 변수 이름으로 자동 생성` 된다.

  ```javascript
  // ES6
  let x = 1,
    y = 2;

  // 프로퍼티 축약 표현
  const obj = { x, y };

  console.log(obj); // {x: 1, y: 2}
  ```

### 10.9.2 계산된 프로퍼티 이름

- 문자열 또는 문자열로 타입 변환할 수 있는 값으로 평가되는 `표현식을 사용해 프로퍼티 키를 동적으로 생성` 할 수도 있다.
- 단, 프로퍼티 키로 사용할 `표현식을 대괄호([...])로 묶어야 한다.`
- 이를 `계산된 프로퍼티 이름(computed property name)`이라 한다.

  ```javascript
  // ES5
  var prefix = "prop";
  var i = 0;

  var obj = {};

  // 계상된 프로퍼티 이름으로 프로퍼티 키 동적 생성
  obj[prefix + "-" + ++i] = i;
  obj[prefix + "-" + ++i] = i;
  obj[prefix + "-" + ++i] = i;

  console.log(obj); // {prop-1: 1, prop-2: 2, prop-3: 3}
  ```

  ```javascript
  // ES6
  const prefix = "prop";
  let i = 0;

  // 객체 리터럴 내부에서 계산된 프로퍼티 이름으로 프로퍼티 키를 동적 생성
  const obj = {
    [`${prefix}-${++i}`]: i,
    [`${prefix}-${++i}`]: i,
    [`${prefix}-${++i}`]: i,
  };

  console.log(obj); // {prop-1: 1, prop-2: 2, prop-3: 3}
  ```

### 10.9.3 메서드 축약 표현

- ES5에서 메서드를 정의하려면 프로퍼티 값으로 함수를 할당한다.

  ```javascript
  // ES5
  var obj = {
    name: "Lee",
    sayHi: function () {
      console.log("Hi! " + this.name);
    },
  };

  obj.sayHi(); // Hi! Lee
  ```

- ES6에서는 `메서드를 정의할 때 function 키워드를 생략한 축약 표현을 사용`할 수 있다.

  - ES6의 메서드 `축약 표현으로 정의한 메서드`는 `프로퍼티에 할당한 함수와 다르게 동작`한다. (26.2절 '메서드'에서 자세히 알아보자!)

  ```javascript
  // ES6
  const obj = {
    name: "Lee",
    // 메서드 축약 표현
    sayHi() {
      console.log(`Hi! ${this.name}`);
    },
  };

  obj.sayHi(); // Hi! Lee
  ```
