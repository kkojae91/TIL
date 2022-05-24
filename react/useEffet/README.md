# 리액트 적응기 - useEffect

Effect Hook을 사용하면 함수 컴포넌트에서 side effect를 수행할 수 있다.

useEffect는 class component의 componentDidMount, componentDidUpdate, componentWillUnmount가 합쳐진 것으로 생각할 수 있다.

React component에는 일반적으로 side effects가 있고,
정리(clean up)이 필요한 것과 정리(clean up)이 필요하지 않은 것이 있다.

## 정리(clean-up)를 이용하지 않는 Effects

---

React가 DOM을 업데이트한 뒤 추가로 코드를 실행해야 하는 경우가 있다.
-> 실행 이후 신경 쓸 필요 없는 것들 (network request, DOM 수동 조작, 로깅 등)

### Class Component 예시

---

```jsx
export default class ClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    document.title = `You Clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You Clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Class Component의 render 메서드는 side effect를 발생시키지 않는다.
Class Component의 side effect는 위 예시에서 확인 할 수 있듯이 componentDidMount와 componentDidUpdate에서 발생한다.

위 코드 예제를 확인하면 componentDidMount, componentDidUpdate의 코드가 중복되는 것을 확인 할 수 있다.
이유는 컴포넌트가 이제 막 마운트된 단계인지 아니면 업데이트되는 것인지에 상관없이 side effect를 수행해야하기 때문이다.

### Hook(Function Component)을 이용한 예시

---

```jsx
const FunctionComponent = () => {
  const [count, setCount] = useState(0);

  const handleCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    document.title = `You Clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleCount}>Click me</button>
    </div>
  );
};

export default FunctionComponent;
```

#### useEffect가 하는 일은?

useEffect Hook을 이용하여 React에게 컴포넌트가 렌더링 이후에 어떤 일을 수행하는 지를 말한다.
React는 우리가 콜백함수로 넘긴 함수를 기억했다 DOM 업데이트를 수행한 이후에 불러낸다.

#### useEffect를 컴포넌트 안에서 불러내는 이유는?

useEffect를 컴포넌트 내부에 둠으로써 effect를 통해 count변수 또는 다른 prop에도 접근할 수 있다.

- 클로저 현상을 이용해 특별한 API 없이 값을 effect callback 함수가 컴포넌트 내부의 값에 접근 할 수 있다는 의미

#### useEffect는 렌더링 이후에 매번 수행되는가?

dependency array를 추가하지 않았다면 기본적으로 렌더링과 이후의 모든 업데이트에서 수행한다.
따라서 React effect가 수행하는 시점은 이미 DOM이 업데이트되었음을 보장한다.

## 정리(clean-up)를 이용하는 Effects

---

### Class Component 예시

---

아래 코드는 외부 데이터에 구독(subscription)을 설정해야하는 경우이다.
이런 경우에는 메모리 누수가 발생하지 않도록 clean-up 해주는게 좋다.

```jsx
class FriendStatus extends Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline,
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return "Loading...";
    }

    return this.state.isOnline ? "Online" : "Offline";
  }
}
```

componentDidMount, componentWillUnmount 내부의 코드는 개념상 같은 코드이지만 생명주기 메서드는 이를 분리하게 만든다.

### Hook(Function Component)을 이용한 예시

---

useEffect는 componentDidMount, componentWillUnmount의 코드 결합도가 높기 때문에 이를 함께 다룰 수 있도록 고안된 Hook 입니다.
effect 함수 내부에서 함수를 반환하게 되면 React는 그 함수를 정리가 필요한 때에 실행시킨다.

```jsx
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    const handleStatusChange = (status) => setIsOnline(status.isOnline);

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () =>
      ChatAPI.unsubscribeToFriendStatus(props.friend.id, handleStatusChange);
  });

  if (isOnline === null) return "Loading...";

  return isOnline ? "Online" : "Offline";
}
```

#### effect에서 함수를 반환하는 이유는?

effect를 위한 추가적인 정리(clean-up) 메커니즘이다.
모든 effect는 정리를 위한 함수를 반환할 수 있다.
이러한 메커니즘은 위 코드의 구독의 추가 제거를 위한 로직을 가까이 묶어 둘 수 있게 한다.
즉, 구독의 추가와 제거가 모두 하나의 effect안에 구성할 수 있도록 한다.

#### React가 effect를 정리(clean-up)하는 시점은?

React는 컴포넌트가 마운트 해제되는 때에 정리(clean-up)를 실행한다.
하지만, effect는 한 번만 실행되는게 아니라 렌더링이 실행되는 때마다 실행된다.
React가 다음 차례의 effect를 실행하기 전에 이전의 렌더링에서 파생된 effect 또한 정리하는 이유가 바로 이때 문이다.

## useEffect를 이용하는 팁

---

### 관심사를 구분하려고 한다면 Multiple Effect를 사용한다.

---

Hook인 탄생한 동기가 된 문제 중의 하나가 생명주기 class 메서드가 관련이 없는 로직들은 모아놓고,
관련이 있는 로직들은 여러 개의 메서드에 나눠 놓는 경우가 자주 있었다는 것입니다.
앞서 보았던 예제를 하나의 ClassComponent로 묶어보겠습니다.

```jsx
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

