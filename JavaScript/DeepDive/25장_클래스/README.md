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

- 인스턴스 프로퍼티는 constructor 내부에서 정의해야 한다.

  ```javascript
  class Person {
    constructor(name) {
      // 인스턴스 프로퍼티
      this.name = name; // name 프로퍼티는 public 하다.
    }
  }

  const me = new Person("Lee");
  console.log(me); // Person {name: 'Lee'}
  // name은 public 하다.
  console.log(me.name); // Lee
  ```

  > constructor 내부에서 this에 추가한 프로퍼티는 언제나 클래스가 생성한 인스턴스의 프로퍼티가 된다. ES6의 클래스는 다른 객체지향 언어처럼 private, public, protected 키워드와 같은 접근 제한자(access modifier)를 지원하지 않는다. 따라서 인스턴스 프로퍼티는 언제나 public하다.

### 25.7.2 접근자 프로퍼티

- 접근자 프로퍼티는 클래스에서도 사용할 수 있다.

  - 접근자 프로퍼티는 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수, 즉 getter 함수와 setter 함수로 구성되어 있다.

  ```javascript
  class Person {
    constructor(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    // fullName은 접근자 함수로 구성된 접근자 프로퍼티다.
    // getter함수
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }

    // setter함수
    set fullName(name) {
      [this.firstName, this.lastName] = name.split(" ");
    }
  }

  const me = new Person("Ungmo", "Lee");

  // 데이터 프로퍼티를 통한 프로퍼티 값의 참조.
  console.log(`${me.firstName} ${me.lastName}`); // Ungmo Lee

  // 접근자 프로퍼티를 통한 프로퍼티 값의 저장
  // 접근자 프로퍼티 fullName에 값을 저장하면 setter 함수가 호출된다.
  me.fullName = "Heegun Lee";
  console.log(me); // Person {firstName: 'Heegun', lastName: 'Lee'}

  // 접근자 프로퍼티를 통한 프로퍼티 값의 참조
  // 접근자 프로퍼티 fullName에 접근하면 getter 함수가 호출된다.
  console.log(me.fullName); // Heegun Lee

  // fullName은 접근자 프로퍼티다.
  // 접근자 프로퍼티는 get, set, enumerable, configurable 프로퍼티 어트리뷰트를 갖는다.
  console.log(Object.getOwnPropertyDescriptor(Person.prototype, "fullName"));
  // {get: f, set: f, enumerable: false, configurable: true}
  ```

  > getter는 인스턴스 프로퍼티에 접근할 때마다 프로퍼티 값을 조작하거나 별도의 행위가 필요할 때 사용한다. getter 메서드 이름 앞에 get 키워드를 사용해 정의한다.
  >
  > setter는 인스턴스 프로퍼티에 값을 할당할 때마다 프로퍼티 값을 조작하거나 별도의 행위가 필요할 때 사용한다. setter 메서드 이름 앞에 set 키워드를 사용해 정의한다.
  >
  > 이때 getter와 setter 이름은 인스턴스 프로퍼티처럼 사용된다. 다시말해 getter는 호출하는 것이 아니라 프로퍼티처럼 참조하는 형식으로 사용하며, 참조 시에 내부적으로 getter가 호출된다. setter도 호출하는 것이 아니라 프로퍼티처럼 값을 할당하는 형식으로 사용하며, 할당 시에 내부적으로 setter가 호출된다.
  >
  > getter는 이름 그대로 무언가를 취득할 때 사용하므로 반드시 무언가를 반환해야하고 setter는 무언가를 프로퍼티에 할당해야 할 때 사용하므로 반드시 매개변수가 있어야 한다. setter는 단 하나의 값만 할당받기 때문에 단 하나의 매개변수만 선언할 수 있다.
  >
  > 클래스의 메서드는 기본적으로 프로토타입 메서드가 된다. 따라서 클래스의 접근자 프로퍼티 또한 인스턴스 프로퍼티가 아닌 프로토타입의 프로퍼티가 된다.

### 25.7.3 클래스 필드 정의 제안

