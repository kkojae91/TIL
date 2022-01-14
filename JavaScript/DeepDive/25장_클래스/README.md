# 25장. 클래스

## 25.1 클래스는 프로토타입의 문법적 설탕인가?

- ES6의 클래스가 기존의 프로토타입 기반 객체지향 모델을 폐지하고 새롭게 클래스 기반 객체지향 모델을 제공하는 것은 아니다.

  - 사실 클래스는 함수이며 기존 프로토타입 기반 패턴을 클래스 기반 패턴처럼 사용할 수 있도록 하는 문법적 설탕(Syntactic sugar)이라고 볼 수도 있다.

- 클래스는 생성자 함수와 매우 유사하게 동작하지만 다음과 같이 몇 가지 차이가 있다.

  1. 클래스를 new 연산자 없이 호출하면 에러가 발생한다. 하지만 생성자 함수를 new 연산자 없이 호출하면 일반 함수로서 호출된다.
  2. 클래스는 상속을 지원하는 extends와 super 키워드를 제공한다. 하지만 생성자 함수는 extends와 super 키워드를 지원하지 않는다.
  3. 클래스는 호이스팅이 발생하지 않는 것처럼 동작한다. 하지만 함수 선언문으로 정의된 생성자 함수는 함수 호이스팅이, 함수 표현식으로 정의한 생성자 함수는 변수 호이스팅이 발생한다.
  4. 클래스 내의 모든 코드에는 암묵적으로 strict mode가 지정되어 실행되며 strict mode를 해제할 수 없다. 하지만 생성자 함수는 암묵적으로 strict mode가 지정되지 않는다.
  5. 클래스의 constructor, 프로토타입 메서드, 정적 메서드는 모두 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false이다. 다시 말해, 열거되지 않는다.

- 클래스를 프로토타입 기반 객체 생성 패턴의 단순한 문법적 설탕이라고 보기보다는 새로운 객체 생성 메커니즘으로 보는 것이 좀 더 합당하다.

## 25.2 클래스 정의

- 클래스는 class 키워드를 사용하여 정의한다.
- 클래스 이름은 생성자 함수와 마찬가지로 파스칼 케이스를 사용하는 것이 일반적이다. (파스칼 케이스를 사용하지 않아도 에러가 발생하지는 않는다.)

  ```javascript
  // 클래스 선언문
  class Person {}

  // 익명 클래스 표현식
  const Person = class {};

  // 기명 클래스 표현식
  const Person = class MyClass {};
  ```

  > 일반적이지는 않지만 함수와 마찬가지로 표현식으로 클래스를 정의할 수도 있다.(익병 클래스 표현식, 기명 클래스 표현식 모두 존재)

- 클래스는 일급 객체로서 다음과 같은 특징을 갖는다.

  1. 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
  2. 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
  3. 함수의 매개변수에게 전달할 수 있다.
  4. 함수의 반환값으로 사용할 수 있다.

- 클래스 몸체에는 0개 이상의 메서드만 정의할 수 있다.

  - 클래스 몸체에서 정의할 수 있는 메서드는 constructor(생성자), 프로토타입 메서드, 정적 메서드의 세가지가 있다.

  ```javascript
  // 클래스 선언문
  class Person {
    // 생성자
    constructor(name) {
      // 인스턴스 생성 및 초기화
      this.name = name; // name 프로퍼티는 public하다.
    }

    // 프로토타입 메서드
    sayHi() {
      console.log(`Hi! My name is ${this.name}`);
    }

    // 정적 메서드
    static sayHello() {
      console.log("Hello!");
    }
  }

  // 인스턴스 생성
  const me = new Person("Lee");

  // 인스턴스의 프로퍼티 참조
  console.log(me.name); // Lee
  // 프로토타입 메서드 호출
  me.sayHi(); // Hi! My name is Lee
  // 정적 메서드 호출
  Person.sayHello(); // Hello!
  ```

## 25.3 클래스 호이스팅

