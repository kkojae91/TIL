# contextAPI

---

## 1. React.createContext

---

Context 객체를 생성하는 방법은 아래와 같다.

```jsx
const MyContext = React.createContext(defaultValue);
```

defaultValue에는 실제 Provider의 value에 넣는 객체의 형태와 일치시켜주는 게 좋다.

- Context 코드를 볼 때 내부 값이 어떻게 구성되어있는지 파악하기 쉽고, 실수로 Provider를 사용하지 않았을 때 리액트에서 에러가 발생하지 않는다.

createContext 메서드의 매개 변수 defaultValue는 트리 안에서 적절한 Provider를 찾지 못할때만 사용하는 값이다.

- Provider를 사용하지 않은 경우 defaultValue를 통해 Consumer에서 props로 사용할 수 있다.

#### defaultValue는 컴포넌트를 독립적으로 테스트 할 때 유용한 값이다.

<br />

## 2. Context.Provider

---

Context 객체에 포함된 React 컴포넌트인 Provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 한다.

```jsx
<MyContext.Provider value={/* 어떤 값 */}>
```

Provider를 사용할 때는 반드시 value를 명시해줘야 한다.

Provider 컴포넌트는 value prop을 받아서 이 값을 하위에 있는 컴포넌트에게 전달한다.

값을 전달 받을 수 있는 컴포넌트의 수에 제한이 없다.

Provider 하위에 또 다른 Provider를 배치하는 것도 가능하다. (이러한 경우 하위 Provider가 우선순위를 갖는다.)

Provider 하위에서 context를 구독하는 모든 컴포넌트는 Provider의 value prop이 바뀔 때마다 다시 렌더링 된다.

Provider로부터 하위 consumer로의 전파는 shouldComponentUpdate 메서드가 적용되지 않으므로, 상위 컴포넌트가 업데이트를 건너 뛰더라도 consumer가 업데이트 된다.

## Context.consumer

---

context변화를 구독하는 React 컴포넌트이다.

이 컴포넌트를 사용하면 함수 컴포넌트 안에서 context를 구독할 수 있다.

```jsx
<MyContext.Consumer>
  {value => /* context 값을 이용한 렌더링 */}
</MyContext.Consumer>
```

Context.Consumer의 자식은 함수이어야 한다.

Consumer의 함수는 context의 현재값을 받고 React 노드를 반환한다.

Consumer의 함수가 받는 value 매개변수 값은 해당 context의 Provider 중 상위 트리에서 가장 가까운 Provider의 value prop과 동일하다.

Consumer의 부모 중 Provider가 없는 경우에는 value 매개변수 값은 createContext()에 인자로 들어갔던 defaultValue를 참조한다.

## 3. Context.displayName

---

Context 객체는 displayName 문자열 속성을 설정할 수 있다.

React 개발자 도구는 이 문자열을 사용해서 context를 어떻게 보여줄 지 결정한다.

```jsx
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## 5. useContext

---

context 객체(React.createContext에서 반환된 값)을 받아 그 context의 현재 값을 반환한다.

```jsx
const value = useContext(MyContext);
```

context의 현재 값은 트리 안에서 이 Hook을 호출하는 컴포넌트에 가장 가까이에 있는 <MyContext.Provider>의 value prop에 의해 결정된다.

컴포넌트에서 가장 가까운 <MyContext.Provider>가 갱신되면 이 Hook은 그 MyContext provider에게 전달된 가장 최신의 context value를 사용하여 렌더러를 트리거 한다.

상위 컴포넌트에서 React.memo 또는 shouldComponentUpdate를 사용하더라도 useContext를 사용하고 있는 컴포넌트 자체에서부터 다시 렌더링 된다.

### Context.Provider, useContext 사용 예시

---

```jsx
const themes = {
  light: {
    foreground: "#000",
    background: "#eee",
  },
  dark: {
    foreground: "#fff",
    background: "#222",
  },
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function ToolBar(props) {
  return (
    <>
      <ThemeButton />
    </>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

## 주의 사항

---

다시 렌더링할지 여부를 정할 때 참조(reference)를 확인하기 때문에, Provider의 부모가 렌더링 될 때마다 불필요하게 하위 컴포넌트가 다시 렌더링 되는 문제가 생길 수도 있다.

예를 들어 value가 바뀔 때마다 매번 새로운 객체가 생성되므로 Provider가 렌더링 될 때마다 그 하위에서 구독하고 있는 컴포넌트 모두가 다시 렌더링 된다.
