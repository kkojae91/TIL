# 9장 타입 변환과 단축 평가

## 9.1 타입 변환이란?

- `명시적 타입 변환(explicit coercion)`

  - `타입 캐스팅(type casting)` 이라 부르기도 한다.
  - 개발자가 `의도적으로` 값의 타입을 변환 하는 것

  > 명시적 타입 변환은 타입을 변경하겠다는 개발자의 의지가 코드에 명백히 드러난다.

  ```javascript
  var x = 10;

  // 명시적 타입 변환
  // 숫자를 문자열로 타입 캐스팅한다.
  var str = x.toString();
  console.log(typeof str, str); // string 10

  console.log(typeof x, x); // number 10
  ```

- `암묵적 타입 변환(implicit coercion)`

  - `타입 강제 변환(type coercion)` 이라 부르기도 한다.
  - 개발자의 `의도와는 상관 없이` 자바스크립트 엔진에 의해 값의 타입이 변환 하는 것

  > 암묵적 타입 변환은 자바스크립트 엔진에 의해 암묵적으로 즉, 드러나지 않게 타입이 자동 변환되기 때문에 타입을 변경하겠다는 개발자의 의지가 코드에 명백히 나타나지 않는다.

  ```javascript
  var x = 10;

  // 암묵적 타입 변환
  // 문자열 연결 연산자는 숫자 타임 x의 값을 바탕으로 새로운 문자열을 생성한다.
  var str = x + "";
  console.log(typeof str, str); // string 10

  console.log(typeof x, x); // number 10
  ```

> 명시적 타입 변환이나 암묵적 타입 변환이 `기존 원시 값을 직접 변경하는 것은 아니다.` 원시값은 변경 불가능한 값(immutable value)이므로 변경할 수 없다.
>
> `타입 변환`이란 `기존 원시 값을 사용해 다른 타입의 새로운 원시 값을 생성`하는 것이다.
>
> 암묵적 타입 변환은 기존 변수 값을 재할당하여 변경하는 것이 아니다. 자바스크립트 엔진은 표현식을 에러 없이 평가하기 위해 피연산자의 값을 암묵적 타입 변환해 새로운 타입의 값을 만들어 단 한 번 사용하고 버린다.
>
> 명시적 타입 변환만을 사용하는 코드가 좋은 코드라는 논리는 맞지 않다. `때로는 암묵적 타입 변환이 가독성 측면에서 더 좋을 수 있다.`
>
> `중요한 것은 코드를 예측할 수 있어야 한다는 것.` 동료가 작성한 코드를 정확히 이해할 수 있어야 하고 자신이 작성한 코드도 동료가 쉽게 이해할 수 있어야 한다.

## 9.2 암묵적 타입 변환

- 자바스크립트는 가급적 에러를 발생시키지 않도록 암묵적 타입 변환을 통해 표현식을 평가한다.
- 암묵적 타입 변환이 발생하면 문자열, 숫자, 불리언과 같은 원시 타입 중 하나로 타입을 자동 변환 한다.

### 9.2.1 문자열 타입으로 변환

- 자바스크립트 엔진은 표현식을 평가할 때 `코드 문맥에 부합하도록 암묵적 타입 변환`을 실행
  ```javascript
  1 + "2"; // -> '12'
  ```
  > 자바스크립트 엔진은 문자열 연결 연산자 표현식을 평가하기 위해 문자열 연결 연산자의 `피연산자 중`에서 `문자열 타입이 아닌 피연산자`를 `문자열 타입으로 암묵적 타입 변환`한다.

