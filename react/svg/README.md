# react에서 svg 사용하기

---

## svg vs png

---

react에서 svg를 사용하는 법을 확인하기에 앞서, svg와 png의 차이점에 대해서 간략하게 설명해보려 한다.

### svg

이미지를 svg로 사용하게 되면 좋은 점은 아래와 같다.

1. 모든 크기의 브라우저를 원할하게 지원한다. (무한한 확장 가능)
2. svg의 일부를 스타일링 할 수 있다. (색상, 크기 변경 등)
3. dom을 사용하여 svg를 실시간으로 수정할 수 있다.
4. png보다 용량이 적어 출력이 png보다 빠르다.

### png

백그라운드 이미지와 같이 이미지를 백터화하기 어려운 경우는 svg가 가지고 있는 장점을 활용할 수 없기 때문에 png를 그대로 사용하면 된다.

## react에서 svg 사용하기

---

이 부분은 CRA로 프로젝트를 생성했을 경우만 정리를 하려 한다...!
아직 CRA가 아닌 프로젝트를 해본적이 없기에.. 다른 블로그들을 보면 webpack에 설정을 추가로 해줘야 사용이 가능하다고 하네요..!

### 일반적으로 svg 파일을 import 해서 사용하는 경우

```jsx
import cartIcon from "../../assets/image/cart.svg";

<img src={cartIcon} />;
```

위와 같이 사용하게 된다면, 동적으로 요소의 크기, 색상을 변경해줄 수 없다.
따라서 svg를 사용했을 때의 장점을 살리기 어렵다..!!!

하얀색 카트 아이콘, width가 100px인 카트 아이콘, 초록색 카트 아이콘을 사용하려면 해당하는 값들을 변경 후 각각의 svg를 만든 후 사용해야한다...!

```jsx
import whiteCartIcon from "../../assets/image/whiteCart.svg";
import width100pxCartIcon from "../../assets/image/width100pxCart.svg";
import greenCartIcon from "../../assets/image/greenCart.svg";

<img src={cartIcon} />;
<img src={width100pxCartIcon} />;
<img src={greenCartIcon} />;
```

### 조금 더 세련된 방법...?! 을 사용하는 경우

우선 svg를 custom 하고 싶을 속성값을 current로 변경해준다!!

```js
// cart.svg
<svg
  width="current"
  height="current"
  viewBox="0 0 51 44"
  fill="current"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="..." fill="current" />
</svg>
```

위와 같이 current로 설정한 값은 아래 코드 조각의 cartIcon의 props로 값을 내려주면 해당하는 값으로 변경된 svg icon을 얻을 수 있기 때문에,
하나의 svg 파일로 다양한 cartIcon을 만들어 사용할 수 있게 된다!

```jsx
// 사용할 곳..!!
import { ReactComponent as cartIcon } from "../../assets/image/cart.svg";

const Header = () => {
  return (
    <S.Header>
      {/** ... */}
      <cartIcon width="100px" fill="white" />
      <cartIcon width="200px" fill="white" />
      <cartIcon width="100px" fill="green" />
      {/** ... */}
    </S.Header>
  );
};
```

끗