- 클래스 필드(class field)

  - 클래스 필드(필드 또는 멤버)는 클래스 기반 객체지향 언어에서 클래스가 생성할 인스턴스의 프로퍼티를 가리키는 용어다.

- (2021/1 기준) 클래스 몸체에서 클래스 필드를 정의할 수 있는 클래스 필드 정의(class field definitions)제안은 아직 ECMAScript의 정식 표준 사양으로 승급되지 않았다. 하지만 최신 브라우저(Chrome 72이상)와 최신 Node.js(버전 12 이상)는 표준 사양으로 승급이 확실시되는 이 제안을 선제적으로 미리 구현해 놓았다. 따라서 최신 브라우저와 최신 Node.js에서는 클래스 필드를 클래스 몸체에 정의할 수 있다.

  ```javascript
  class Person {
    // 클래스 필드 정의
    name = "Lee";
  }

  const me = new Person();
  console.log(me); // Person {name: 'Lee'}
  ```

- 클래스 몸체에서 클래스 필드를 정의하는 경우 this에 클래스 필드를 바인딩해서는 안된다. this는 클래스의 constructor와 메서드 내에서만 유효하다.

  ```javascript
  class Person {
    // this에 클래스 필드를 바인딩해서는 안된다.
    this.name = ''; // SynataxError: Unexpected token '.'
  }
  ```

- 클래스 필드를 참조하는 경우 this를 반드시 사용해야 한다.

  ```javascript
  class Person {
    // 클래스 필드
    name = "Lee";

    constructor() {
      console.log(name); // ReferenceError: name is not defined
    }
  }

  new Person();
  ```

- 클래스 필드에 초기값을 할당하지 않으면 undefined를 갖는다.

  ```javascript
  class Person {
    // 클래스 필드를 초기화하지 않으면 undefined를 갖는다.
    name;
  }

  const me = new Person();
  console.log(me); // Person {name: undefined}
  ```

- 인스턴스를 생성할 때 외부의 초기값으로 클래스 필드를 초기화해야 할 필요가 있다면 constructor에서 클래스 필드를 초기화해야 한다.

  ```javascript
  class Person {
    name;
    constructor(name) {
      // 클래스 필드 초기화
      this.name = name;
    }
  }

  const me = new Person("Lee");
  console.log(me); // Person {name: 'Lee'}
  ```

  > 이처럼 인스턴스를 생성할 때 클래스 필드를 초기화할 필요가 있다면 constructor 밖에서 클래스 필드를 정의할 필요가 없다. 클래스 필드를 초기화할 필요가 있다면 어차피 constructor 내부에서 클래스 필드를 참조하여 초기값을 할당해야 한다. 이때 this, 즉 클래스가 생성할 인스턴스에 클래스 필드에 해당하는 프로퍼티가 없다면 자동으로 추가되기 때문이다.

- 함수는 일급 객체이므로 함수 클래스 필드에 할당할 수 있다. 따라서 클래스 필드를 통해 메서드를 정의할 수도 있다.

  ```javascript
  class Person {
    // 클래스 필드에 문자열을 할당
    name = "Lee";

    // 클래스 필드에 함수를 할당
    getName = function () {
      return this.name;
    };
    // 화살표 함수로 정의할 수도 잇다.
    // getName = () => this.name;
  }

  const me = new Person();
  console.log(me); // Person {name: 'Lee', getName: f}
  console.log(me.getName()); // Lee
  ```

  > 이처럼 클래스 필드에 함수를 할당하는 경우, 이 함수는 프로토타입 메서드가 아닌 인스턴스 메서드가 된다. 모든 클래스 필드는 인스턴스 프로퍼티가 되기 때문이다. 따라서 클래스 필드에 함수를 할당하는 것은 권장하지 않는다.

### 25.7.4 private 필드 정의 제안

- (2021/1 기준) private 필드를 정의할 수 있는 새로운 표준 사양이 제안되어 있다. 표준 사양으로 승급이 확실시되는 이 제안도 최신 브라우저(Chrome 74 이상)와 Node.js(버전 12 이상)에 이미 구현되어 있다.