```javascript
// number 타입
0 + '' // -> '0'
-0 + '' // -> '0'
1 + '' // -> '1'
-1 + '' // -> '-1'
NaN + '' // -> 'NaN'
Infinity + '' // -> 'Infinity'
-Infinity + '' // -> '-Infinity'

// boolean 타입
true + '' // -> 'true'
false + '' // -> 'false'

// null 타입
null + '' // -> 'null'

// undefined 타입
undefined + '' // -> 'undefined'

// symbol 타입
(Symbol()) + '' // -> TypeError: Cannot convert a Symbol value to a string

// object 타입
({}) + '' // -> '[object Object]'
Math + '' // -> '[object Math]'
[] + '' // -> ''
[10, 20] + '' // -> '10,20'
(function(){}) + '' // -> 'function(){}'
Array + '' // -> ''function Array() {[native code]}'
```

### 9.2.2 숫자 타입으로 변환

```javascript
1 - "1"; // -> 0
1 * "10"; // -> 10
1 / "one"; // -> NaN
```

> 자바스크립트 엔진은 `산술 연산자 표현식을 평가`하기 위해 산술 연산자의 `피연산자 중에서 숫자 타입이 아닌` 피연산자를 `숫자 타입으로 암묵적 타입 변환` 한다.
>
> 이때 피연산자를 `숫자 타입으로 변환할 수 없는 경우`는 산술 연산을 수행할 수 없으므로 표현식의 `평가 결과는 NaN`이 된다.

```javascript
"1" > 0; // -> true
```

> 자바스크립트 엔진은 `비교 연산자 표현식을 평가`하기 위해 비교 연산자의 `피연산자 중에서 숫자 타입이 아닌` 피연산자를 `숫자 타입으로 암묵적 타입 변환` 한다.

```javascript
// number 타입
+"" + // -> 0
  "0" + // -> 0
  "1" + // -> 1
  "string" + // -> NaN
  // boolean 타입
  true + // -> 1
  false + // -> 0
  // null 타입
  null + // -> 0
  // undefined 타입
  undefined + // NaN
  // symbol 타입
  Symbol() + // -> TypeError: Cannot convert a Symbol value to a number
  // object 타입
  {} + // -> NaN
  [] + // -> 0
  [10, 20] + // -> NaN
  function () {}; // -> NaN
```

- `빈 문자열('')`, `빈 배열([])`, `null`, `false`는 `0으로 변환`
- `ture` 는 `1로 변환`
- `객체`와 `빈 배열이 아닌 배열`, `undefined`는 변환되지 않아 `NaN이 된다.`

### 9.2.3 불리언 타입으로 변환

- 자바스크립트 엔진은 `조건식의 평가 결과`를 `불리언 타입`으로 `암묵적 타입 변환`한다.

```javascript
if ("") {
  console.log("1");
}
if (true) {
  console.log("2");
}
if (0) {
  console.log("3");
}
if ("str") {
  console.log("4");
}
if (null) {
  console.log("5");
}

// 2 4
```

> 자바스크립트 엔진은 불리언 타입이 아닌 값을 `Truthy 값(참으로 평가되는 값)` 또는 `Falsy 값(거짓으로 평가되는 값)`으로 `구분`한다.
>
> 즉, 제어문의 조건식과 같이 불리언 값으로 평가되어야 할 문맥에서 `Truthy 값은 true`로, `Falsy 값은 false`로 `암묵적 타입 변환`된다.

- `false로 평가 되는 Falsy 값!`

  - `false`
  - `undefined`
  - `null`
  - `0`
  - `-0`
  - `NaN`
  - `''`

  ```javascript
  // 아래 조건문은 모두 코드 블록을 실행한다.
  if (!false) {
    console.log(false + " is falsy value");
  }
  if (!undefined) {
    console.log(undefined + " is falsy value");
  }
  if (!null) {
    console.log(null + " is falsy value");
  }
  if (!0) {
    console.log(0 + " is falsy value");
  }
  if (!NaN) {
    console.log(NaN + " is falsy value");
  }
  if (!"") {
    console.log("" + " is falsy value");
  }
  ```

- `true로 평가 되는 true 값`
  - `Falsy 값 외의 모든 값`

## 9.3 명시적 타입 변환

