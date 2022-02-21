# 2단계 피드백 리마인드

## 1. HTML/CSS

### 웹 표준 지키기

- 웹 접근성에 대해서는 추가 학습이 필요하다.

- 태그의 사용 가이드 준수하기!
  - 모든 태그의 사용 가이드를 외우고 있긴 힘들다.. 그때 그때 찾아서 확인하고 학습하는 방법이 좋다.

> [\<section>, \<article>, \<div> 용도에 맞게 사용하기](https://kkojae.tistory.com/3)

## 1. Javascript

### DOM 구조에 의존하지 않기

- DOM 트리의 상대적인 위치에 따라 엘리먼트를 찾는건 위험하다.
  - 구조가 바뀌어 target의 parentElement가 바뀌었다면 코드를 새롭게 수정해야한다.
  - 예) 👎🏼
    ```javascript
    element.addEventListener("click", ({ target }) => {
      this.onSubmitCarName(getInputValue(target.parentElement));
    });
    ```
  - 예) 👍🏼
    ```javascript
    $(selector1).addEventListener("click", () => {
      this.onSubmitCarName(getInputValue($(selector2)));
    });
    ```

### 타입 문제 없는지 확인하기

- JS는 의도했던 타입이 맞는지 부터 검증해야 안전하게 개발할 수 있다.
- 타입을 포함해 조금 더 다양한 '잘못된 입력값'을 나눠보자
  - 숫자 타입을 받는 경우라도 문자열이나, -1과 같은 다양한 값들이 잘못 들어올 수 있다. 해당하는 에러 처리를 각각 해주는게 좋다.
  ```javascript
  if (racCountInput === "") {
    throw new Error(EMPTY_INPUT_ERROR);
  }
  ```

### 인스턴스마다 필요한 데이터가 맞는지 확인하기

- 필요없는 데이터를 습관처럼 가지고 있는건 아닌지 확인하여 **필요없는 데이터는 제거**해준다.

### 우선! 콜백함수를 사용하자!

- 예) 👎🏼

  ```javascript
  $("some-query").addEventListener("submit", () => {
    someFunc();
  });
  ```

- 예) 👍🏼

  ```javascript
  $("some-query").addEventListener("submit", someFunc);
  ```

- 👍🏼 처럼 작성하지 않는 경우 프로젝트가 커저 이벤트를 제거해야하는 상황에서 곤란할 수 있다. 이벤트를 바인드할 경우 특별한 경우가 아니라면 콜백함수를 사용하자!

### 내가 작성한 코드, 정확히 어떻게 동작하는지 이해하기

- setTimeout, setInterval은 브라우저에서 어떻게 동작하는지 이해해보기

> [Javascript로 sleep 함수 만들기](https://kkojae.tistory.com/2)

## 2. 클린 코드 연습

#### 일관성 지키기

- 상수 네이밍, 함수/변수 네이밍, 구현하는 방식 등에서 일관성을 유지한다.
- 일관성이 잘 지켜져있다면 개선할 때에도 일관되게 개선이 가능하다.

## 3. Testing

### DOM 구조에 의존하지 않기!!

### 시간을 지배하는 테스트!

#### cy.tick()

- cy.clock()을 통해 `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`, `Date` Objects 을 컨트롤 할 수 있다.
- cy.clock()은 tick(), restore() 메서드를 갖는다.

- cy.tick()을 사용하기 위해서는 cy.clock()이 먼저 호출되어야 한다.

  - cy.tick(milliseconds)는 첫 번째 인자로 밀리초를 지정할 수 있다.
  - cy.tick()은 cy.tick().then()을 통해 밀리초 시간이 지난 후의 확인해야할 사항을 callback 함수로 전달할 수 있다.

- cy.restore()는 재정의된 모든 네이티브 함수를 복원한다. 하지만, restore는 테스트 사이에 자동으로 호출되므로 일반적으로 필요하지 않다.

- 기본 문법

  ```javascript
  cy.clock();

  cy.tick(2000);
  ```

- cy.tick() 사용 예)

  ```javascript
  it("자동차 경주 게임을 정상적으로 완료하고 2초 뒤에 축하 메시지를 확인할 수 있다.", () => {
    // given
    const raceCount = 5;
    const delayPerRace = 1000;
    const delayAfterEnd = 2000;
    const totalDelay = delayPerRace * raceCount + delayAfterEnd;
    const alertStub = cy.stub();

    cy.on("window:alert", alertStub);

    // when
    // 이름 입력
    cy.get("#car-names-input").type("a,b");
    cy.get("#car-names-submit").click();

    // 카운트 입력
    cy.get("#racing-count-input").type(raceCount);
    cy.get("#racing-count-submit").click();
    cy.tick(totalDelay).then(() => {
      // then
      // 결과 확인
      expect(alertStub).to.be.called;
    });
  });
  ```

#### cy.wait()

- cy.wait()

  - cy.wait()은 다음 명령으로 이동하기 전에 지정된 밀리초 동안 기다리거나, aliased resource 가 resolve 될 때까지 기다린다.

- 기본 사용 문법

  ```javascript
  cy.wait(2000); // 2000ms 동안 대기
  ```

- cy.wait() 사용 예)

  ```javascript
  it("자동차 경주 게임이 종료되고, 경주의 우승자가 결정되면 2초 후에 축하의 메시지를 보여준다.", () => {
    const inputString = "꼬재";
    const racingCount = "3";
    const alertStub = createAlertStub();
    const totalDelayTime =
      racingCount * DELAY_TIME.RACING_PROGRESS + DELAY_TIME.WINNER_ALERT;

    cy.get(SELECTOR.$CAR_NAME_INPUT).type(inputString);
    cy.get(SELECTOR.$CAR_NAME_BUTTON).click();

    cy.get(SELECTOR.$RACING_COUNT_INPUT).type(racingCount);
    cy.get(SELECTOR.$RACING_COUNT_BUTTON).click();

    cy.wait(totalDelayTime).then(() => {
      expect(alertStub).to.be.calledWith("꼬재" + WINNER_MESSAGE.CELEBRATION);
    });
  });
  ```

해당 프로젝트에서 cy.tick()을 사용했을 경우에는 테스트 코드가 실패하고, cy.wait()을 사용했을 경우에는 테스트 코드가 성공한다...
명확한 이유에 대해서는 잘 모르겠다... 이 가려운 부분을 쉬원하게 긁어주실 수 있는 분이 계시면 좋을 것 같다..
