# Jest, Cypress와 함께 단위(Unit) 테스트, E2E 테스트시 발생할 수 있는 문제!

---

### 1\. 발생한 문제.. 😡

---

행운의 로또 미션을 jest로 단위 테스트를 작성하고 주요 기능을 구현한 후 페어인 `도리`와 cypress로 E2E 테스트를 작성하고 UI 기능 구현을 하기로 했었다.  
<br />

순조롭게 cypress로 E2E 테스트 작성하고 UI 기능을 모두 구현!!  
<br />

cypress 테스트는 모두 통과!!  
하지만, jest 테스트를 돌려봤더니.. 초록불이 였던 테스트에 빨간불이 들어왔다. 🥲  
<br />

모두 초록불인 것을 확인하고 E2E 테스트 코드를 작성했는데.. 하고 에러 메시지를 확인하니, jest 테스트에서 cypress 테스트 코드를 읽어드리면서 발생하는 에러 메시지인 것을 확인하게 되었다.  
<br />

<img src="./jest-with-cypress-문제발생.png" />

- jest는 jest 테스트 코드만,,, cypress는 cypress 테스트 코드만 읽어줄 순 없니..?  
  <br /><br /><br />

### 2\. 해결하기 위해.. 😵‍💫

---

위 문제를 해결하기 위해 바로 공식문서를 확인했다면.. 조금 더 빠른 해결을 했을 수도 있을 것 같다. 이리 저리 찾아보던 중 jest 공식문서에 configuring을 확인 해보면 좋다 생각해서 공식문서를 확인했더니...  
<br />

**jest 공식 홈페이지에서 Configuring Jest안에 testPathIgnorePatterns를 확인**할 수 있었다.  
<br />

**testPathIgnorePatterns**의 내용은 아래와 같다.

- 기본값 : \["/node_modules/"\]
- 테스트 경로가 정규 표현식 패턴 문자열 배열과 일치하는 경로가 있다면 건너뛴다.
- 위 패턴 문자열은 전체 경로를 기준으로 확인하는데, 프로젝트의 루트 디렉터리가 서로 다른 환경에 있는 모든 파일을 실수로 무시하지 않도록 하려면 **`<rootDir>`문자열 토큰을 사용하여 프로젝트의 루트 디렉터리에 대한 경로를 포함**하라고 나와있다.
- 친절하게 작성하는 예시가 있다.
  - 예) \["`<rootDir>/build/`", "`<rootDir>/node_modules/`"\]
- package.json 파일안에 아래와 같이 **"testPathIgnorePatterns": \["`<rootDir>`/해당 디렉토리/"\]**를 적어주면 설정 끝!

<img src="./package.json파일설정.png" />

<br /><br /><br />

### 3\. 정상적으로 동작.. 😎

---

- 짠!

<img src="./jest-with-cypress-문제해결.png" />

- 혹시나, 위 코드를 삽입했지만 제대로 동작하지 않았을 경우!! 터미널에서 아래 명령어를 실행하고 확인해보자!

<img src="./npx-jest.png" />

_같은 문제를 겪는 누군가에게 도움이 되기를 바라며.._

<br /><br /><br />

> 참조 자료 : [jest 공식문서](https://jestjs.io/docs/configuration#testpathignorepatterns-arraystring)