- 클래스는 클래스 정의 이전에 참조할 수 없다.

  ```javascript
  console.log(Person);
  // ReferenceError: Cannot access 'Person' before initialization

  // 클래스 선언문
  class Person {}
  ```

- 클래스 선언문은 마치 호이스팅이 발생하지 않는 것처럼 보이나 그렇지 않다.

  ```javascript
  const Person = "";

  {
    // 호이스팅이 발생하지 않는다면 ''이 출력되어야 한다.
    console.log(Person);
    //ReferenceError: Cannot access 'Person' before initialization

    // 클래스 선언문
    class Person {}
  }
  ```

  > 클래스 선언문도 변수 선언, 함수 정의와 마찬가지로 호이스팅이 발생한다. 단, 클래스는 let, const 키워드로 선언한 변수처럼 호이스팅된다. 따라서 클래스 선언문 이전에 일시적 사각지대(TDZ)에 빠지기 때문에 호이스팅이 발생하지 않는 것처럼 동작한다.
  >
  > var, let, const, function, function\*, class 키워드를 사용하여 선언된 모든 식별자는 호이스팅된다. 모든 선언문은 런타임 이전에 먼저 실행되기 때문이다.

## 25.4 인스턴스 생성

- 클래스는 생성자 함수이며 new 연산자와 함께 호출되어 인스턴스를 생성한다.

  ```javascript
  class Person {}

  // 인스턴스 생성
  const me = new Person();
  console.log(me); // Person {}
  ```

- 클래스는 인스턴스를 생성하는 것이 유일한 존재 이유이므로 반드시 new 연산자와 함께 호출해야 한다.

  ```javascript
  class Person {}

  // 클래스를 new 연산자 없이 호출하면 타입 에러가 발생한다.
  const me = Person();
  // TypeError: Class constructor Foo cannot be invoked without 'new'
  ```

- 클래스 표현식으로 정의된 클래스의 경우 클래스를 가리키는 식별자를 사용해 인스턴스를 생성하지 않고 기명 클래스 표현식의 클래스 이름을 사용해 인스턴스를 생성하면 에러가 발생한다.

  ```javascript
  const Person = class MyClass {};

  // 함수 표현식과 마찬가지로 클래스를 가리키는 식별자로 인스턴스를 생성해야 한다.
  const me = new Person();

  // 클래스 이름 MyClass는 함수와 동일하게 클래스 몸체 내부에서만 유효한 식별자다.
  console.log(MyClass); // ReferenceError: MyClass is not defined

  const you = new MyClass(); // ReferenceError: MyClass is not define
  ```

## 25.5 메서드

- 클래스 몸체에는 0개 이상의 메서드만 선언할 수 있다.
  - 클래스 몸체에서 정의할 수 있는 메서드는 constructor(생성자), 프로토타입 메서드, 정적 메서드의 세 가지가 있다.

### 25.5.1 constructor

- constructor는 인스턴스를 생성하고 초기화하기 위한 특수한 메서드다.
- constructor는 이름을 변경할 수 없다.

```javascript
class Person {
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name;
  }
}
```

- constructor는 메서드로 해석되는 것이 아니라 클래스가 평가되어 생성한 함수 객체 코드의 일부가 된다.

  - 다시말해, 클래스 정의가 평가되면 constructor의 기술된 동작을 하는 함수 객체가 생성된다.

- constructor는 클래스 내에 최대 한 개만 존재할 수 있다.

  - 만약 클래스가 2개 이상의 constructor를 포함하면 문법 에러(SyntaxError)가 발생한다.

  ```javascript
  class Person {
    constructor() {}
    constructor() {}
  }
  // SyntaxError: A class may only have one constructor
  ```

- constructor는 생략할 수 있다.

  - constructor를 생략하면 클래스에서 빈 constructor가 암묵적으로 정의된다.

  ```javascript
  class Person {}
  ```

- 프로퍼티가 추가되어 초기화된 인스턴스를 생성하려면 constructor 내부에서 this에 인스턴스 프로퍼티를 추가한다.

  ```javascript
  class Person {
    constructor() {
      // 고정값으로 인스턴스 초기화
      this.name = "Lee";
      this.address = "Seoul";
    }
  }

  // 인스턴스 프로퍼티가 추가된다.
  const me = new Person();
  console.log(me); // Person {name: 'Lee', address: 'Seoul'}
  ```