- 명시적 타입 변환 방법
  - 표준 빌트인 생성자 함수를 new 연산자 없이 호출하는 방법
  - 암묵적 타입 변환을 의도적으로 이용하는 방법

### 9.3.1 문자열 타입으로 변환

1. String 생성자 함수를 new 연산자 없이 호출하는 방법
2. Object.prototype.toString 메서드를 사용하는 방법
3. 문자열 연결 연산자를 이용하는 방법

```javascript
// 1. String 생성자 함수를 new 연산자 없이 호출하는 방법
// 숫자 타입 => 문자열 타입
String(1); // -> '1'
String(NaN); // -> 'NaN'
String(Infinity); // -> 'infinity'
// 불리언 타입 => 문자열 타입
String(true); // -> 'true'
String(false); // -> 'false'

// 2. Object.prototype.toString 메서드를 사용하는 방법
// 숫자 타입 => 문자열 타입
(1).toString(); // -> '1'
NaN.toString(); // -> 'NaN'
Infinity.toString(); // -> 'Infinity'
// 불리언 타입 => 문자열 타입
true.toString();
false.toString();

// 3. 문자열 연결 연산자를 이용하는 방법
// 숫자 타입 => 문자열 타입
1 + ""; // -> '1'
NaN + ""; // -> 'NaN'
Infinity + ""; // -> 'Infinity'
// 불리언 타입 => 문자열 타입
true + ""; // 'true'
false + ""; // 'false'
```

### 9.3.2 숫자 타입으로 변환

1. Number 생성자 함수를 new 연산자 없이 호출하는 방법
2. parseInt, parseFloat 함수를 사용하는 방법 (문자열만 숫자 타입으로 변환 가능)
3. - 단항 산술 연산자를 이용하는 방법
4. - 산술 연산자를 이용하는 방법

```javascript
// 1. Number 생성자 함수를 new 연산자 없이 호출하는 방법
// 문자열 타입 => 숫자 타입
Number("0"); // -> 0
Number("-1"); // -> -1
Number("10.53"); // -> 10.53
// 불리언 타입 => 숫자 타입
Number(true); // -> 1
Number(false); // -> 0

// 2. parseInt, parseFloat 함수를 사용하는 방법 (문자열만 변환 가능)
parseInt("0"); // -> 0
parseInt("-1"); // -> -1
parseFloat("10.53"); // -> 10.53

// 3. + 단항 산술 연산자를 이용하는 방법
// 문자열 타입 => 숫자 타입
+"0"; // -> 0
+"-1"; // -> -1
+"10.53"; // -> 10.53
// 불리언 타입 => 숫자 타입
+true; // -> 1
+false; // -> 0

// 4. * 산술 연산자를 이용하는 방법
// 문자열 타입 => 숫자 타입
"0" * 1; // -> 0
"-1" * 1; // -> 1
"10.53" * 1; // -> 10.53
// 불리언 타입 => 숫자 타입
true * 1; // -> 1
false * 1; // -> 0
```

### 9.3.3 불리언 타입으로 변환

1. Boolean 생성자 함수를 new 연산자 없이 호출하는 방법
2. ! 부정 논리 연산자를 두 번 사용하는 방법

```javascript
// 1. Boolean 생성자 함수를 new 연산자 없이 호출하는 방법
// 문자열 타입 => 불리언 타입
Boolean("x"); // true
Boolean(""); // false
Boolean("false"); // true
// 숫자 타입 => 불리언 타입
Boolean(0); // false
Boolean(1); // true
Boolean(NaN); // false
Boolean(Infinity); // true
// null 타입 => 불리언 타입
Boolean(null); // false
// undefined 타입 => 불리언 타입
Boolean(undefined); // false
// 객체 타입 => 불리언 타입
Boolean({}); // true
Boolean([]); // true

// 2. ! 부정 논리 연산자를 두 번 사용하는 방법
// 문자열 타입 => 불리언 타입
!!"x"; // true
!!""; // false
!!"false"; // true
// 숫자 타입 => 불리언 타입
!!0; // false
!!1; // true
!!NaN; // false
!!Infinity; // true
// null 타입 => 불리언 타입
!!null; // false
// undefined 타입 => 불리언 타입
!!undefined; // false
// 객체 타입 => 불리언 타입
!!{}; // true
!![]; // true
```

