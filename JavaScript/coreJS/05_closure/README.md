# 05. 클로저(closure)

---

## 01. 클로저의 의미 및 원리 이해

---

MDN에서는 클로저에 대해 "A closure is the combination of a function and the lexical environment within which that function was declared." 라고 소개 되어있습니다.
<br />
직역한다면, "클로저는 함수와 그 함수가 선언될 당시의 lexical enviroment의 상호관계에 따른 현상" 입니다.
<br /><br />

조금 더 이해하기 쉽게 해석한다면,
<br />

**클로저란 어떤 함수 A에서 선언한 변수a를 참조하는 내부함수 B를 외부로 전달할 경우 A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상** 이라고 할 수 있습니다.
<br />

다음은 예제를 보면서 클로저에 대해 알아보도록 하자.

### 클로저가 아닌 예 (일상적인 상황)

---

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    console.log(++a);
  };
  inner();
};
outer();
```

<br />
위 예제에서는 outer 함수에서 변수 a를 선언했고, outer의 내부 함수인 inner 함수에서 a의 값을 1만큼 증가시킨 다음 출력한다. inner 함수 내부에서는 a를 선언하지 않았기 때문에 environmentRecord에서 값을 찾이 못하므로 outerEnvironmentReference에 지정된 상위 컨텍스트인 outer의 LexicalEnvironment에 접근해서 다시 a를 찾습니다.
<br />
a를 찾은 후에는 a의 값을 1만큼 증가시킨 2를 출력합니다. 이후 outer 함수의 실행 컨텍스트가 종료되면 LexicalEnvironment에 저장된 식별자들(a, inner)에 대한 참조를 지웁니다.
<br />
그러면 각 주소에 저장돼 있던 값들은 자신을 참조하는 변수가 하나도 없게 되므로 가비지 컬렉터의 수집 대상이 될 것 입니다.

위 예제의 실행 컨텍스트 도식화를 보도록 하겠습니다.
<br />
ThisBinding과 VariableEnvironment는 생략되어 있습니다.

<br />

<img src="./images/5.1.jpeg" />

<br /><br />

### 클로저 예

---

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
};
var outer2 = outer();
console.log(outer2()); // 2
console.log(outer2()); // 3
```

위 예제는 outer 함수 내부에서 inner 함수 자체를 반환하고 있습니다.
<br />
그러면 outer 함수의 실행 컨텍스트가 종료될 때 outer2 변수는 outer의 실행 결과인 inner 함수를 참조하게 된다. 이후 outer2를 호출하면 앞서 반환된 inner 함수가 실행됩니다.
<br /><br />

inner 함수의 enviromentRecord에는 수집할 정보가 없고, outerEnviromentReference에는 inner 함수가 선언된 위치의 LexicalEnviroment가 참조 복사된다. 즉, inner 함수는 outer 함수 내부에서 선언됐으므로, outer 함수의 LexicalEnviroment가 담기게 됩니다.
<br />
이제 스코프 체인에 따라 outer에서 선언한 변수 a에 접근해서 1만큼 증가 시킨후 그 값인 2를 반환하고 inner 함수의 실행컨텍스가 종료됩니다. 마지막번째 줄에서 다시 outer2를 호출하면 같은 방식으로 a의 값을 2에서 3으로 1 증가시킨 후 3을 반환하게 됩니다.
<br /><br />

inner 함수 실행 시점에는 outer 함수는 이미 콜스택에서 제거된 상태인데 어떻게 outer 함수의 LexicalEnvironment에 어떻게 접근하는 것일까?
<br />
가비지 컬렉터는 어떤 값을 참조하는 변수가 하나라도 있다면 그 값을 수집 대상에 포함하지 않기 때문에 위와 같이 동작할 수 있는 것입니다.
<br />
다시말해, outer 함수는 실행 종료 시점에 inner 함수를 반환합ㄴ디ㅏ. 외부 함수인 outer의 실행이 종료되었더라도 내부 함수인 inner 함수는 언젠가 outer2를 실행함으로써 호출될 가능성이 열리는 것입니다.
<br />
언젠가 inner 함수의 실행 컨텍스트가 활성화되면 outerEnviromentReference가 outer 함수의 LexicalEnvironment를 필요로 할 것이기 때문에 가비지 컬렉터의 수집대상이 되지 않고 inner 함수가 a 변수에 접근할 수 있게 되는 것입니다.
<br /><br />

<img src='./images/5.2.jpeg' />

<br />

위 이미지는 클로저가 발생할 시 콜스택 흐름을 나타낸 도식화 입니다.

<br /><br />

### Return문이 없는 클로저 예

---

클로저는 반드시 return이 필요한 것은 아닙니다.

