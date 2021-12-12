# table 태그

## table

- table을 선언하는 단계 (여기서부터 표가 시작된다!)
- table 안에는 thead, tbody, tr, th, td 태그를 사용하여 table을 만든다.

```html
<table></table>
```

## thead

- table의 head 부분을 나타낸다.
- section을 나누는 개념

```html
<table>
  <thead></thead>
</table>
```

## tbody

- table의 body 부분을 나타낸다
- section을 나누는 개념

```html
<table>
  <thead></thead>
  <tbody></tbody>
</table>
```

## tr

- tr(table row)
- 표 내부에서 행을 의미하는 태그

```html
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr></tr>
  </tbody>
</table>
```

## th

- th(table header)
- header 칸의 셀(cell)을 나타내는 태그
- 기본 스타일 : 중앙 정렬, 볼드체

```html
<table>
  <thead>
    <tr>
      <th>번호</th>
      <th>이름</th>
    </tr>
  </thead>
  <tbody>
    <tr></tr>
  </tbody>
</table>
```

## td

- td(table data)
- 일반적인 data 칸의 셀(cell)을 나타내는 태그
- 기본 스타일 : 왼쪽 정렬

```html
<table>
  <thead>
    <tr>
      <th>번호</th>
      <th>이름</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>김씨</td>
    </tr>
    <tr>
      <td>2</td>
      <td>이씨</td>
    </tr>
    <tr>
      <td>3</td>
      <td>박씨</td>
    </tr>
  </tbody>
</table>
```

위 테이블의 결과는 아래와 같이 나온다.

| 번호 | 이름 |
| ---- | ---- |
| 1    | 김씨 |
| 2    | 이씨 |
| 3    | 박씨 |
