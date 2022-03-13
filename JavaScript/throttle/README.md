# 스로틀 (throttle)

---

![](https://images.velog.io/images/kkojae91/post/48ade934-82fe-436d-a376-3269b05f8d59/js%E1%84%91%E1%85%AD%E1%84%8C%E1%85%B5-001.jpg)

---

우테코 미션(나만의 유튜브 강의실)을 하면서 마주하게된 무한 스크롤..
학습 키워드에 throttle(스로틀)이 있어 이번 미션 페어인 유세지와 함께 스로틀에 대해 알아보았다.

스로틀의 사전적 의미는 "목을 조르다" 라는 의미를 가지고 있다.
JavaScript에서 스로틀은 짧은 시간 간격으로 이벤트가 연속해서 발생하더라도 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되도록 만드는 것 이라고 한다.
즉, throttle은 이벤트를 일정한 주기마다 발생하도록 만드는 기술이라고 생각하면 좋을 것 같다.

모던 자바스크립트 DeepDive에서도 무한 스크롤을 구현하는 경우 스로틀을 유용하게 사용할 수 있다고 적혀있다.

## 예제 코드 분석

---

```js
const $container = document.querySelector(".container");
const $throttleCount = document.querySelector(".throttle-count");

let throttleCount = 0;

const throttle = (callback, delayTime) => {
  let timerId;

  return () => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback();
      timerId = null;
    }, delayTime);
  };
};

const throttleCallback = (event) => {
  $throttleCount.textContent = ++throttleCount;
};

$container.addEventListener("scroll", throttle(throttleCallback, 1000));
```

`$container`에 scroll 이벤트를 바인딩한 후 `throttle` 함수의 인자에 `throttleCallback`과 `delayTime인 1000`을 주고 호출해준다.

이때, `let timerId`와 `return문에 있는 익명함수`는 **클로저**이기 때문에, 외부에서 `timerId에` 접근할 수 없고, `throttle 함수`를 호출해서만 `timerId`에 접근할 수 있도록 작성되어 있다.

`return 문에 있는 익명함수`는 `timerId`가 있을 경우 함수를 즉시 종료하고, `timerId`가 없을 경우 `setTimeout` id를 `timerId`에 할당하고 `setTimeout`을 실행한다.

`setTimeout`은 `delayTime(1000ms)`을 호출 스케줄링한 후 콜스택에서 제거되고 `delayTime`이 지난 후 `setTimeout의 콜백함수`가 콜스택에 푸쉬되어 실행되게 된다.

이때, `throttleCallback`을 실행하고, `timerId`에는 `null`을 할당해서 `timerId`를 초기화 시켜준다.

즉, delayTime 만큼은 브라우저에 스크롤을 아무리 내려도 scroll 이벤트가 1번만 발생하게 되고, delayTime 이후에 다시 스크롤을 내릴 경우 scroll 이벤트가 발생하게 된다.

다시 살펴 보면 스로틀을 꼭 클로저를 활용하지 않고 전역변수, 맴버변수를 활용해 사용할 수 있다.
하지만 전역변수, 맴버변수로 사용하게 되면 오염의 위험성이 있고 변수의 스코프 범위가 넓어지기 때문에 **클로저를 활용해 스로틀을 구현해주는게 더 좋은 방법이라고 생각**한다.

## 일반 스크롤 이벤트와 스로틀을 활용한 스크롤 이벤트 호출 횟수 비교해보기

---

예제 코드의 delayTime을 수정해보면서 이벤트 호출 횟수를 조절해보시는 것도 좋을 것 같다.

!codepen[kkojae91/embed/WNdNMaj?default-tab=html%2Cresult]

<br />

> 참고 자료1: 우아한테크코스 교육 자료
> 참고 자료2: 모던 자바스크립트 DeepDive
