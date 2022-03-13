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

### 예제 코드를 한 줄 한 줄 뜯어보자!

#### 1. 예제를 위해 필요한 돔요소를 불러와주고, throttleCount를 0으로 초기화 해준다.

```js
const $container = document.querySelector(".container");
const $throttleCount = document.querySelector(".throttle-count");

let throttleCount = 0;
```

#### 2. 다음 throttle 함수는 callback함수와 delayTime을 인자로 받고 timerId를 선언해준 후 콜백 함수를 리턴 해준다.

```js
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
```

#### 3. return 되는 콜백함수에서는 timerId가 존재하는 경우 함수를 바로 종료 시켜주고, timerId가 없을 경우 timerId에 setTimeout id를 저장해주고, setTimeout을 실행한다.

```js
return () => {
  if (timerId) return;

  timerId = setTimeout(() => {
    callback();
    timerId = null;
  }, delayTime);
};
```

#### 4. setTimeout은 delayTime을 호출 스케줄링한 후 실행을 종료하고, delayTime이 지난 후, setTimeout의 콜백 함수가 실행되는데, 인자로 받은 callback 함수를 호출해주고, timerId에는 null을 할당해주고 콜백함수를 종료한다.

```js
timerId = setTimeout(() => {
  callback();
  timerId = null;
}, delayTime);
```

#### 5. 다음은 throttle 함수에 첫 번째 인자인 throttleCallback 함수이다. 이 함수에서는 $throttleCount 요소에 throttleCount를 1증가 시킨 후 종료된다.

```js
const throttleCallback = (event) => {
  $throttleCount.textContent = ++throttleCount;
};
```

#### 6. 마지막으로 $container 요소에서 scroll 이벤트를 걸어주고, 두번째 인자에 throttle이 반환한 함수를 등록해준다.

```js
$container.addEventListener("scroll", throttle(throttleCallback, 1000));
```

즉, delayTime 만큼은 브라우저에 스크롤을 아무리 내려도 scroll 이벤트가 1번만 발생하게 되고, delayTime 이후에 다시 스크롤을 내릴 경우 scroll 이벤트가 발생하게 된다.

다시 살펴 보면 throttle 함수 안의 timerId를 클로저를 활용하지 않고 전역변수, 맴버변수를 활용해 사용할 수 있다.
하지만 timerId를 전역변수, 맴버변수로 사용하게 되면 오염의 위험성이 있고 변수의 스코프 범위가 넓어지기 때문에 **클로저를 활용해 스로틀을 구현해주는게 더 좋은 방법이라고 생각**한다.

## 일반 스크롤 이벤트와 스로틀을 활용한 스크롤 이벤트 호출 횟수 비교해보기

---

예제 코드의 delayTime을 수정해보면서 이벤트 호출 횟수를 조절해보시는 것도 좋을 것 같다.

!codepen[kkojae91/embed/WNdNMaj?default-tab=html%2Cresult]

<br />

> 참고 자료1: 우아한테크코스 교육 자료
> 참고 자료2: 모던 자바스크립트 DeepDive
