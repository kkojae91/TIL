# 섹션 구분을 조금 더 의미 있게 div가 아닌 section 혹은 article을 사용할 수 있다.

## `<div>`

- HTML `<div>` tag는 플로우 컨텐츠를 위한 통용 컨테이너다. CSS로 꾸미기 전에는 컨텐츠나 레이아웃에 어떤 영향도 주지 않는다.
- `<div>` 요소는 "순수" 컨테이너로서 아무것도 표현하지 않는다. 대신 다른 요소 여럿을 묶어 class, id 속성으로 꾸미기 쉽도록 돕거나, 문서의 특정 구역이 다른 언어임을 표시하는 등의 용도로 사용할 수 있다.
- div는 division의 약자입니다. 별도의 의미가 없고, 그냥 정말 어떤 내용이든 담을 수 있는 박스라고 생각하면 된다.
- 사용방법
  - `<div>` 요소는 의미를 가진 다른 요소 (`<article>`, `<section>`, `<nav>` 등)가 적절하지 않을 때만 사용해야 한다.

## `<article>`

- HTML `<article>` tag는 문서, 페이지, 애플리케이션, 또는 사이트 안에서 독립적으로 구분해 배포하거나 재사용할 수 있는 구획을 나타낸다.
- 사용 예) 게시판과 블로그 글, 매거진이나 뉴스 기사 등이 있다.
- 하나의 문서가 여러개의 `<article>`을 가질 수 있다.
- 사용 예) 사용자가 스크롤하면 계속해서 다음 글을 보여주는 블로그의 경우, 각각의 글이 `<article> 요소가` 되며, 그 안에는 또 여러 개의 `<section>`이 존재할 수 있다.
- 사용방법
  - 각각의 `<article>`을 식별할 수단이 필요하다. 주로 제목(`<h1> ~ <h6>`)요소를 `<article>`의 자식으로 포함하는 방법을 사용한다.
  - `<article>` 요소가 중첩되어 있을 때, 안쪽에 있는 요소는 바깥쪽에 있는 요소와 관련된 글을 나타낸다.  
    사용 예) 블로그 글의 댓글은, 글을 나타내는 `<article> 요소` 안에 중첩한 `<article>`로 나타낼 수 있다.
  - `<article>` 요소의 작성 일자와 시간은 `<time>` 요소의 datatime 속성을 이용하여 설명할 수 있다.

## `<section>`

- HTML의 `<section>` 요소는 HTML 문서의 독립적인 구획을 나타내며, 더 적합한 의미를 가진 요소가 없을 때 사용합니다. 보통 `<section>`은 제목을 포함하지만, 항상 그런 것은 아니다.
- 사용 방법

  - 각각의 `<section>을` 식별할 수단이 필요하다. 주로 제목(`<h1> ~ <h6>`) 요소를 `<section>`의 자식으로 포함하는 방법을 사용한다.
  - 요소의 컨텐츠를 따로 구분해야 할 필요가 있으면 `<article>` 요소를 고려한다.
  - `<section>` 요소를 일반 컨테이너로 사용하면 안 된다. 특히 단순히 스타일링이 목적이라면 `<div>` 요소를 사용하는 것이 좋다. 대게 문서 요약에 해당 구획이 논리적으로 나타나야 하면 `<section>` 이 좋은 선택이다.

- 👎🏼

  ```html
  <div>
    <p>시도할 횟수를 입력해주세요.</p>
    <input name="racingCount" placeholder="10" />
    <button>확인</button>
  </div>
  ```

- 👍🏼

  ```html
  <section>
    <h2 hidden>시도할 횟수 입력</h2>
    <label for="racingCount">시도할 횟수를 입력해주세요.</label>
    <input type="number" name="racingCount" placeholder="10" />
    <button>확인</button>
  </section>
  ```

> 참조 링크: [MDN-div](https://developer.mozilla.org/ko/docs/Web/HTML/Element/div), [MDN-article](https://developer.mozilla.org/ko/docs/Web/HTML/Element/article), [MDN-section](https://developer.mozilla.org/ko/docs/Web/HTML/Element/section)
