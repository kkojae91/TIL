# localStorage (웹 스토리지)

## 기본 API

```javascript
// 키에 데이터 쓰기
localStorage.setItem("key", value);

// 키로부터 데이터 읽기
localStorage.getItem("key");

// 키의 데이터 삭제
localStorage.removeItem("key");

// 저장된 키/값 쌍의 개수 확인하기
localStorage.length;
```

## 주의 사항

- 웹 스토리지는 문자열 데이터만 저장이 가능하다.
- JSON.parse(), JSON.stringify()를 활용한다.

```javascript
localStorage.setItem("json", JSON.stringify({ a: 1, b: 2 }));
console.log(JSON.parse(localStorage.getItem("json")));
// {a: 1, b: 2}
```
