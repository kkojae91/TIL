# 타입 스크립트 컨벤션과 readonly 속성

---

## interface / type

---

- 이름은 PascalCase를 사용한다.

- 멤버는 camelCase를 사용한다.

- I/T prefix를 사용하지 않는다.

### 나쁜 예

```ts
interface IFoo {
  Bar: string;
}

type TFoo = {
  Bar: string;
};
```

### 좋은 예

```ts
interface Foo {
  bar: string;
}

type Foo = {
  bar: string;
};
```

> 참고 자료: [ts-style-guide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md)

## readonly 속성

---

readonly 속성은 interface 객체를 처음 생성할 때만 값을 할당하고 그 이후에는 변경할 수 없는 속성을 의미한다.

문법

```ts
interface CraftBeer {
  readonly brand: string;
}
```

interface객체로 선언하고 해당 프로퍼티를 수정할 경우 error가 발생한다.

```ts
let myBeer: CraftBeer = {
  brand: "Belgian Monk",
};
myBeer.brand = "Korean Carpenter"; // error!
```

## readonly array

---

배열을 선언할 때 `ReadonlyArray<T>` 타입을 사용하면 읽기 전용 배열을 생성할 수 있다.

```ts
let arr: Readonly<number> = [1, 2, 3];
arr.splice(0, 1); // error
arr.push(4); // error
arr[0] = 100; // error
```

배열을 ReadonlyArray로 선언하면 배열의 내용을 변경할 수 없다.
선언하는 시점에만 값을 정의할 수 있으니 주의가 필요!

## class에서 readonly

---

클래스의 속성에 readonly 키워드를 사용하면 접근은 가능하지만 변경이 불가능하다.

```ts
class Developer {
  readonly name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}
let kkojae = new Developer("kkojae");
kkojae.name = "kkkkojae"; // error! name is readonly!
```

class 에서의 readonly는 단축해서 사용할 수 있다.

```ts
class Developer {
  constructor(readonly name: string) {}
}
let kkojae = new Developer("kkojae");
kkojae.name = "kkkkojae";
```