```javascript
// setInterval, setTimeout
(function () {
  var a = 0;
  var intervalId = null;
  var inner = function () {
    if (++a >= 10) {
      clearInterval(intervalId);
    }
    console.log(a);
  };

  intervalId = setInterval(inner, 1000);
})();
```

<br />

위 예제는 별도의 외부객체인 window의 메서드(setTimeout, setInterval)에 전달할 콜백 함수 내부의 지역변수를 참조합니다.
<br />

그렇게 때문에 inner 함수는 클로저 입니다.

<br /><br />

```javascript
// eventListener
(function () {
  var count = 0;
  var button = document.querySelector("button");
  button.innerText = "click";
  button.addEventListener("click", function () {
    console.log(++count, "times clicked");
  });
  document.body.appendChild(button);
});
```

<br />

위 예제는 별도의 외부 객체인 DOM의 메서드 addEventListener에 등록할 handler 함수 내부에서 지역변수를 참조합니다.
<br />

따라서 handler 내부함수는 클로저가 됩니다.

<br /><br />

## 02. 클로저와 메모리 관리

---

클로저는 어떤 필요에 의해 의도적으로 함수의 지역변수를 메모리를 소모하도록 함으로써 발생합니다. 그렇다면 그 필요성이 사라진 시점에는 더는 메모리를 소모하지 않게 해주면 메모리를 효율적으로 관리할 수 있습니다.
<br />

### return 에 의한 클로저의 메모리 해제

---

```javascript
var outer = (function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
})();
console.log(outer()); // 2
console.log(outer()); // 3
outer = null; // outer 식별자의 inner 함수 참조를 끊는다.
```

<br />

### setInterval에 의한 클로저의 메모리 해제

---

```javascript
(function () {
  var a = 0;
  var intervalId = null;
  var inner = function () {
    if (++a > 10) {
      clearInterval(intervalId);
      inner = null; // inner 식별자의 함수 참조를 끊음
    }
    console.log(a);
  };
  interval = setInterval(inner, 1000);
});
```

<br />

### eventListener에 의한 클로저의 메모리 해제

---

```javascript
(function () {
  var count = 0;
  var button = document.createElement("button");
  button.innerText = "click";

  var clickHandler = function () {
    console.log(++count, "times clicked");
    if (count >= 10) {
      button.removeEventListener("click", clickHandler);
      clickHandler = null; // clickHandler 식별자의 함수 참조를 끊음
    }
  };
  button.addEventListener("click", clickHandler);
  document.body.appendChild(button);
});
```

<br /><br />

## 03. 클로저 활용 사례

---

### 5-3-1 콜백 함수 내부에서 외부 데이터를 사용하고자 할 때

---

#### 자바스크립트의 대표적인 콜백함수인 이벤트 리스너에 관한 예시

---

```javascript
var fruits = ["apple", "banana", "peach"];
var $ul = document.createElement("ul");

fruits.forEach(function (fruit) {
  var $li = document.createElement("li");
  $li.innerText = fruit;

  $li.addEventListener("click", function () {
    alert(`your choice is ${fruit}`);
  });

  $ul.appendChild($li);
});

document.body.appendChild($ul);
```

- forEach문 안의 익명의 콜백함수(이후 forEach 콜백함수라 작성) 내부에서 참조하는 외부 변수가 존재하지 않기 때문에 클로저가 아닙니다.

- addEventListener 안의 익명의 콜백함수(이후 이벤트 콜백함수라 작성) 내부에서는 외부 변수 fruit을 참조하고 있기 때문에 클로저 입니다.

forEach 콜백함수는 fruits의 개수만큼 실행되며, 그때마다 새로운 실행 컨텍스트가 활성화 됩니다.

forEach 콜백함수의 실행 종료 여부와는 무관하게 클릭 이벤트에 의해 각 컨텍스트의 이벤트 콜백함수가 실행될 때는 이벤트 콜백함수의 outerEnvironmentReference가 forEach 콜백함수의 LexicalEnvironment를 참조하게 됩니다.

따라서 최소한 이벤트 콜백함수가 참조할 예정인 변수 fruit에 대해서는 forEach 콜백함수가 종료된 후에도 가비지 컬렉터의 대상에서 제외되어 계속 참조가 가능해집니다.

#### 이벤트 콜백함수의 분리

---

```javascript
var alertFruits = function (fruit) {
  alert(`your choice is ${fruit}`);
};

fruits.forEach(function (fruit) {
  var $li = document.createElement("li");
  $li.innerText = fruit;

  $li.addEventListener("click", alertFruits.bind(null, fruit));
  $ul.appendChild($li);
});

document.body.appendChild($ul);
```

이전 예제에서 이벤트 콜백함수가 반복적으로 생성되는 것을 방지하기 위해 이벤트 콜백함수를 공통 함수 alertFruits로 분리 후 bind 첫번째 인자는 null, 두 번째 인자는 fruit을 넘겨주었습니다.