## 9.4 단축 평가

### 9.4.1 논리 연산자를 사용한 단축 평가

- `논리합(||)`, `논리곱(&&)` 연산자 표현식의 `평가 결과는 불리언 값이 아닐 수도 있다.`
- `논리합(||)`, `논리곱(&&)` 연산자 표현식은 언제나 `2개의 피연산자 중 어느 한쪽으로 평가`된다.

- `논리곱(&&) 연산자`

  ```javascript
  "Cat" && "Dog"; // -> 'Dog'
  ```

  - 논리곱 연산자는 두 개의 피연산자가 `모두 true`로 평가될 때 `true를 반환`한다.
  - 논리곱 연산자는 좌항에서 우항으로 평가가 진행된다.
  - 두 번째 피연산자가 위 논리곱 연산자 표현식의 평가 결과를 결정한다.
    - 논리곱 연산자는 논리 연산의 결과를 결정하는 두번째 피연산자. 즉, 'Dog'을 그대로 반환한다.

- `논리합(||) 연산자`

  ```javascript
  "Cat" || "Dog"; // -> 'Cat'
  ```

  - 논리합 연산자는 두 개의 피연산자 중 `하나만 true`로 평가되어도 `true를 반환`한다.
  - 논리합 연산자는 좌항에서 우항으로 평가가 진행된다.
  - 첫 번째 피연산자 'Cat'은 Truthy 값이므로 true로 평가된다.
    - 논리합 연산자는 논리 연산의 결과를 결정한 첫 번째 피연산자. 즉, 'Cat'을 그대로 반환한다.

- `단축 평가(short-circuit evalution)`

  - 표현식을 `평가하는 도중에 평가 결과가 확정`된 경우 `나머지 평가 과정을 생략`하는 것을 말한다.
  - 논리곱(&&) 연산자와 논리합(||) 연산자는 이처럼 `논리 연산의 결과를 결정하는 피연산자를 타입 변환하지 않고 반환`한다.

  | 단축 평가 표현식            | 평가 결과 |
  | --------------------------- | --------- |
  | true &#124;&#124; anything  | true      |
  | false &#124;&#124; anything | anything  |
  | true && anything            | anything  |
  | false && anything           | false     |

  ```javascript
  // 논리합(||) 연산자
  "Cat" || "Dog"; // -> 'Cat'
  false || "Dog"; // -> 'Dog'
  "Cat" || false; // -> 'Cat'

  // 논리곱(&&) 연산자
  "Cat" && "Dog"; // -> 'Dog'
  false && "Dog"; // -> false
  "Cat" && false; // -> false
  ```

- 단축 평가를 사용하면 if문을 대체할 수 있다.

  - 어떤 조건이 `Truthy 값`(참으로 평가되는 값)일 때 무언가를 해야한다면 `논리곱(&&) 연산자 표현식으로 if문을 대체`할 수 있다.

  ```javascript
  var done = true;
  var message = "";

  // 주어진 조건이 true일 때
  if (done) {
    message = "완료";
  }

  // if문 단축 평가로 대체 가능하다.
  // done이 true라면 message에 '완료'를 할당
  message = done && "완료";
  console.log(message); // '완료'
  ```

  - 어떤 조건이 `Falsy 값`(거짓으로 평가되는 값)일 때 무언가를 해야 한다면 `논리합(||) 연산자 표현식으로 if 문을 대체`할 수 있다.

  ```javascript
  var done = false;
  var message = "";

  // 주어진 조건이 false일 때
  if (!done) {
    message = "미완료";
  }

  // if 문은 단축 평가로 대체 가능하다.
  // done이 false라면 message에 '미완료'를 할당
  message = done || "미완료";
  console.log(message); // '미완료'
  ```

  - `삼항 조건 연산자`는 `if...else문을 대체`할 수 있다.

  ```javascript
  var done = true;
  var message = "";

  // if...else문
  if (done) {
    message = "완료";
  } else {
    message = "미완료";
  }
  console.log(message); // 완료

  // if...else 문은 삼항 조건 연산자로 대체 가능하다.
  message = done ? "완료" : "미완료";
  console.log(message); // 완료
  ```

