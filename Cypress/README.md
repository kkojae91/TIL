# Cypress 사용 방법

## Cypress 설치 및 기본 환경 세팅

```bash
npm install cypress
```

- package.json 파일에 script 테그 안에 넣기

  ```json
  "script": {
    "cypress:open": "cypress open", // GUI로 확인
    "cypress:run": "cypress run --browser chrome", // CLI로 확인
  }
  ```

  > 터미널로 실행할 경우 `npm run cypress:run`으로 실행

- 먼저 터미널에 `npm run cypress:open`을 입력한다.
- Cypress 폴더, cypress.json 파일 생성된다.

  - Cypress 폴더 안에 fixtures, integration, plugins, support 이외의 파일은 중요하지 않으니 삭제
  - 삭제된 폴더들은 비디오, 스냅샷 저장하는 공간
  - integration 파일안에 예제 \*.js파일들이 존재 프로젝트 진행할 경우 제거후 kkojae91.spec.js 파일 생성

- cypress.json 파일에 해당 옵션 추가
  ```json
  {
    "video": false,
    "screenshotOnRunFailure": false
  }
  ```
  > 위 옵션을 추가하면 테스트 코드가 돌아갈 때 비디오, 스냅샷이 저장되지 않는다. 필요하다면 true(default)값으로 변경

## Cypress 예시

- cypress 예시1)

  ```javascript
  // 자동차 이름은 5자 이하만 가능하다.
  // 행동 단위로 작성
  describe("기능테스트", () => {
    // before / after
    // beforeEach / afterEach
    // 반복되는 작업
    beforeEach(() => {
      cy.visit("index.html");
    });

    it("5자보다 긴 자동차 이름을 입력한 경우 / 에러 메세지를 확인할 수 있어야 한다.", () => {
      // Given - 주어진 상황, 환경 세팅
      const inputText = "코카콜라자동차,태태차";
      const alertStub = cy.stub(); // 가이드 문서 참고하기.. 얼럿이 잘 나오는지 확인하기 위해 사용

      cy.on("window:alert", alertStub);

      // When - behavior, 액션 동작
      cy.get("#car-name-input").type(inputText);
      cy.get("#car-name-submit")
        .click()
        .then(() => {
          // Then - 기대 결과
          expect(alertStub).to.be.called;
        });
    });

    it("5자보다 이름이 짧으면 정상적으로 자동차를 등록할 수 있다.", () => {
      // 블라블라
    });
  });
  ```

- cypress 예시2)

  ```javascript
  // alertStub이 중복으로 사용되서 함수로 분리 후 사용.
  function createAlertStub() {
    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    return alertStub;
  }

  // describe를 통해 section을 구분해줄 수 있다.
  describe("예외상황", () => {
    // 각각의 예외상황에 항상 먼저 필요한 것들을 beforeEach에 정의한다.
    beforeEach(() => {
      cy.visit("index.html");
    });

    it("자동차 이름이 5자보다 크면 alert를 보여준다.", () => {
      const inputString = "여섯글자이름";
      const alertStub = createAlertStub();

      cy.get(SELECTOR.$CAR_NAME_INPUT).type(inputString); // 해당 Selector에 input값이 들어간다. type(인풋값)으로 작성
      cy.get(SELECTOR.$CAR_NAME_BUTTON)
        .click()
        .then(() => {
          // expect(alertStub).to.be.called; 만 호출할 경우 alert이 띄워지는지만 확인할 수 있다.
          // calledWith(에러메세지)를 작성하면 에러메시지까지 테스트 한다.
          expect(alertStub).to.be.calledWith(
            ERROR_MESSAGE.OUT_OF_CAR_NAME_LENGTH_RANGE // error 메세지
          );
          cy.get(SELECTOR.$CAR_NAME_INPUT).should("have.value", ""); // 해당 Selector에 value 값이 '' 공백이여야 한다.
          cy.get(SELECTOR.$CAR_NAME_INPUT).should("have.focus"); // 해당 Selector에 focus가 가야 한다.
        });
    });

    it("자동차 이름이 공백으로 이루어지면 alert를 보여준다.", () => {
      const inputString = " ";
      const alertStub = createAlertStub();

      cy.get(SELECTOR.$CAR_NAME_INPUT).type(inputString);
      cy.get(SELECTOR.$CAR_NAME_BUTTON)
        .click() // then은 비동기 처리를 위함.. click후 동작하려면 잠깐의 시간이 필요하기 때문에 then을 사용한다.
        .then(() => {
          expect(alertStub).to.be.calledWith(
            ERROR_MESSAGE.OUT_OF_CAR_NAME_LENGTH_RANGE // error메세지
          );
          cy.get(SELECTOR.$CAR_NAME_INPUT).should("have.value", "");
          cy.get(SELECTOR.$CAR_NAME_INPUT).should("have.focus");
        });
    });
  });
  ```
