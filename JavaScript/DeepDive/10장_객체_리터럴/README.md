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

- 객체는 프로퍼티의 집합이며, 프로퍼티는 키와 값으로 구성된다.

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

- 프로퍼티 키

  - 프로퍼티 값에 접근할 수 있는 이름으로서 식별자 역할을 한다.
  - 식별자 네이밍 규칙을 따르지 않는 이름에는 반드시 따옴표를 사용해야 한다. (가급적 네이밍 규칙을 준수하는 프로퍼티 키를 사용하는 것을 권장)

  ```javascript
  var person = {
    firstName: 'Ung-mo', // 식졀자 네이밍 규칙을 준수하는 프로퍼티 키 (따옴표 생략 가능)
    'last-name': 'Lee', // 식별자 네이밍 규칙을 준수하지 않는 프로퍼티 키 (따옴표 생략 불가능)
    last-name: 'Ko', // SyntaxError: Unexpected token -
  }

  console.log(person); // {firstName: 'Ung-mo', last-name: 'Lee'}
  ```

  - 문자열 또는 문자열로 평가할 수 있는 표현식을 사용해 프로퍼티 키를 동적으로 생성할 수 있다.
  - 프로퍼티 키로 사용할 표현식을 대괄호[...]로 묶어야 한다.

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
  - 예) 프로퍼티 키로 숫자 리터럴을 사용하면 따옴표는 붙지 않지만 내부적으로 문자열로 변환된다.

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

  - 이미 존재하는 프로퍼티 키를 중복 선언하면 나중에 선언된 프로퍼티가 먼저 선언한 프로퍼티를 덮어 쓴다.
  - 에러가 발생하지 않는다는 점에 주의!

  ```javascript
  var foo = {
    name: "Lee",
    name: "Kim",
  };

  console.log(foo); // {name: 'Kim'}
  ```