- 객체를 가리키기를 기대하는 변수가 객체가 아닌 null 또는 undefined가 아닌지 확인하고 프로퍼티를 참조할 때

  - 객체의 프로퍼티를 참조하면 타입 에러(TypeError)가 발생.
  - 프로그램이 강제 종료 된다.

  ```javascript
  var elem = null;
  var value = elem.value; // TypeError: Cannot read property 'value' of null
  ```

  - 단축 평가를 사용할 경우 error가 발생하지 않는다.

  ```javascript
  var elem = null;
  // elem이 null이나, undefined와 같은 falsy 값이면 elem으로 평가되고
  // elem이 truthy 값이면 elem.value로 평가된다.
  var value = elem && elem.value; // -> null
  ```

- 함수 매개변수에 기본값을 설정할 때

  - 단축 평가를 사용해 매개변수의 기본값을 설정하면 undefined로 인해 발생할 수 있는 에러를 방지할 수 있다.

  ```javascript
  // 단축 평가를 사용한 매개변수의 기본값 설정
  function getStringLength(str) {
    str = str || "";
    return str.length;
  }

  getStringLength(); // 0
  getStringLength("hi"); // 2

  // ES6의 매개변수의 기본값 설정
  function getStringLength(str = "") {
    return str.length;
  }

  getStringLength(); // 0
  getStringLength("hi"); // 2
  ```

  ### 9.4.2 옵셔널 체이닝 연산자

  - 옵셔널 체이닝(optional chaning) 연산자 ?.

    - ES11(EcmaScript2020)에서 도입
    - 좌항의 피연산자가 null 또는 undefined인 경우 undefined를 반환 하고, 그렇지 않으면 우항의 프로퍼티 참조를 이어간다.

    ```javascript
    var elem = null;

    // elem이 null 또는 undefined이면 undefined를 반환하고,
    // 그렇지 않으면 우항의 프로퍼티 참조를 이어간다.
    var value = elem?.value;
    console.log(value); // undefined
    //
    var str = "";

    // 문자열의 길이(length)를 참조한다.
    // 좌항 피연산자가 false로 평가되는 falsy 값이라도
    // null 또는 undefined가 아니면 우항의 프로퍼티 참조를 이어간다.
    var length = str?.length;
    console.log(length); // 0
    ```

  ### 9.3.2 null 병합 연산자

  - null 병합(nullish coalescing) 연산자 ??

    - ES11(EcmaScript2020)에서 도입
    - 좌항의 피연산자가 null 또는 undefined인 경우 우항의 피연산자를 반환하고, 그렇지 않으면 좌항의 피연산자를 반환한다.
    - null 병합연산자 ??는 변수에 기본값을 설정할 때 유용

    ```javascript
    // 좌항의 피연산자가 null 또는 undefined이면 우항의 피연산자를 반환하고,
    // 그렇지 않으면 좌항의 피연산자를 반환한다.
    var foo = null ?? "default string";
    console.log(foo); // default string

    // 좌항의 피연산자가 falsy 값이라도 null 또는 undefined가 아니면 좌항의 피연산자를 반환한다.
    var foo = "" ?? "defulat string";
    console.log(foo); // ''
    ```
