# 1단계 공통 피드백 리마인드

## 1. HTML/CSS

### 웹 표준 - 의미에 맞는 태그는 무엇일 지 고민해보기

"표준" 이라는 것은 다함께 정의한 기준이라는 뜻입니다.
우리가 만든 웹 페이지를 기계가 볼 때, 의도한 의미대로 전달하고 싶다면 HTML을 조금 더 sementic 하게 작성해주어야 한다.

- sementic tag란?

**섹션 구분을 조금 더 의미 있게 div가 아닌 section 혹은 article 을 사용할 수 있다.**

> [<section>, <article>, <div> 용도에 맞게 사용하기](https://kkojae.tistory.com/3?category=923015)

### 관심사 분리 - 스타일은 CSS에게 맡기기

HTML, CSS, JS는 각자의 역할이 존재한다.
JS에서 셀렉터들을 가지고 HTML, CSS를 직접 만들고 수정할 수도 있지만, 셀렉터를 조작하거나, 이벤트 리스너를 붙이는 등의 일을 할 뿐, HTML, CSS의 역할을 뺏지는 않는다.

이런 분리가 잘 되어있지 않다면, 무언가 스타일이 바뀔 때 CSS도 찾아보고 JS도 찾아야하는 불상사가 일어날 수 있다.

- 예시) 👎🏼

  ```javascript
  $(".racing-count-input-container").style.display = "flex";
  ```

- 예시) 👍🏼

  ```css
  .display-flex {
    display: flex;
  }
  ```

  ```javascript
  $(".racing-count-input-container").classList.add("display-flex");
  ```

## 2. Javascript

---

### class의 의미 생각해보기

JS에서 class는 필수가 아니다.
일반 객체로도 구현할 수 있을 경우 객체를 사용해서 구현하면 된다.

- 예시) 👎🏼

  ```javascript
  export default class Validator {
    static isCarNameBlank(carNames) {
      const filtered = carNames.filter((name) => name === "");
      return filtered.length > NUMBER.ZERO;
    }

    static isInvalidCarNameLength(carNames) {
      const filtered = carNames.filter(
        (name) => name.length > NUMBER.MAX_LENGTH
      );
      return filtered.length > NUMBER.ZERO;
    }

    static isInValidCarNamesInput(carNames) {
      return (
        this.isCarNameBlank(carNames) || this.isInvalidCarNameLength(carNames)
      );
    }

    static isFloat(number) {
      return !Number.isInteger(Number(number));
    }
  }
  ```

- 예시) 👍🏼
  ```javascript
  const validator = {
    isCarNameBlank(carNames) {
      const filtered = carNames.filter((name) => name === '');
      return filtered.length > NUMBER.ZERO;
    },
    isInvalidCarNameLength(carNames) {
      const filtered = carNames.filter((name) => name.length > NUMBER.MAX_LENGTH);
      return filtered.length > NUMBER.ZERO;
    },
    isInValidCarNamesInput(carNames) {
      return this.isCarNameBlank(carNames) || this.isInvalidCarNameLength(carNames);
    },
    static isFloat(number) {
      return !Number.isInteger(Number(number));
    }
  }
  ```

### 은닉화를 약속하는 과거의 유산

접근 제어자를 지원하지 않는 과거 JS에서는 언더바(\_)를 붙이는 컨벤션으로 private 변수, 메서드를 구분했었다.

2008년에 더글라스 크락포드가 제안했지만, 최근에는 지양하자는 이야기가 많다. 이유가 무엇인지 알아보자!

