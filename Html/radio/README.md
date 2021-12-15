# radio (input 태그)

- 여러 개의 항목중 하나만 선택하도록 하는 동그란 버튼을 라디오 버튼이라고 합니다. radio 버튼은 input 태그로 만듭니다.
- 중복 선택이 되게 만들 경우 checkbox를 만들면 됩니다.

## 문법

```html
<form id="select-form">
  <h3>과일</h3>
  <input
    type="radio"
    id="water-mellon"
    name="fruit"
    value="water-mellon"
    checked
  />
  <label for="water-mellon">수박</label>
  <input type="radio" id="mellon" name="fruit" value="mellon" />
  <label for="mellon">멜론</label>

  <h3>성별</h3>
  <input type="radio" id="man" name="gender" value="man" />
  <label for="man">남자</label>
  <input type="radio" id="woman" name="gender" value="woman" checked />
  <label for="woman">여자</label>
  <br />
  <br />
  <button id="select-button">선택하기</button>
</form>
```

- 보편적으로 form 태그 안에 input 태그와 label 태그로 작성한다.
- name: name의 값이 같은 것 중에서 하나를 선택합니다.
- value: 선택했을 때 전달될 값입니다.
- checked: 선택된 상태로 만듭니다.

## 응용

```html
<script>
  const $selectButton = document.querySelector("#select-button");
  const $$fruits = [
    ...document.querySelectorAll('#select-form input[name="fruit"]'),
  ];

  const $$gender = [
    ...document.querySelectorAll('#select-form input[name="gender"]'),
  ];

  $selectButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log($$fruits.find(($fruit) => $fruit.checked));
    console.log($$gender.find(($gender) => $gender.checked));
  });
</script>
```

- selector를 "#select-form input[name='fruit']" 으로 설정해 해당하는 select-form 태그 안에 fruit이라는 name을 가진 input 태그들을 전체 선택한다.
- 버튼을 클릭했을때 선택되어있는 input을 확인하기 위해 find() 메서드를 사용해 fruit.checked로 true, false 여부를 확인한다.
- 해당하는 값을 가지고 오기 위해 .value를 사용해 input 태그 value="" 에 접근하여 해당하는 값을 가져온다.

- selector를 "#select-form input[name='gender']" 으로 설정해 해당하는 select-form 태그 안에 gender이라는 name을 가진 input 태그들을 전체 선택한다.
- 버튼을 클릭했을때 선택되어있는 input을 확인하기 위해 find() 메서드를 사용해 gender.checked로 true, false 여부를 확인한다.
- 해당하는 값을 가지고 오기 위해 .value를 사용해 input 태그 value="" 에 접근하여 해당하는 값을 가져온다.