- 인스턴스를 생성할 때 클래스 외부에서 인스턴스 프로퍼티의 초기값을 전달하려면 다음과 같이 constructor에 매개변수를 선언하고 인스턴스를 생성할 때 초기값을 전달한다.

  - 이때 초기값은 constructor의 매개변수에게 전달된다.

  ```javascript
  class Person {
    constructor(name, address) {
      this.name = name;
      this.address = address;
    }
  }

  // 인수로 초기값을 전달한다. 초기값은 constructor에 전달된다.
  const me = new Person("Lee", "Seoul");
  console.log(me); // Person {name: 'Lee', address: 'Seoul'}
  ```

- constructor는 별도의 반환문을 갖지 않아야한다.
  - new 연산자와 함께 클래스가 호출되면 생성자 함수와 동일하게 암묵적으로 this, 즉 인스턴스를 반환하기 때문이다.
  - return문은 반드시 생략한다.

### 25.5.2 프로토타입 메서드

- 클래스 몸체에서 정의한 메서드는 생성자 함수에 의한 객체 생성 방식과는 다르게 클래스의 prototype 프로퍼티에 메서드를 추가하지 않아도 기본적으로 프로토타입 메서드가 된다.

  ```javascript
  class Person {
    // 생성자
    constructor(name) {
      // 인스턴스 생성 및 초기화
      this.name = name;
    }

    // 프로토타입 메서드
    sayHi() {
      console.log(`Hi! My name is ${this.name}`);
    }
  }

  const me = new Person("Lee");
  me.sayHi(); // Hi! My name is Lee
  ```

- 클래스가 생성한 인스턴스는 프로토타입 체인의 일원이 된다.

  ```javascript
  // me 객체의 프로토타입은 Person.prototype이다.
  Object.getPrototypeOf(me) === Person.prototype; // true
  me instanceof Person; // true

  // Person.prototype의 프로토타입은 Object.prototype이다.
  Object.getPrototypeof(Person.prototype) === Object.prototype; // true
  me instanceof Object; // true

  // me 객체의 constructor는 Person 클래스다.
  me.constructor === Person; // true
  ```

  > 이처럼 클래스 몸체에서 정의한 메서드는 인스턴스의 프로토타입에 존재하는 프로토타입 메서드가 된다. 인스턴스는 프로토타입 메서드를 상속받아 사용할 수 있다.

### 25.5.3 정적 메서드

- 정적(static) 메서드는 인스턴스를 생성하지 않아도 호출할 수 있는 메서드를 말한다.
- 클래스에서는 메서드에 static 키워드를 붙이면 정적 메서드(클래스 메서드)가 된다.

  ```javascript
  class Person {
    // 생성자
    constructor(name) {
      this.name = name;
    }

    // 정적 메서드
    static sayHi() {
      console.log("Hi!");
    }
  }
  ```

  > 정적 메서드는 클래스에 바인딩된 메서드가 된다. 클래스는 함수 객체로 평가되므로 자신의 프로퍼티/메서드를 소유할 수 있다. 클래스는 클래스 정의(클래스 선언문이나 클래스 표현식)가 평가되는 시점에 함수 객체가 되므로 인스턴스와 달리 별다른 생성과정이 필요 없다. 따라서 정적 메서드는 클래스 정의 이후 인스턴스를 생성하지 않아도 호출할 수 있다.

- 정적 메서드는 프로토타입 메서드처럼 인스턴스로 호출하지 않고 클래스로 호출한다.

  ```javascript
  // 정적 메서드는 클래스로 호출한다.
  // 정적 메서드는 인스턴스 없이도 호출할 수 있다.
  Person.sayHi(); // Hi!
  ```