- 나이스 샵(#)

  자바스크립트에서도 꼼수가 아닌 정상적인 방법으로 클래스에 private 속성을 만들 수 있게 되었다. TC39의 스펙문서를 토대로 간단하게 요약하면 아래와 같다.

  - Stage-3 단계에 있는 스펙으로 특별한 결격 사유가 없는 한 표준 스펙이 될 것이다. 물론 변경되거나 개선될 여지는 있다.
  - private과 같은 키워드를 사용하지 않는다. 대신 `#` 즉 샵 프리픽스를 사용한다. **키워드가 아니라 프리픽스다.** 속성 명 앞에 `#`이 붙으면 Private 필드로 동작한다.
  - public과 다른 점은 클래스의 필드 선언을 통해서만 만들 수 있다. 즉 동적으로 객체에 private 필드를 추가할 수 없다.
  - 메서드에는 제한적이다. **메서드 선언으로 사용할 수 없다.** private 메서드를 만들려면 함수 표현식으로 정의해야 한다. (현재로서의 의미다.. 추후 스펙이 업데이트될 수도 있다.)
  - Computed Proprety Name을 사용할 수 없다. `#foo` 자체만 식별자로 허용되고 `#[fooName]` 이건 문법 오류다.
  - `모든 Private 필드는 소속된 클래스에 고유한 스코프를 갖는다.`

- 간단하게 `#` 프리픽스를 이용해서 Human 클래스에 `#age` 속성을 만들고 외부에서 접근해보자.

  ```javascript
  class Human {
    #age = 10;
  }

  const person = new Human();

  console.log(person.#age); // Error : Property '#age' is not accessible outsied class 'Human' because it has a private identifier
  ```

- `#`은 키워드가 아니라 프리픽스다. `#` 없이는 해당 클래스 내부에서도 접근할 수 없다.

  ```javascript
  class Human {
    #age = 10;

    getAge() {
      return this.age; // Error : Property 'age' does not exist on type 'Human'. Did you mean '#age'?
    }
  }
  ```

- 정상적으로 private 속성을 클래스에서 정의하고 사용해보자.

  ```javascript
  class Human {
    #age = 10;

    getAge() {
      return this.#age;
    }
  }

  const person = new Human();
  console.log(person.getAge()); // 10
  ```

  > 외부의 getAge()라는 getter를 노출해 #age 값에 접근할 수 있게 했다.

- 자바스크립트의 private 속성은 독특한 특징이 있다. **"모든 Private 필드는 소속된 클래스에 고유한 스코프를 갖는다."**

  ```javascript
  class Human {
    #age = 10;

    getAge() {
      return this.#age;
    }
  }

  class Person extends Human {
    #age = 20;

    getFakeAge() {
      return this.#age;
    }
  }

  const p = new Person();
  console.log(p.getAge()); // 10
  console.log([.getFakeAge()]); // 20
  ```

  > `#age` 즉 private 속성은 그동안 우리가 알고 있던 this의 그 컨텍스트와는 다른 방식으로 저장된다. **기존처럼 인스턴스별로 독립적인 공간을 갖지만, 추가로 클래스 별로 독립적인 공간을 갖는 것이다.** 쉽게 말하면 Human 클래스 스코프의 `#age`와 Person 클래스 스코프의 `#age`는 다르다는 것이다. 그러므로 Human 클래스에 속한 `getAge()`가 실행될 때는 `Human의 #age`에 접근하고 Person의 `getFakeAge()`가 실행될 때는 `Person의 #age`에 접근하는 것이다. 바로 그게 "모든 Private 필드는 소속된 클래스에 고유한 스코프를 갖는다."라는 문장의 의미다.

> 참조링크 : [은닉을 향한 자바스크립트의 여정](https://ui.toast.com/weekly-pick/ko_20200312)

## 3. 클린 코드 연습

### depth 줄이기

depth가 깊어질수록, 코드의 가독성이 떨어지게 된다.

- early return

  - 이 형태로 작성할 경우, 불필요한 else 구문을 제거할 수 있다.
  - 예외 케이스를 함수 상단에 먼저 정의함으로써, 예외 케이스에 대해 파악하기 쉽다는 장점도 있다.

  ```javascript
  moveForward() {
    if (!carName()) {
      return;
    }

    this.position += 1;
  }
  ```

- boolean 값만 리턴해주는 함수라면 조건문 없이 리턴하기!

  ```javascript
  const isValidLength = (name) => name.length <= 5;
  ```

  - 조건이 하나가 아닌 경우 드모르간 법칙 이용하기!

    ```javascript
    isValidRacingCount = (racingCountInputValue) => {
      if (!A || B) {
        return false;
      }

      return true;
    };

    // => 드모르간 법칙으로 변경
    isValidRacingCount = (racingCountInputValue) => {
      return A && !B;
    };
    ```

- 드모르간 법칙이란?

  - 논리학과 수학의 법칙 중 하나이다. 논리 연산에서 논리합은 논리곱과 부정기호로, 논리곱은 논리합과 부정기호로 표현할 수 있음을 가리키는 법칙이다.
  - 일반적인 표현

    not (A or B) = (not A) and (not B)

    not (A and B) = (not A) or (not B)

  ```javascript
  // step1
  if (!A || B) return false;
  return true;

  // step 2
  if (!(A && !B)) return false;
  return true;

  // step 3
  if (A && !B) return true;
  return false;

  // step 4
  return A && !B;
  ```

### 이름을 통해 의도를 드러내기

> 좋은 프로그래머는 사람이 이해할 수 있는 코드를 짠다. <리팩토링(Refactoring)>

- 변수, 함수 등 이름을 지을 때는 축약하지 않기를 권장합니다. 의도를 드러낼 수 있다면 이름이 길어져도 괜찮습니다.
- 조금 길더라도 명확한 이름이 축약해서 짧지만 조금 모호한 이름보다 파악하기 쉽습니다.
- 파악하기 쉬운 코드라면, 이후에 유지보수할 때에도 잘못 이해해서 버그를 만들게 될 가능성이 조금 더 줄어든다.
- 보편적으로 is~, should~, can~ 과 같은 네이밍은 boolean 값을 반환하기를 기대한다.
- **이름과 언행일치 시키기.**
  - 이름을 보고 동작을 예측할 수 있는지 고민해보기!

### 하나의 함수에서는 하나의 일만

- 하나의 함수에서 하나의 일만 책임진다.

  - 함수 길이가 길어진다면, 여러 일을 같이 하려고 하는 경우일 가능성이 높다.
  - 예) 검증하기 / 검증한 결과에 따라 행동하기는 각각 별개의 일이다.

- 아래 함수는 어떤 일을 할까?

  ```javascript
  isValidCarName() {
    if (carName.length > 5) {
      alert('자동차 이름은 5자 이하로 입력해주세요.');
      return ;
    }

    return true;
  }
  ```

- isValid~ 라는 이름을 본다면, true/false 여부를 판단하는 일을 할 것이라고 기대하게 된다.

  - 이렇게 기대한 상황에서 alert을 띄우는 일이 이 안에서 일어나는 건 예측하지 못한 동작, 기대한 일에 더해 다른 일을 추가로 하는 함수가 된다.

  ```javascript
  // 비즈니스 로직
  isValidLength(carName) {
    return carName.length < 5;
  }

  // UI
  if (!isValidLength(carName)) {
    alert("자동차 이름은 5자 이하로 입력해주세요!");
  }
  ```

### 상수화하기

컨벤션에 맞추어 대문자 snake case, CONSTANT_CASE로 사용한다.

- 값 하드 코딩하지 말기

  문자열, 숫자 등의 값을 하드 코딩하는 경우, (매직 넘버라고 부르기도 합니다)

  어떤 값인지 의미를 알기 어렵고, 수정해야 하는 경우 직접 값을 찾아가며 수정해주어야 하는 불편함이 있다.

  의미 있게 사용하는 값에는 이름을 붙여서 의도를 드러낸다.

- 필요한 만큼만, 재사용한다.

  반복해서 쓰이는 값이라면, 휴먼 에러를 방지하기 위해 상수화해서 사용한다.

  모든 값을 무조건 상수화해야하는 것은 아니다!

  - 예) 👎🏼
    ```javascript
    const APP_TITLE = "자동차 경주 게임";
    const EVENT = {
      CLICK: "click",
      KEYUP: "keyup",
    };
    ```

