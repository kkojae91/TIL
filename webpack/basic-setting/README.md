# webpack 기본 설정

---

## 1. entry / output

---

웹팩은 여러개 파일을 하나의 파일로 합쳐주는 번들러(bundler)다. 하나의 시작점(entry point)으로부터 의존적인 모듈을 전부 찾아내서 하나의 결과물을 만들어낸다. app.js부터 시작해 프로젝트들의 파일을 찾은 뒤 하나의 파일로 만드는 방식이다.

### 1. webpack 패키지와 webpack terminal 도구인 webpack-cli를 설치한다.

- 프로젝트에 설치할 경우 -D 옵션을 줘 devDependencies로 설치한다.
  ```
  npm install -D webpack webpack-cli
  ```

### 2. webpack.config.js 파일을 생성한다.

- webpack.config.js 파일안에는 아래의 코드를 삽입하면 기본세팅은 마무리 된다.

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
};
```

1. mode ("development", "production", "none")

- development에서는 강력한 소스 매핑, localhost 서버에서는 라이브 리로딩이나 hot module replacement 기능을 원합니다.
- production에서는 목표는 로드 시간을 줄이기 위해 번들 최소화, 가벼운 소스맵 및 애셋 최적화에 초점을 맞추는 것으로 변경됩니다.
- 논리적으로 분리를 해야 하면 일반적으로 환경마다 webpack설정을 분리하여 작성하는게 좋다.(webpack-merge 설치 필요)

2. entry

- 애플리케이션 번들링을 시작할 지점을 의미한다. 만약 배열을 값으로 전달하면, 배열에 담긴 모든 요소들이 번들링된다.
- main 프로퍼티 : 번들링된 파일명을 명시한 것(다른 이름으로 변경 가능, 여러개 설정 가능)
- main 프로퍼티 값 : 프로젝트 진입하는 app.js의 위치를 지정(다른 위치로 변경 가능)

3. output

- 웹팩으로 번들링하거나 로드하는 번들, 자산 그리고 기타 다른 것들을 어떻게, 어디에 보내야하는지 설정하는 옵션을 가지고 있다.
- filename 프로퍼티 : 번들링된 결과 파일명 설정하는 것
- filename 프로퍼티 값 : [] 괄호 안에 name에 entry에 설정된 프로퍼티 명이 들어갈 수 있게 설정한다. 위 예제의 ./src/app.js -> main.js로 변경된다는 뜻
- path 프로퍼티 : 번들링된 결과물의 절대 경로를 지정하는 것
- path 프로퍼티 값 : path 모듈의 resolve 함수안에 절대경로를 편하게 작성할 수 있음

### 3. package.json 설정 추가

웹팩을 실행하기 위한 NPM 커스텀 명령어를 추가한다.

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

- 여기까지 설정했다면, 웹팩의 기본 설정이 완료된 것이다.
