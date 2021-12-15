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

## dataset 활용 (선택된 요소 지우기!)

```html
<table border="1">
  <thead>
    <tr>
      <th>번호</th>
      <th>이름</th>
      <th>나이</th>
      <th>삭제</th>
    </tr>
  </thead>
  <tbody>
    <tr data-row-id="고">
      <td data-people-number="1">1</td>
      <td data-people-last-name="고">고</td>
      <td data-people-age="31">31</td>
      <td>
        <button name="table-buttons" data-delete-button-id="고">삭제</button>
      </td>
    </tr>
    <tr data-row-id="박">
      <td data-people-number="2">2</td>
      <td data-people-last-name="박">박</td>
      <td data-people-age="28">28</td>
      <td>
        <button name="table-buttons" data-delete-button-id="박">삭제</button>
      </td>
    </tr>
    <tr data-row-id="김">
      <td data-people-number="3">3</td>
      <td data-people-last-name="김">김</td>
      <td data-people-age="17">17</td>
      <td>
        <button name="table-buttons" data-delete-button-id="김">삭제</button>
      </td>
    </tr>
    <tr>
      <td colspan="4">오늘 하루 즐거웠어요!</td>
    </tr>
  </tbody>
</table>
```

```html
<script>
  const $$tableButtons = [
    ...document.querySelectorAll('button[name="table-buttons"]'),
  ];
  const $$tr = [...document.querySelectorAll("tr")];

  $$tableButtons.forEach(($tableButton) =>
    $tableButton.addEventListener("click", () => {
      const $targetTr = $$tr.find(
        ($tr) => $tr.dataset.rowId === $tableButton.dataset.deleteButtonId
      );
      $targetTr.remove();
    })
  );
</script>
```

- button[name="table-buttons] 선택자를 활용해 table 태그안에 button 엘리먼트를 전부 배열에 담아준다.
- tr 태그도 전부 배열에 담아준다.
- $$tableButtons를 순회하면서 각각 클릭 이벤트를 설정해준 후
- find() 메서드를 활용해 $tr의 rowId와 $tableButton의 deleteButtonId가 일치하는지 확인 해준 후 해당하는 엘리먼트를 .remove()를 활용해 제거 해줄 수 있다.