- 정적 메서드는 인스턴스로 호출할 수 없다.
  - 정적 메서드가 바인딩된 클래스는 인스턴스의 프로토타입 체인상에 존재하지 않기 때문이다.
  ```javascript
  // 인스턴스 생성
  const me = new Person("Lee");
  me.sayHi(); // TypeError: me.sayHi is not a function
  ```

### 25.5.4 정적 메서드와 프로토타입 메서드의 차이

- 정적 메서드와 프로토타입 메서드의 차이는 다음과 같다.
  1. 정적 메서드와 프로토타입 메서드는 자신이 속해 있는 프로토타입 체인이 다르다.
  2. 정적 메서드는 클래스로 호출하고 프로토타입 메서드는 인스턴스로 호출한다.
  3. 정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.

```javascript
class Square {
  // 정적 메서드
  static area(width, height) {
    return width * height;
  }
}

console.log(Square.area(10, 10)); // 100
```

> 정적 메서드는 area 2개의 인수를 전달받아 면적을 계산한다. 이때 정적 메서드 area는 인스턴스 프로퍼티를 참조하지 않는다.
>
> 만약 인스턴스 프로퍼티를 참조해야 한다면 정적 메서드 대신 프로토타입 메서드를 사용해야 한다.

```javascript
class Square {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // 프로토타입 메서드
  area() {
    return this.width * this.height;
  }
}

const square = new Square(10, 10);
console.log(square.area()); // 100
```

- 정적 메서드는 클래스로 호출해야 하므로 정적 메서드 내부의 this는 인스턴스가 아닌 클래스를 가리킨다. 즉, 프로토타입 메서드와 정적 메서드 내부의 this 바인딩이 다르다.
- this를 사용하지 않는 메서드는 정적 메서드로 정의하는 것이 좋다.

### 25.5.5 클래스에서 정의한 메서드의 특징

- 클래스에서 정의한 메서드는 다음과 같은 특징을 갖는다.
  1. function 키워드를 생략한 메서드 축약 표현을 사용한다.
  2. 객체 리터럴과 다르게 클래스에 메서드를 정의할 때는 콤마가 필요 없다.
  3. 암묵적으로 strict mode로 실행된다.
  4. for ... in 문이나 Object.keys 메서드 등으로 열거할 수 없다. 즉, 프로퍼티의 열거 가능 여부를 나타내며, 불리언 값을 갖는 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false다.
  5. 내부 메서드 [[Consturct]]를 갖지 않는 non-constructor다. 따라서 new 연산자와 함께 호출할 수 없다.

## 25.6 클래스의 인스턴스 생성 과정

1. 인스턴스 생성과 this 바인딩

   > new 연산자와 함께 클래스를 호출하면 constructor의 내부 코드가 실행되기에 앞서 암묵적으로 빈 객체가 생성된다. 이 빈 객체가 클래스가 생성한 인스턴스다. 이때 클래스가 생성한 인스턴스의 프로토타입으로 클래스의 prototype 프로퍼티가 가리키는 객체가 설정된다. 그리고 암묵적으로 생성된 빈 객체, 즉 인스턴스는 this에 바인딩된다. 따라서 constructor 내부의 this는 클래스가 생성한 인스턴스를 가리킨다.

2. 인스턴스 초기화

   > constructor의 내부 코드가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다. 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티 값을 초기화한다. 만약 constructor가 생략되었다면 이 과정도 생략된다.

3. 인스턴스 반환
   > 클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

```javascript
class Person {
  // 생성자
  constructor(name) {
    // 1. 암묵적으로 인스턴스가 생성되고 this에 바인딩된다.
    console.log(this); // Person {}
    console.log(Object.getPrototypeOf(this) === Person.prototype); // true

    // 2. this에 바인딩되어 있는 인스턴스를 초기화한다.
    this.name = name;

    // 3. 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.
  }
}
```

## 25.7 프로퍼티

### 25.7.1 인스턴스 프로퍼티

### 25.7.2 접근자 프로퍼티

### 25.7.3 클래스 필드 정의 제안

### 25.7.4 private 필드 정의 제안

### 25.7.5 static 필드 정의 제안
