# 47장. 에러 처리

## 47.1 에러 처리의 필요성

- 에러(error)가 발생하지 않는 코드를 작성하는 것은 불가능하다.

  - 따라서 에러는 언제나 발생할 수 있다.
  - 발생한 에러에 대해 대처하지 않고 방치하면 프로그램은 강제 종료된다.

    ```javascript
    console.log("[Start]");

    foo(); // ReferenceError: foo is not defined
    // 발생한 에러를 방치하면 프로그램은 강제 종료된다.

    // 에러에 의해 프로그램이 강제 종료되어 아래 코드는 실행되지 않는다.
    console.log("[End]");
    ```

  - try...catch 문을 사용해 발생한 에러에 적절하게 대응하면 프로그램이 강제종료되지 않고 계속해서 코드를 실행시킬 수 있다.

    ```javascript
    console.log("[Start]");

    try {
      foo();
    } catch (error) {
      console.error(error);
      // [에러 발생] ReferenceError: foo is not defined
    }

    // 발생한 에러에 적절한 대응을 하면 프로그램이 강제 종료되지 않는다.
    console.log("[End]");
    ```

- 직접적으로 에러를 발생하지는 않는 예외(exception)적인 상황이 발생할 수도 있다.

  - 예외적인 상황에 적절하게 대응하지 않으면 에러로 이어질 가능성이 크다.

    ```javascript
    // DOM에 button 요소가 존재하지 않으면 querySelector 메서드는 에러를 발생시키지 않고 null을 반환한다.
    const $button = document.querySelector("button"); // null

    $button.classList.add("disabled");
    // TypeError: Cannot read property 'classList' of null
    ```

  - 위 예제의 querySelector 메서드는 인수로 전달한 문자열이 CSS 선택자 문법에 맞지 않은 경우 에러를 발생시킨다.
    ```javascript
    const $elem = document.querySelector("#1");
    // DOMException: Failed to execute 'querySelector' on 'Document': '#1' is not a valid selector.
    ```
    > 하지만 querySelector 메서드는 인수로 전달한 CSS 선택자 문자열로 DOM에서 요소 노드를 찾을 수 없는 경우 에러를 발생시키지 않고 null을 반환한다. 이때 if문으로 querySelector 메서드의 반환값을 확인하거나 단축 평가 또는 옵셔널 체이닝 연산자 ?.를 사용하지 않으면 다음 처리에서 에러로 이어질 가능성이 크다.
    ```javascript
    // DOM에 button 요소가 존재하는 경우 querySelector 메서드는 에러를 발생시키지 않고 null을 반환한다.
    const $button = document.querySelector("button"); // null
    $button?.classList.add("disabled");
    ```
    > 이처럼 에러나 예외적인 상황에 대응하지 않으면 프로그램은 강제 종료될 것이다. 에러나 예외적인 상황은 너무나 다양하기 때문에 아무런 조치 없이 프로그램이 강제 종료된다면 원인을 파악하여 대응하기 어렵다.
    >
    > 에러가 발생하지 않는 코드를 작성하는 것이 이상적이지만 안타깝게도 그것은 불가능하다. 따라서 우리가 작성한 코드에서는 언제나 에러나 예외적인 상황이 발생할 수 있다는 것을 전제하고 이에 대응하는 코드를 작성하는 것이 중요하다.

## 47.2 try...catch...finally 문

- 기본적으로 에러 처리를 구현하는 방법은 크게 두 가지가 있다.

  - querySelector나 Array#find 메서드처럼 예외적인 상황이 발생하면 반환하는 값(null 또는 -1)을 if 문이나 단축 평가 또는 옵셔널 체이닝 연산자를 통해 확인해서 처리하는 방법과 에러 처리 코드를 미리 등록해 두고 에러가 발생하면 에러 처리 코드로 점프하도록 하는 방법이 있다.
  - try...catch...finally 문은 두 번째 방법이다. 일반적으로 이 방법을 에러 처리(error handling)이라 한다.
  - try...catch...finally 문은 3개의 코드 블록으로 구성된다.
    - finally 문은 불필요하다면 생략 가능하다.

- try...catch..finally 문을 실행하면 먼저 try 코드 블록이 실행된다.

  - 이때 try 코드 블록에 포함된 문 중에서 에러가 발생하면 발생한 에러는 catch 문의 err 변수에 전달되고 catch 코드 블록이 실행된다.
  - catch 문의 err변수(변수 이름은 무엇이든 상관없다)는 try 코드 블록에 포함된 문 중에서 에러가 발생하면 생성되고 catch 코드 블록에서만 유효하다.
  - finally 코드 블록은 에러 발생과 상관없이 반드시 한 번 실행된다.

- try...catch...finally 문으로 에러를 처리하면 프로그램이 강제 종료되지 않는다.

  ```javascript
  console.log("[Start]");

  try {
    // 실행할 코드(에러가 발생할 가능성이 있는 코드)
    foo();
  } catch (err) {
    // try 코드 블록에서 에러가 발생하면 이 코드 블록의 코드가 실행된다.
    // err에는 try 코드 블록에서 발생한 Error 객체가 전달된다.
    console.error(err); // ReferenceError: foo is not defined
  } finally {
    // 에러 발생과 상관없이 반드시 한 번 실행된다.
    console.log("finally");
  }

  // try...catch...finally 문으로 에러를 처리하면 프로그램이 강제 종료되지 않는다.
  console.log("[End]");
  ```

## 47.3 Error 객체

- Error 생성자 함수는 에러 객체를 생성한다.

  - Error 생성자 함수에는 에러를 상세히 설명하는 에러 메세지를 인수로 전달할 수 있다.

  ```javascript
  const error = new Error("invalid");
  ```

- Error 생성자 함수가 생성한 에러 객체는 message 프로퍼티와 stack 프로퍼티를 갖는다.

  - message 프로퍼티의 값은 Error 생성자 함수에 인수로 전달한 에러 메세지이다.
  - stack 프로퍼티의 값은 에러를 발생시킨 콜 스택의 호출 정보를 나타내는 문자열이며 디버깅 목적으로 사용한다.

- 자바스크립트는 Error 생성자 함수를 포함해 7가지의 에러 객체를 생성할 수 있는 Error 생성자 함수를 제공한다.
  - 에러 객체의 프로토타입은 모두 Error.prototype을 상속받는다.
    생성자 함수 | 인스턴스
    --|--
    Error | 일반적인 에러 객체
    SyntaxError | 자바스크립트 문법에 맞지 않는 문을 해석할 때 발생하는 에러 객체
    ReferenceError | 참조할 수 없는 식별자를 참조했을 때 발생하는 에러 객체
    TypeError | 피연산자 또는 인수의 데이터 타입이 유효하지 않을 때 발생하는 에러 객체
    RangeError | 숫자값의 허용 범위를 벗어났을 때 발생하는 에러 객체
    URIError | encodeURI 또는 decodeURI 함수에 부적절한 인수를 전달했을 때 발생하는 에러 객체
    EvalError | eval 함수에서 발생하는 에러 객체
  ```javascript
  1 @ 1; // SyntaxError: Invalid or unexpected token
  foo(); // ReferenceError: foo is not defined
  null.foo; //TypeError: Cannot read property 'foo' of null
  new Array(-1); // RangeError: Invalid array length
  decodeURIComponent('%'); // URIError: URI malformed
  ```
