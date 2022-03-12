# STEP2. 꼬재 담당 크루 PR 링크

---

- [#132꼬재](https://github.com/woowacourse/javascript-lotto/pull/132)
- [#138도리](https://github.com/woowacourse/javascript-lotto/pull/138)
- [#145후이](https://github.com/woowacourse/javascript-lotto/pull/145)
- [#144콤피](https://github.com/woowacourse/javascript-lotto/pull/144)
- [#124나인](https://github.com/woowacourse/javascript-lotto/pull/124)
- [#128비녀](https://github.com/woowacourse/javascript-lotto/pull/128)
- [#164코이](https://github.com/woowacourse/javascript-lotto/pull/134)

## 아키텍쳐 분석

---

<br />

### #132꼬재

---

#### LottoConsumer

로또 구매자 티켓 관련 담당

#### LottoSeller

로또 판매자 티켓 관련 담당

#### LottoApp

이벤트 바인딩 담당

<br/>

LottoApp이 무거워 보여 리뷰어님에게 구조관련 디벨롭은 어떻게 하는게 좋을지 질문

- 리뷰어님 기준 LottoApp이 무겁지 않다고 말씀해주셨다. 굳이 해야겠다면, 파일 분리가 있다고 했지만 진행하지는 못했음.

<br />

### #138도리

---

#### Lotto

로또 티켓 한 장을 생성하는 객체

#### PurchasedLotto

구매한 전체 로또를 저장하고 있음

#### LottoApp

이벤트 바인딩과 전체적인 프로그램 로직을 담당

#### view 폴더

view에 해당하는 로직과 dom 요소, templates들을 분리하여 관리

<br />

### 후이, 나인, 비녀, 코이, 콤피

---

#### model

나인, 비녀 : 로또 한 장의 객체 / 유저가 구매한 로또들, 당첨 번호를 관리하는 객체
코이 : 유저가 구매한 로또들, 당첨 번호를 관리하는 객체
후이 : 로또 한 장의 객체 / 당첨 로또 한 장의 객체 / 유저가 구매한 로또를 관리하는 객체 / 유저가 구매한 로또의 당첨 결과를 관리하는 객체

후이)
js에서는 지원하지 않는 protected 사용 \_(언더바를 이용)

상속을 통해 로또 한장의 객체와 당첨 로또 한 장의 객체에서 overriding해서 사용해 중복된 코드 제거

```js
export default class Lotto {
  // _는 protected 입니다.
  _lottoNumbers = [];

  generate() {
    const { MAX_RANDOM_NUMBER: MAX, MIN_RANDOM_NUMBER: MIN } = LOTTO_SETTING;
    const shuffledList = shuffle(
      [...Array(MAX - MIN + 1)].map((_, idx) => idx + MIN)
    );
    this._lottoNumbers = shuffledList.slice(
      0,
      LOTTO_SETTING.LOTTO_NUMBER_LENGTH
    );

    return this;
  }
}
```

```js
export default class WinningLotto extends Lotto {
  generate(winningNumbers, bonusNumber) {
    try {
      checkValidWinningNumberInput(winningNumbers, bonusNumber);

      this._lottoNumbers = [...winningNumbers];
      this.#bonusNumber = bonusNumber;

      return this;
    } catch (error) {
      throw new Error(error);
    }
  }
}
```

#### controller

전체적인 프로그램 로직을 담당

- 이벤트 바인딩
- validate

#### views 폴더

각각의 view 별로 파일을 나눠 view를 관리

#### utils

document에서 돔요소를 찾는 경우와 부모 엘리먼트에서 돔 요소를 찾을 수 있게 자동화 시킨 부분이 인상 깊어 코드를 가져왔습니다.

```js
export const $ = (parentElement, childSelector = null) => {
  const target = childSelector || parentElement;
  const $parent = childSelector
    ? parentElement
    : document.getElementById(SELECTOR.ID.APP);

  return $parent.querySelector(target);
};

export const $$ = (parentElement, childSelector = null) => {
  const target = childSelector || parentElement;
  const $parent = childSelector
    ? parentElement
    : document.getElementById(SELECTOR.ID.APP);

  return $parent.querySelectorAll(target);
};
```

<br />

에러 메시지를 관리할 때 줄 바꿈을 활용하는 부분이 인상 깊어 코드를 가지고 왔습니다.

```js
export const ERROR_MESSAGE = {
  NEGATIVE_INPUT_ERROR:
    "양수를 입력해 주세요! \n (please enter positive number)",
  NOT_INTEGER_INPUT_ERROR:
    "정수를 입력해 주세요! \n (please enter integer number)",
  NOT_MUTIPLE_THOUSAND:
    "1000단위로 입력해 주세요! \n (please enter number that is mutiples of thousand)",
};
```