bind를 하지 않고 alertFruits만 넘겨줄 경우 alertFruits의 인자인 fruit에는 event 객체가 담겨 있게 됩니다.

하지만 여기에서 문제는 이벤트 객체가 인자로 넘어오는 순서가 바뀌는 점 및 함수 내부에서의 this가 달라지는 상황을 감안해야합니다.

여기서 고차함수를 활용하면 위 문제를 해결할 수 있다.

#### 고차 함수로 분리

---

```javascript
var fruits = ["a", "b", "c"];

var alertFruitBuilder = function (fruit) {
  return function () {
    alert(`your choice is ${fruit}`);
  };
};

fruits.forEach(function (fruit) {
  var $li = document.createElement("li");
  $li.innerText = fruit;

  $li.addEventListener("click", alertFruitBuilder(fruit));
  $ul.appendChild($li);
});

document.body.appendChild($ul);
```

alertFruitBuilder 함수는 내부에서 다시 익명함수를 return 하는데 이 익명함수가 기존의 alertFruit 함수입니다.

이렇게 고차함수로 작성하게 되면 bind의 문제점을 해결할 수 있고 클로저를 통해 fruit의 변수도 outerEnvironmentReference에 의해 참조할 수 있게 됩니다. 즉 alertFruitBuilder의 실행 결과로 반환된 함수에는 클로저가 존재합니다.

<br /><br />

### 5-3-2 접근 권한 제어(정보 은닉)

---

정보 은닉(information hiding)은 어떤 모듈의 내부 로직에 대해 외부로의 노출을 최소화해서 모듈간의 결합도를 낮추고 유연성을 높이고자 하는 현대 프로그래밍 언어의 중요한 개념 중 하나다.

다른 언어에서 자주 사용되는 접근 권한을 제어하는 키워드

- public : 외부에서 접근 가능
- private : 외부에서 접근 불가능(상속 받은 객체에서도 접근 불가능)
- protected : 외부에서 접근 불가능(상속 받은 객체에서는 접근 가능)

#### 자동차 경주 게임으로 접근 권한을 제어해 보자

규칙

1. 각 턴마다 주사위를 굴려 나온 숫자(km)만큼 이동한다.
2. 차량별로 연료량(fuel)과 연비(power)는 무작위로 생성된다.
3. 남은 연료가 이동할 거리에 필요한 연료보다 부족하면 이동하지 못한다.
4. 모든 유저가 이동할 수 없는 턴에 게임이 종료된다.
5. 게임 종료 시점에 가장 멀리 이동해 있는 사람이 승리한다.