### 객체 속 데이터를 직접 접근하지 않고 객체한태 부탁하기

- 각각의 객체의 역할과 책임을 명확하게 하기

- 예) 👎🏼

  ```javascript
  goForward() {
    this.model.carPosition++;
  }
  ```

- 예) 👍🏼
  ```javascript
  goForward() {
    this.model.goForward();
  }
  ```

### 의도하지 않은 값의 변경막기

- 모델의 데이터를 직접 변경할 때는 원본 데이터 변경으로 인해 의도치 않게 영향을 끼치는 부분이 없는지 주의가 필요
- 의도치 않은 사이드이펙트(부수효과)를 발생시키지 않도록, 변경되지 않아야 하는 값들은 함부로 외부에서 변경하지 않도록 주의가 필요

> 관련 키워드 "immutable": 흔히 이 내용을 'immutable하게 유지한다.', 'immutable한 방식으로 구현한다'와 같이 이야기 한다.

### util의 의미는?

util은 보통 도메인과 상관없이 사용할 수 있는 로직들을 모아두는 곳이다.

- 예) 자동차 경주 게임과 상관없이 재사용할 수 있는, 범용성이 있는 함수는 util로 분리하는 것을 고려하고, 반대로 '자동차 경주 게임'에 관련된 로직이 util에 있다면 다시 정리하는 것을 고민할 필요하가 있다.

