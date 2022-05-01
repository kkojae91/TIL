# 리액트 적응기 - 컴포넌트 반복(key)

---

리액트 사용 방법이 익숙하지 않아... 사용하기 어렵다..!
리액트 적응기를 일주일에 하나씩 작성하며 리액트 사용법에 대해 익숙해지자!!

## 1. key

---

리액트에서 key는 컴포넌트 배열을 렌더링했을 때 어떤 원소에 변동이 있었는지 알아내려고 사용한다.
key가 없을 때는 Virtural DOM을 비교하는 과정에서 리스트를 순차적으로 비교하면서 변화를 감지한다.
하지만 key가 있다면 이 값을 사용하여 어떤 변화가 일어났는지 더욱 빠르게 알아낼 수 있다.

정리하자면 key는 React가 어떤 항목을 변경, 추가 또는 삭제할지 식별하는 것을 돕는다.
key는 엘리먼트에 안정적인 고유성을 부여하기 위해 배열 내부의 엘리먼트를 지정해야한다.

### 1-1. key 설정시 주의사항

---

```js
const IterationSample = () => {
  const names = ["눈사람", "얼음", "눈", "바람"];
  const namesList = names.map((name, index) => <li key={index}>{name}</li>);
  return <ul>{namesList}</ul>;
};
```

대부분의 경우 key값을 설정할 때 데이터의 ID를 사용한다.
렌더링 한 항목에 대한 안정적인 ID가 없다면 최후의 수단으로 항목의 인덱스를 key로 사용할 수 있다.

위 예제 처럼 정적인 배열을 렌더링할 경우 index를 key로 사용할 경우는 큰 문제가 되지 않지만,
동적인 배열을 렌더링할 경우 index를 key로 사용할 경우 React는 효율적으로 리렌더링하지 못한다.

#### Key는 형제 사이에서만 고유한 값이여야 한다. (모든 컴포넌트의 id가 고유한 값일 필요는 없다.)

```js
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
  const content = props.posts.map((post) => (
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  ));
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  { id: 1, title: "Hello World", content: "Welcome to learning React!" },
  { id: 2, title: "Installation", content: "You can install React from npm." },
];
```

위 에제에서 sidebar와 content의 id값이 같더라도, 다른 부모의 자식요소이기 때문에 문제되지 않는다.

#### 하위 컴포넌트에서 key와 동일한 값이 필요하다면 key가 아닌 다른 prop 이름으로 props를 전달해야한다.

```js
const content = posts.map((post) => (
  <Post key={post.id} id={post.id} title={post.title} />
));
```

위 예시에서 Post컴포넌트에서 props.key는 읽지 못한다. 따라서 id라는 prop을 새롭게 생성후 post.id를 props로 내려줘야 한다.

## 2. 미션에서 key 사용하다 마주한 문제!

### fragment 안에서 map함수를 사용할 경우 key는 fragment에 설정해줘야한다.

단순하게 Input 컴포넌트의 반복이니 Input 컴포넌트에 key값을 설정해주면 되겠지..?! 라고 생각했지만

```js
function Example(props) {
  return [1, 2, 3, 4].map((number) => (
    <>
      <Input key={number} {...props} />
      {// ...}
    </>
  ));
}
```

위 예제같이 Input 컴포넌트에 key값을 설정하게 될 경우 아래와 같은 에러를 마주하게 된다...
`Warning: Each child in a list should have a unique "key" prop.`
분명 key값을 설정했는데, unique한 key값을 설정해야한다...??!

해결법은 간단하다..!
Fragment에 key값을 설정해주면 쉽게 해결할 수 있다.

```js
function Example(props) {
  return [1, 2, 3, 4].map((number) => {
    <React.Fragment key={number}>
      <Input {...props} />
      {// ...}
    </React.Fragment>;
  });
}
```

끗!
