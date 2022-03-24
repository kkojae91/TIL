# What is this?

---

우테코 피드백 수업중 깜짝 퀴즈가 있었는데.. this 관련된 문제를 접하게 되었다.

나는 분명 this가 바인딩 되는 방식을 이해하고 있다고 생각했지만, 순간 지나가는 퀴즈에서는 this의 바인딩을 찾는 것을 헷갈렸고, 피드백 수업이 끝나고 나서도, 혼란스러웠다...

this 바인딩에 대해 간단히 정리하며 복습해보았다.

<br />

## 1. 전역 공간에서의 this

---

전역 공간에서 this는 전역 객체를 가리킨다.
개념상 전역 컨텍스트를 생성하는 주체가 바로 전역 객체이기 때문이다.
브라우저 환경에서는 window, Node.js 환경에서는 global을 가리킨다.

<br />

## 2. 메서드로서 호출할 때 그 메서드 내부에서의 this

---

메서드 내부에서의 this는 호출한 주체에 대한 정보가 담긴다.

어떤 함수를 메서드로서 호출하는 경우 호출 주체는 바로 함수명(프로퍼티명) 앞의 객체다.
점 표기법의 경우 마지막 점 앞에 명시된 객체를 this가 가리킨다.

<br />

## 3. 함수로서 호출할 때 그 함수 내부에서의 this

---

어떤 함수를 함수로서 호출할 경우에는 this가 지정되지 않는다.
즉, 함수로서 호출하는 경우 this는 전역객체를 가리킨다.

<br />

### 퀴즈

---

```javascript
const obj1 = {
  outer() {
    console.log(this);
    const innerFunc = function () {
      console.log(this);
    };

    innerFunc(); // (1)

    const obj2 = {
      innerMethod: innerFunc,
    };

    obj2.innerMethod(); // (2)
  },
};

obj1.outer(); // (3)
```

(1), (2), (3)의 호출된 결과는?

- (1): window (전역 객체를 가리킨다)
- (2): obj2 (점표기법 앞에 있는 객체를 가리킨다)
- (3): obj1 (점표기법 앞에 있는 객체를 가리킨다)

<br />

## 4. this를 바인딩하지 않는 함수

---

ES6에서는 함수 내부에서 this가 전역 객체를 가리키는 문제를 보완하고자, this 바인딩하지 않는 화살표 함수를 새로 도입했다.
화살표 함수는 실행 컨텍스트를 생성할 때 this 바인딩 과정 자체가 빠지게 되어, 상위 스코프의 this를 그대로 활용할 수 있다.

<br />

### 퀴즈

---

```javascript
const obj1 = {
  outer() {
    console.log(this);
    const innerFunc = () => {
      console.log(this);
    };

    innerFunc(); // (1)

    const obj2 = {
      innerMethod: innerFunc,
    };

    obj2.innerMethod(); // (2)
  },
};

obj1.outer(); // (3)
```

(1), (2), (3)의 호출된 결과는?

- (1): obj1 (화살표 함수는 내부에 this 바인딩이 되어 있지 않아 상위 스코프의 this를 가리킨다)
- (2): obj2 (점표기법 앞에 있는 객체를 가리킨다)
- (3): obj1 (점표기법 앞에 있는 객체를 가리킨다)

<br />

## 5. 콜백 함수 호출시 그 함수 내부에서의 this

---

### 5-1. 일반 함수를 콜백 함수로 호출할 경우

---

```javascript
setTimeout(function () {
  console.log(this); // (1)
}, 300);

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this, x); // (2)
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector("#a").addEventListener("click", function (e) {
  console.log(this, e); // (3)
});
```

- (1), (2): setTimeout, forEach는 메서드 그 내부에서 함수를 호출할 때 대상이 될 this를 가리키지 않는다. 즉 window 객체를 가리키게 된다.
- (3): addEventListener는 콜백 함수를 내부에서 호출할 때 자신의 this를 상속하게 정의되어 있다.

<br />

### 5-2. 화살표 함수를 콜백함수로 호출할 경우

---

```javascript
setTimeout(() => {
  console.log(this); // (1)
}, 300);

[1, 2, 3, 4, 5].forEach((x) => {
  console.log(this, x); // (2)
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector("#a").addEventListener("click", (e) => {
  console.log(this, e); // (3)
});
```

- (1),(2),(3): 화살표 함수는 this를 바인딩 하지않는다. 즉, this는 상위 스코프인 window를 가리킨다.

<br />

## 6. 생성자 함수 내부에서의 this

---

생성자 함수로서 호출된 경우 내부에서의 this는 곧 새로 만들 구체적인 인스턴스 자신이 됩니다.

```javascript
function Cat(name, age) {
  this.bark = "야옹";
  this.name = name;
  this.age = age;
}

const choco = new Cat("초코", 7);
const nabi = new Cat("나비", 5);
console.log(choco); // Cat {bark: '야옹', name: '초코', age: 7}
console.log(nabi); // Cat {bark: '야옹', name: '나비', age: 5}
```

<br />

## 7. 명시적으로 this를 바인딩하는 방법

---

### 7-1. apply / call 메서드

---

apply와 call 메서드는 메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령이다.
이때 apply와 call 메서드의 첫 번째 인자를 this로 바인딩한다.

apply와 call메서드의 차이점은

- apply는 두 번째 인자를 배열로 받아 그 배열의 요소들을 호출할 함수의 매개변수로 전달한다.
- call은 첫 번째 인자 이후의 인자들을 호출할 함수의 매개변수로 전달한다.

```javascript
function func(a, b, c) {
  console.log(this, a, b, c);
}

func(1, 2, 3); // window{}, 1, 2, 3
func.call({ x: 1 }, 1, 2, 3); // {x: 1}, 1, 2, 3
func.apply({ x: 1 }, [1, 2, 3]); // {x: 1}, 1, 2, 3
```

<br />

### 7-2. bind 메서드

---

bind 메서드는 ES5에서 추가된 기능으로, call과 비슷하지만 즉시 호출하지 않고 넘겨받은 this 및 인수들을 바탕으로 새로운 함수를 반환하기만 하는 메서드입니다.

```javascript
function func(a, b, c) {
  console.log(this, a, b, c);
}

func(1, 2, 3); // window{}, 1, 2, 3
const bindFunc = func.bind({ x: 1 });
bindFunc(1, 2, 3);
```

<br /><br />

> 참고 자료: 코어 자바스크립트