### 불필요한 주석은 남기지 않는다.

### 불필요한 console.log를 남기지 않는다.

### 예약어와 비슷한 네이밍 지양하기.

## 4. Testing

### E2E의 테스트 명세는 좀 더 사용자에 가깝게 작성

- E2E는 사용자 입장에서 어플리케이션의 전체 사용 흐름을 테스트하기 위한 테스트이다.

  - 다시말해, E2E 테스트 코드를 읽으면 '사용자 입장에서' 이 어플리케이션이 어떻게 쓰이는 지에 대해 파악할 수 있어야 한다.
  - 따라서, 명세도 그렇게 파악할 수 있는 형태로 작성하는 것이 좋다.

- 예) 👎🏼

  ```javascript
  it("잘못된 자동차 이름을 입력하면 alert이 호출되어야 한다.", () => {});

  it("다시 시작하기 버튼을 눌렀을 때 race-count-input-container 요소가 display none 이어야 한다.", () => {});
  ```

- 예) 👍🏼

  ```javascript
  it("잘못된 자동차 이름을 입력하면 에러 메시지를 확인할 수 있어야 한다.", () => {});

  it("다시 시작하기 버튼을 클릭하면 시도 횟수 입력 영역은 보이지 않아야 한다.", () => {});
  ```

- 테스트 코드를 작성하는 또 다른 목적!

  - 테스트 케이스가 잘 쓰여 있다면, 요구사항을 따로 보지 않고, 코드도 한 줄 한 줄 읽기 전이더라도 적어도 테스트 케이스에 있는 요구사항에 대해서는 어떻게 동작할 지에 대해 한눈에 파악할 수 있다.

- 우리 팀에 새로 들어온 개발자가 이 테스트 명세를 읽고 기능 요구사항을 파악할 수 있을지 고민이 필요하다.

### 세부 구현을 테스트하지 않는다

- display 속성으로 제어하지 않는 방식으로 코드를 변경한 경우
  - 예) 👎🏼
    ```javascript
    cy.get("selector").should("have.css", "display", "block");
    ```
  - 예) 👍🏼
    ```javascript
    cy.get("#car-name-input").should("be.exits");
    // <-> cy.get('#car-name-input').should('not.be.exits');
    ```
