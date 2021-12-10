# dataset 속성에 대해 알아보자!

- data 어트리뷰트와 dataset 프로퍼티를 사용하면 HTML요소에 정의한 사용자 정의 어트리뷰트와 자바스크립트 간에 데이터를 교환할 수 있다.
- data 어트리뷰트는 data-user-id, data-role과 같이 data- 접두사 다음에 임의의 이름을 붙여 사용한다.

  ```html
  <body>
    <ul class="users">
      <li id="1" data-user-id="7621" data-role="admin">Lee</li>
      <li id="2" data-user-id="9524" data-role="subscriber">Kim</li>
    </ul>
  </body>
  ```

- data 어트리뷰트의 값은 HTMLElement.dataset 프로퍼티로 취득할 수 있다.
- dataset 프로퍼티는 HTML 요소의 모든 data 어트리뷰트의 정보를 제공하는 DOMStringMap 객체를 반환한다.
- DOMStringMap 객체는 data 어트리뷰트의 data- 접두사 다음에 붙인 이름을 카멜 케이스(camelCase)로 변환한 프로퍼티를 가지고 있다.
- 이 프로퍼티로 data 어트리뷰트의 값을 취득하거나 변경할 수 있다.

  ```html
  <body>
    <ul class="users">
      <li id="1" data-user-id="7621" data-role="admin">Lee</li>
      <li id="2" data-user-id="9524" data-role="subscriber">Kim</li>
    </ul>
    <script>
      const users = [...document.querySelector(".users").children];

      // user-id가 '7621'인 요소 노드를 취득한다.
      const user = users.find((user) => user.dataset.userId === "7621");
      // user-id가 '7621'인 요소 노드에서 data-role의 값이 취득한다.
      console.log(user.dataset.role); // 'admin'

      // user-id가 '7621'인 요소 노드의 data-role 값을 변경한다.
      user.dataset.role = "subscriber";
      // dataset 프로퍼티는 DOMStringMap 객체를 반환한다.
      console.log(user.dataset); // DOMStringMap {userId: '7621', role: 'subscriber'}
    </script>
  </body>
  ```

- data 어트리뷰트의 data- 접두사 다음에 존재하지 않는 이름을 키로 사용하여 dataset 프로퍼티에 값을 할당하면 HTML 요소에 data 어트리뷰트가 추가된다.
- 이때, dataset 프로퍼티에 추가한 카멜케이스(fooBar)의 프로퍼티 키는 data 어트리뷰트의 data- 접두사 다음에 케밥케이스(data-foo-bar)로 자동 변경되어 추가된다.

```html
<body>
  <ul class="users">
    <li id="1" data-user-id="7621">Lee</li>
    <li id="2" data-user-id="9524">Kim</li>
  </ul>
  <script>
    const users = [...document.querySelector(".users").children];

    // user-id가 '7621'인 요소 노드를 취득한다.
    const user = users.find((user) => user.dataset.userId === "7621");

    // user-id가 '7621'인 요소 노드에 새로운 data 어트리뷰트를 추가한다.
    user.dataset.role = "admin";
    console.log(user.dataset);
    /*
    DOMStringMap {userId:'7621', role: 'admin'}
    -> <li id='1' data-user-id='7621' data-role='admin'>Lee</li>
    */
  </script>
</body>
```