- private 필드의 선두에는 #을 붙여준다. private 필드를 참조할 때도 #을 붙여주어야 한다.

  ```javascript
  class Person {
    // private 필드 정의
    #name = "";

    constructor(name) {
      // private 필드 참조
      this.#name = name;
    }
  }

  // private 필드 #name은 클래스 외부에서 참조할 수 없다.
  const me = new Person("Lee");
  console.log(me.#name);
  // SyntaxError: Private field '#name' must be declared in an enclosing class
  ```

- public 필드는 어디서든 참조할 수 있지만 private 필드는 클래스 내부에서만 참조할 수 있다.
  접근 가능성 | public | private
  --|--|--
  클래스 내부 | O | O
  자식 클래스 내부 | O | X
  클래스 인스턴스를 통한 접근 | O | X

- 접근자 프로퍼티를 통해 간접적으로 private 필드에 접근하는 방법이 존재한다.

  ```javascript
  class Person {
    // private 필드 정의
    #name = "";

    constructor(name) {
      this.#name = name;
    }

    // name은 접근자 프로퍼티다.
    get name() {
      // private 필드를 참조하여 trim한 다음 반환한다.
      return this.#name.trim();
    }
  }

  const me = new Person(" Lee ");
  console.log(me.name); // Lee
  ```

- private 필드는 반드시 클래스 몸체에 정의해야한다.
  - private 필드를 직접 constructor에 정의하면 에러가 발생한다.
  ```javascript
  class Person {
    constructor(name) {
      // private 필드는 클래스 몸체에서 정의해야 한다.
      this.#name = name;
      // SyntaxError: Private field '#name' must be declared in an enclosing class
    }
  }
  ```

### 25.7.5 static 필드 정의 제안

- (2021/1 기준) static public/private 필드는 최신 브라우저(Chrome 72 이상)와 최신 Node.js(버전 12 이상)에 이미 구현되어 있다.

  ```javascript
  class MyMath {
    // static public 필드 정의
    static PI = 22 / 7;

    // static private 필드 정의
    static #num = 10;

    // static 메서드
    static increment() {
      return ++MyMath.#num;
    }
  }

  console.log(MyMath.Pi); // 3.142857...
  console.log(MyMath.increment()); // 11
  ```

## 25.8 상속에 의한 클래스 확장

### 25.8.1 클래스 상속과 생성자 함수 상속

- 프로토타입 기반 상속은 프로토타입 체인을 통해 다른 객체의 자산을 상속받는 개념이지만 상속에 의한 클래스 확장은 기존 클래스를 상속 받아 새로운 클래스를 확장(extends)하여 정의하는 것이다.
- 클래스와 생성자 함수는 인스턴스를 생성할 수 있는 함수라는 점에서 매우 유사하다. 하지만 클래스 상속을 통해 기존 클래스를 확장할 수 있는 문법이 기본적으로 제공되지만 생성자 함수는 그렇지 않다.
- 상속에 의한 클래스 확장은 코드 재사용 관점에서 매우 유용하다.

  ```javascript
  class Animal {
    constructor(age, weight) {
      this.age = age;
      this.weight = weight;
    }

    eat() {
      return "eat";
    }

    move() {
      return "move";
    }
  }

  // 상속을 통해 Animal 클래스를 확장한 Bird 클래스
  class Bird extends Animal {
    fly() {
      return "fly";
    }
  }

  const bird = new Bird(1, 5);

  console.log(bird); // Bird {age: 1, weight: 5}
  console.log(bird instanceof Bird); // true
  console.log(bird instanceof Animal); // true

  console.log(bird.eat()); // eat
  console.log(bird.move()); // move
  console.log(bird.fly()); // fly
  ```

- 클래스는 상속을 통해 다른 클래스로 확장할 수 있는 문법인 extends 키워드가 기본적으로 제공된다.
  - extends 키워드를 사용한 클래스 확장은 간편하고 직관적이다. 하지만 생성자 함수는 클래스와 같이 상속을 통해 다른 생성자 함수를 확장할 수 있는 문법이 제공되지 않는다.

### 25.8.2 extends 키워드