위 예제를 보면,
document.title을 설정하는 로직이 componentDidMount, componentDidUpdate에 나눠져 있다.
또한 구독 로직 또한 componentDidMount, componentWillUnmount에 나눠져 있다.
따라서 componentDidMount는 document.title, 구독 로직이 모두 존재한다.

즉, Class Component를 사용하게 되면 관심사의 분리가 이뤄지지 않는다는 것을 확인 할 수 있다.

### Hook을 사용하여 위 문제를 해결하기

---

```jsx
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

Hook을 이용하면 생명주기 메서드에 따라서가 아니라 코드가 무엇을 하는지에 따라 나눌 수가 있다.
React 컴포넌트에 사용된 모든 effect를 지정된 순서에 맞춰 적용합니다.

### Effect를 건너뛰어 성능 최적화하기

---

모든 렌더링 이후에 effect를 정리(clean-up)하거나 적용하는 것이 때때로 성능 저하를 발생시키는 경우도 있다.
useEffect의 선택적 인수인 두 번재 인수로 배열을 넘기게 되면,
특정 값들이 리렌더링 시에 변경되지 않는다면 React로 하여금 effect를 건너 뛰도록 할 수 있다.

아래 코드의 두 번째 인수로 배열 안에 count 변수를 담게 되면, 리렌더링 시 count 변수의 값이 변하지 않으면 effect 함수가 실행되지 않는다.

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // count가 바뀔 때만 effect를 재실행한다.
```

이것은 정리(clean-up)을 사용하는 effect의 경우에도 동일하게 작용한다.

```jsx
useEffect(() => {
  const handleStatusChange = (status) => setIsOnline(status.isOnline);

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

  return () =>
    ChatAPI.unsubscribeToFriendStatus(props.friend.id, handleStatusChange);
}, [props.friend.id]); // props.friend.id 가 바뀔 때만 재구독한다.
```

### 주의 사항

위와 같은 최적화 방법을 사용한다면 배열이 컴포넌트 범위 내에서 바뀌는 값들과 effect에 의해 사용되는 값들을 모두 포함하는 것을 기억해야한다.

effect를 실행하고 이를 정리(clean-up)하는 과정을 딱 한 번씩만 실행하고 싶다면, 빈 배열([])을 두 번째 인수로 넘기면 된다.
이렇게 함으로써 effect가 prop이나 state의 그 어떤 값에도 의존하지 않으며 따라서 재실행되어야 할 필요가 없음을 알게 한다.

## 참고... useLayoutEffect

useLayoutEffect는 모든 DOM 변경 후에 동기적으로 발생한다.
DOM에서 레이아웃을 읽고 동기적으로 리렌더링하는 경우에 사용하세요. useLayoutEffect의 내부에 예정된 갱신은 브라우저가 화면을 그리기 이전 시점에 동기적으로 수행됩니다.

먼저 useEffect를 사용해보고 문제가 발생한다면! useLayoutEffect를 사용해보기를 추천합니다.