```javascript
var car = {
  fuel: Math.ceil(Math.random() * 10 + 10),
  power: Math.ceil(Math.random() * 3 + 2),
  moved: 0,
  run: function () {
    var km = Math.ceil(Math.random() * 6);
    var wasteFuel = km / this.power;
    if (this.fuel < wasteFuel) {
      console.log("이동불가");
      return;
    }

    this.fuel -= wasteFuel;
    this.moved += km;
    console.log(`${km}km이동 (총 ${this.moved}km`);
  },
};
```

하지만 이렇게 객체를 생성하게 되었을 경우 게임 참가자가 정해진 연료, 연비, 이동거리를 조작할 수 있다.

```javascript
car.fuel = 1000;
car.power = 100;
car.moved = 1000;
```

이렇게 값을 변경하지 못하도록 막기 위해 사용하는 방법이 클로저 입니다.

#### 자동차 경주 게임 클로저 활용

```javascript

```

### 5-3-3 부분 적용 함수

---

부분 적용 함수(partial applied function)란?

- n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억시켰다가, 나중에 (n - m)개의 인자를 넘기면 비로소 원래 함수의 실행 결과를 얻을 수 있게끔 하는 함수이다.

```js
var partial = function () {
  var originalPartialArgs = arguments;
  var func = originalPartialArgs[0];

  if (typeof func !== "function") {
    throw new Error("첫 번째 인자가 함수가 아닙니다.");
  }

  return function () {
    var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1);
    var restArgs = Array.prototype.slice.call(arguments);

    return func.apply(this, partialArgs.concat(restArgs));
  };
};

var add = function () {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }

  return result;
};

var addPartial = partial(add, 1, 2, 3, 4, 5);
console.log(addPartial(6, 7, 8, 9, 10));

var dog = {
  name: "강아지",
  greet: partial(function (prefix, suffix) {
    return prefix + this.name + suffix;
  }, "왈왈, "),
};

console.log(dog.greet("입니다."));
```

```js
Object.defineProperty(window, "_", {
  value: "EMPTY_SPACE",
  writable: false,
  configurable: false,
  enumerable: false,
});

var partial2 = function () {
  var originalPartialArgs = arguments;
  var func = originalPartialArgs[0];
  if (typeof func !== "function") {
    throw new Error("첫 번째 인자가 함수가 아닙니다.");
  }

  return function () {
    var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1);
    var restArgs = Array.prototype.slice.call(arguments);
    for (var i = 0; i < partialArgs.length; i++) {
      if (partialArgs[i] === _) {
        partialArgs[i] = restArgs.shift();
      }
    }

    return func.apply(this, partialArgs.concat(restArgs));
  };
};

var add = function () {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }

  return result;
};

var addPartial = partial2(add, 1, 2, _, 4, 5, _, _, 8, 9);
console.log(addPartial(3, 6, 7, 10));

var dog = {
  name: "강아지",
  greet: partial2(function (prefix, suffix) {
    return prefix + this.name + suffix;
  }, "왈왈, "),
};

console.log(dog.greet(" 배고파요!"));
```

#### 디바운스(debounce)

디바운스란?

- 짧은 시간 동안 동일한 이벤트가 많이 발생할 경우 이를 전부 처리하지 않고 처음 또는 마지막에 발생한 이벤트에 대해 한 번만 처리하는 것
- 프론트엔드 성능 최적화에 큰 도움을 주는 기능 중 하나이다.
- scroll, wheel, mousemove, resize 등에 적용하기 좋다.

```js
var debounce = function (eventName, func, wait) {
  var timeoutId = null;

  return function (event) {
    var self = this;
    console.log(eventName, "event 발생");
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func.bind(self, event), wait);
  };
};

var moveHandler = function (e) {
  console.log("move event 처리");
};

var wheelHandler = function (e) {
  console.log("wheel event 처리");
};

document.body.addEventListener("mousemove", debounce("move", moveHandler, 500));
document.body.addEventListener(
  "mousewheel",
  debounce("wheel", wheelHandler, 500)
);
```

### 5-3-4 커링 함수

---

커링 함수(curring function)란?

- 여러개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게 체인 형태로 구성한 것을 말한다.
- 커링 함수와 부분적용 함수의 다른점은 커링 함수는 한 번에 하나의 인자만 전달하는 것을 원칙으로 한다.
- 또한, 중간 과정상의 함수를 실행한 결과는 그 다음 인자를 받기 위해 대기만 할 뿐으로, 마지막 인자가 전달되기 전까지는 원본 함수가 실행되지 않는다.
- 화살표 함수를 사용하면 축약하여 표현할 수 있고 함수 표현식보다 읽기 좋다.

## 일반 함수 표현식을 사용한 커링 함수

```js
var curry3 = function (func) {
  return function (a) {
    return function (b) {
      return func(a, b);
    };
  };
};

var getMaxWith10 = curry3(Math.max)(10);
console.log(getMaxWith10(8)); // 10
console.log(getMaxWith10(25)); // 25
```

#### 화살표 함수를 사용한 커링 함수

```js
var curry3 = (fun) => (a) => (b) => func(a, b);
var getMaxWith10 = curry3(Math.max)(10);
console.log(getMaxWith10(8)); // 10
console.log(getMaxWith10(25)); // 25
```

#### fetch 함수 예제

```js
var getInformation = function (baseUrl) {
  return function (path) {
    return fetch(baseUrl + path + "/" + id);
  };
};

var getInformationES6 = (baseUrl) => (path) => (id) =>
  fetch(baseUrl + path + "/" + id);
```

보통 REST API를 이용할 경우 baseUrl은 몇 개로 고정되지만 나머지 path나 id 값은 매우 많을 수 있다.
<br />
이런 상황에서 서버에 정보를 요청할 필요가 있을 때마다 매번 baseUrl 부터 전부 기입해주기보다는 공통적인 요소는 먼저 기억시켜두고 특정한 값(id)만으로 서버 요청을 수행하는 함수를 만들어 두는 편이 개발 효율성이나 가독성 측면에서 좋을 수 있다.

#### redux middleware 예제

```js
const logger = (store) => (next) => (action) => {
  console.log("dispatching", action);
  console.log("next state", store.getState());
  return next(action);
};

const thunk = (store) => (next) => (action) => {
  return typeof action === "function"
    ? action(dispatch, store.getState)
    : next(action);
};
```

위 두 미들웨어는 공통적으로 store, next, action 순으로 인자를 받는다.
<br/>
이 중 store는 프로젝트 내에서 한 번 생성된 이후로는 바뀌지 않는 속성이고 dispatch의 의미를 가지는 next 역시 마찬가지지만, action의 경우는 매번 달라진다.
<br/>
그러니까 store와 next 값이 결정되면 Redux 내부에서 logger 또는 thunk에 store, next를 미리 넘겨서 반환된 함수를 저장시켜놓고, 이후에는 action만 받아서 처리할 수 있게끔 한 것이다.