- 상속을 통해 클래스를 확장하려면 extends 키워드를 사용하여 상속받을 클래스를 정의한다.

  ```javascript
  // 슈퍼 (베이스/부모)클래스
  class Base {}

  // 서브 (파생/자식)클래스
  class Derived extends Base {}
  ```

  > 상속을 통해 확장된 클래스를 서브클래스(subclass)라 부르고, 서브클래스에게 상속된 클래스를 수퍼클래스(super-class)라 부른다. 서브클래스를 파생 클래스(derived class) 또는 자식 클래스(child class), 수퍼클래스를 베이스 클래스(baseclass) 또는 부모 클래스(parentclass)라고 부르기도 한다.

- extends 키워드의 역할은 수퍼클래스와 서브클래스 간의 상속 관계를 설정하는 것이다.

  - 클래스도 프로토타입을 통해 상속 관계를 구현한다.

- 수퍼클래스와 서브클래스는 인스턴스의 프로토타입 체인뿐 아니라 클래스 간의 프로토타입 체인도 생성한다. 이를 통해 프로토타입 메서드, 정적 메서드 모두 상속이 가능하다.

### 25.8.3 동적 상속

- extends 키워드는 클래스뿐만 아니라 생성자 함수를 상속받아 클래스를 확장할 수도 있다. 단, extends 키워드 앞에는 반드시 클래스가 와야 한다.

  ```javascript
  // 생성자 함수
  function Base(a) {
    this.a = a;
  }

  // 생성자 함수를 상속받는 서브클래스
  class Derived extends Base {}

  const derived = new Derived(1);
  console.log(derived); // Derived {a: 1}
  ```

- extends 키워드 다음에는 클래스뿐만이 아니라 [[Construct]] 내부 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다.

  - 이를 통해 동적으로 상속받을 대상을 결정할 수 있다.

  ```javascript
  function Base1() {}

  class Base2() {}

  let condition = true;

  // 조건에 따라 동적으로 상속 대상을 결정하는 서브 클래스
  class Derived extends (condition ? Base1 : Base2) {}

  const derived = new Derived();
  console.log(derived); // Derived {}

  console.log(derived instanceof Base1); // true
  console.log(derived instanceof Base2); // false
  ```

### 25.8.4 서브클래스의 constructor

- 서브클래스에서 constructor를 생략하면 클래스에 다음과 같은 constructor가 암묵적으로 정의된다. args는 new 연산자와 함께 클래스를 호출할 때 전달한 인수의 리스트다.

  ```javascript
  constructor(...args) {
    super(...args);
  }
  ```

- super()는 수퍼클래스의 constructor(non-constructor)를 호출하여 인스턴스를 생성한다.

- 수퍼클래스와 서브클래스 모두 constructor를 생략

  ```javascript
  // 수퍼클래스
  class Base {}

  // 서브클래스
  class Derived extends Base {}
  ```

  > 위 예제의 클래스에는 다음과 같이 암묵적으로 constructor가 정의된다.

  ```javascript
  // 수퍼클래스
  class Base {
    constructor() {}
  }

  // 서브클래스
  class Derived extends Base {
    constructor(...args) {
      super(...args);
    }
  }

  const derived = new Derived();
  console.log(derived); // Derived {}
  ```

  > 위 예제와 같이 수퍼클래스와 서브클래스 모두 constructor를 생략하면 빈 객체가 생성된다. 프로퍼티를 소유하는 인스턴스를 생성하려면 constructor 내부에서 인스턴스에 프로퍼티를 추가해야 한다.

### 25.8.5 super 키워드

- super 키워드는 함수처럼 호출할 수도 있고 this와 같이 식별자처럼 참조할 수 있는 특수한 키워드다.

- super는 다음과 같이 동작한다.
  1. super를 호출하면 수퍼클래스의 constructor(super-constructor)를 호출한다.
  2. super를 참조하면 수퍼클래스의 메서드를 호출할 수 있다.

#### 1. super 호출

- super를 호출하면 수퍼클래스의 constructor(super-constructor)를 호출한다.

- 다음 예제와 같이 수퍼클래스의 constructor 내부에서 추가한 프로퍼티를 그대로 갖는 인스턴스를 생성한다면 서브클래스의 constructor를 생략할 수 있다.

  - 이때 new 연산자와 함께 서브클래스를 호출하면서 전달한 인수는 모두 서브클래스에 암묵적으로 정의된 constructor의 super 호출을 통해 수퍼클래스의 constructor에 전달된다.

  ```javascript
  // 수퍼클래스
  class Base {
    constructor(a, b) {
      this.a = a;
      this.b = b;
    }
  }

  // 서브클래스
  class Derived extends Base {
    // 다음과 같이 암묵적으로 constructor가 정의된다.
    constructor(...args) {
      super(...args);
    }
  }

  const derived = new Derived(1, 2);
  console.log(derived); // Derived {a: 1, b: 2}
  ```

- 다음 예제와 같이 수퍼클래스에서 추가한 프로퍼티와 서브클래스에서 추가한 프로퍼티를 갖는 인스턴스를 생성한다면 서브클래스의 constructor를 생략할 수 없다.

  - 이때 new 연산자와 함께 서브클래스를 호출하면서 전달한 인수 중에서 수퍼클래스의 constructor에 전달할 필요가 있는 인수는 서브클래스의 constructor에서 호출하는 super를 통해 전달한다.

  ```javascript
  // 수퍼클래스
  class Base {
    constructor(a, b) {
      // 4.
      this.a = a;
      this.b = b;
    }
  }

  // 서브클래스
  class Derived extends Base {
    constructor(a, b, c) {
      // 2.
      super(a, b); // 3.
      this.c = c;
    }
  }

  const derived = new Derived(1, 2, 3); // 1.
  console.log(derived); // Derived {a: 1, b: 2, c: 3}
  ```

  > new 연산자와 함께 Derived 클래스를 호출(1. )하면서 전달한 인수 1, 2, 3은 Derived 클래스의 constructor(2. )에 전달되고 super 호출(3. )을 통해 Base 클래스의 constructor(4. )에 일부가 전달된다.
  >
  > 이처럼 인스턴스 초기화를 위해 전달한 인수는 수퍼클래스에 배분되고 상속 관계의 두 클래스는 서로 협력하여 인스턴스를 생성한다.

- super를 호출할 때 주의할 사항은 다음과 같다.

  1. 서브클래스에서 constructor를 생략하지 않는 경우 서브클래스의 constructor에서는 반드시 super를 호출해야한다.

     ```javascript
     class Base {}

     class Derived extends Base {
       constructor() {
         // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
         console.log("constructor call");
       }
     }

     const derived = new Derived();
     ```

  2. 서브클래스의 constructor에서 super를 호출하기 전에는 this를 참조할 수 없다.

     ```javascript
     class Base {}

     class Derived extends Base {
       constructor(a) {
         // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
         this.a = a;
         super();
       }
     }

     const derived = new Derived(1);
     ```

  3. super는 반드시 서브클래스의 constructor에서만 호출한다. 서브클래스가 아닌 클래스의 constructor나 함수에서 super를 호출하면 에러가 발생한다.

     ```javascript
     class Base {
       constructor() {
         super(); // SyntaxError: 'super' keyword unexpected here
       }
     }

     function Foo() {
       super(); // SyntaxError: 'super' keyword unexpected here
     }
     ```

#### 2. super 참조

- 메서드 내에서 super를 참조하면 수퍼 클래스의 메서드를 호출할 수 있다.

  1. 서브클래스의 프로토타입 메서드 내에서 super.sayHi는 수퍼클래스의 프로토타입 메서드 sayHi를 가리킨다.

     ```javascript
     // 수퍼클래스
     class Base {
       constructor(name) {
         this.name = name;
       }

       sayHi() {
         return `Hi! ${this.name}`;
       }
     }

     // 서브클래스
     class Derived extends Base {
       sayHi() {
         // super.sayHi는 수퍼클래스의 프로토타입 메서드를 가리킨다.
         return `${super.sayHi()}. how are you doing?`;
       }
     }

     const derived = new Derived("Lee");
     console.log(derived.sayHi()); // Hi! Lee. how are you doing?
     ```

  2. 서브클래스의 정적 메서드 내에서 super.sayHi는 수퍼클래스의 정적 메서드 sayHi를 가리킨다.

     ```javascript
     // 수퍼클래스
     class Base {
       static sayHi() {
         return "Hi!";
       }
     }

     // 서브클래스
     class Derived extends Base {
       static sayHi() {
         // super.sayHi는 수퍼클래스의 정적 메서드를 가리킨다.
         return `${super.sayHi()} how are you doing?`;
       }
     }

     console.log(Derived.sayHi()); // Hi! how are you doing?
     ```

### 25.8.6 상속 클래스의 인스턴스 생성 과정

```javascript
// 수퍼클래스
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  toString() {
    return `width = ${this.width}, height = ${this.height}`;
  }
}

// 서브클래스
class ColorRectangle extends Rectangle {
  constructor(width, height, color) {
    super(width, height);
    this.color = color;
  }

  // 메서드 오버라이딩
  toString() {
    return super.toString() + `, color = ${this.color}`;
  }
}

const colorRectangle = new ColorRectangle(2, 4, "red");
console.log(colorRectangle); // ColorRectangle {width: 2, height: 4, color: 'red'}

// 상속을 통해 getArea 메서드를 호출
console.log(colorRectangle.getArea()); // 8
// 오버라이딩된 toString 메서드를 호출
console.log(colorRectangle.toString()); // width = 2, height = 4, color = red
```

#### 1. 서브클래스의 super 호출

- 자바스크립트 엔진은 클래스를 평가할 때 수퍼클래스와 서브클래스를 구분하기 위해 "base" 또는 "derived"를 값으로 갖는 내부 슬롯 [[ConstructorKind]]를 갖는다.
  - 다른 클래스를 상속받지 않는 클래스(그리고 생성자 함수)는 내부 슬롯 [[ConstructorKind]]의 값이 "base"로 설정되어 있다.
  - 다른 클래스를 상속받는 서브클래스는 내부 슬롯 [[ConstructorKind]]의 값이 "derived"로 설정되어 있다.
    - 위 두가지 조건을 통해 수퍼클래스와 서브클래스는 new 연산자와 함께 호출되었을 때 동작이 구분된다.
- 서브클래스는 자신이 직접 인스턴스를 생성하지 않고 수퍼클래스에게 인스턴스 생성을 위임한다.
  - 이것이 바로 서브클래스의 constructor에서 반드시 super를 호출해야하는 이유다.

#### 2. 수퍼클래스의 인스턴스 생성과 this 바인딩

- 수퍼클래스의 constructor 내부의 코드가 실행되기 이전에 암묵적으로 빈 객체를 생성한다.

  - 이 빈 객체가 바로 (아직 완성되지 않았지만) 클래스가 생성한 인스턴스다.
  - 그리고 암묵적으로 생성된 빈 객체, 즉 인스턴스는 this에 바인딩 된다.
  - 따라서 수퍼클래스의 constructor 내부의 this는 생성된 인스턴스를 가리킨다.

  ```javascript
  // 수퍼클래스
  class Rectangle {
    constructor(width, height) {
      // 암묵적으로 빈 객체, 즉 인스턴스가 생성되고 this에 바인딩된다.
      console.log(this); // ColorRectangle {}
      // new 연산자와 함께 호출된 함수, 즉 new.target은 ColorRectangle이다.
      console.log(new.target); // ColorRectangle

      // 생성된 인스턴스의 프로토타입으로 ColorRectangle.prototype이 설정된다.
      console.log(Object.getPrototypeOf(this) === ColorRectangle.prototype); // true
      console.log(this instanceof ColorRectangle); // true
      console.log(this instanceof Rectangle); // true
    }
    // ...
  }
  ```

#### 3. 수퍼클래스의 인스턴스 초기화

- 수퍼클래스의 constructor가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다.

  - 즉, this에 바인딩되어 있는 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티를 초기화한다.

  ```javascript
  // 수퍼클래스
  class Rectangle {
    constructor(width, height) {
      // 암묵적으로 빈 객체, 즉 인스턴스가 생성되고 this에 바인딩된다.
      console.log(this); // ColorRectangle {}
      // new 연산자와 함께 호출된 함수, 즉 new.target은 ColorRectangle이다.
      console.log(new.target); // ColorRectangle

      // 생성된 인스턴스의 프로토타입으로 ColorRectangle.prototype이 설정된다.
      console.log(Object.getPrototypeOf(this) === ColorRectangle.prototype); // true
      console.log(this instanceof ColorRectangle); // true
      console.log(this instanceof Rectangle); // true

      // 인스턴스 초기화
      this.width = width;
      this.height = height;

      console.log(this); // ColorRectangle {width: 2, height: 4}
    }
    // ...
  }
  ```

#### 4. 서브클래스 constructor로의 복귀와 this 바인딩

- super의 호출이 종료되고 제어 흐름이 서브클래스 constructor로 돌아온다.
  - 이때 super가 반환한 인스턴스가 this에 바인딩된다.
  - 서브클래스는 별도의 인스턴스를 생성하지 않고 super가 반환한 인스턴스를 this에 바인딩하여 그대로 사용한다.
  ```javascript
  // 서브클래스
  class ColorRectangle extends Rectangle {
    constructor(width, height, color) {
      super(width, height);

      // super가 반환한 인스턴스가 this에 바인딩 된다.
      console.log(this); // ColorRectangle {width: 2, height: 4}
    }
    // ...
  }
  ```
  > 이처럼 super가 호출되지 않으면 인스턴스가 생성되지 않으며, this 바인딩도 할 수 없다. 서브클래스의 constructor에서 super를 호출하기 전에는 this를 참조할 수 없는 이유가 바로 이 때문이다. 따라서 서브클래스 constructor 내부의 인스턴스 초기화는 반드시 super 호출 이후에 처리되어야 한다.

#### 5. 서브클래스의 인스턴스 초기화

- super 호출 이후, 서브클래스의 constructor에 기술되어 있는 인스턴스 초기화가 실행된다.
  - 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티를 초기화한다.

#### 6. 인스턴스 반환

- 클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

  ```javascript
  // 서브클래스
  class ColorRectangle extends Rectangle {
    constructor(width, height, color) {
      super(width, height);

      // super가 반환한 인스턴스가 this에 바인딩된다.
      console.log(this); // ColorRectangle {width: 2, height: 4}

      // 인스턴스 초기화
      this.color = color;
      // 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.
      console.log(this); // ColorRectangle {width: 2, height: 4, color: 'red'}
    }
    // ...
  }
  ```

### 25.8.7 표준 빌트인 생성자 함수 확장

- extends 키워드 다음에는 클래스뿐이 아니라 [[Construct]] 내부 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다.

  - String, Number, Array 같은 표준 빌트인 객체도 [[Construct]] 내부 메서드를 갖는 생성자 함수이므로 extends 키워드를 사용하여 확장할 수 있다.

  ```javascript
  // Array 생성자 함수를 상속받아 확장한 MyArray
  class MyArray extends Array {
    // 중복된 배열 요소를 제거하고 반환한다: [1, 1, 2, 3] => [1, 2, 3]
    uniq() {
      return this.filter((v, i, self) => self.indexOf(v) === i);
    }

    // 모든 배열 요소의 평균을 구한다: [1, 2, 3] => 2
    average() {
      return this.reduce((pre, cur) => pre + cur, 0) / this.length;
    }
  }

  const myArray = new MyArray(1, 1, 2, 3);
  console.log(myArray); // MyArray(4) [1, 1, 2, 3]

  // MyArray.prototype.uniq 호출
  console.log(myArray.uniq()); // MyArray(3) [1, 2, 3]
  // MyArray.prototype.average 호출
  console.log(myArray.average()); // 1.75
  ```

  > Array생성자 함수를 상속받아 확장한 MyArray 클래스가 생성한 인스턴스는 Array.prototype과 MyArray.prototype의 모든 메서드를 사용할 수 있다. 이때 주의할 것은 Array.prototype의 메서드 중에서 map, filter와 같이 새로운 배열을 반환하는 메서드가 MyArray 클래스의 인스턴스를 반환한다는 것이다.
