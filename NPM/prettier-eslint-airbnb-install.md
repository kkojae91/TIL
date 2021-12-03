# prettier & eslint & airbnb 프로젝트 환경에 적용하기!

1. npm project 생성

```
 npm init
```

위 명령어를 실행하면 package.json 파일, node_modules 폴더가 생성 된다.
npm install 을 통해 package들을 설치하면 node_modules폴더 안에 저장되게 되고, 많은 package를 설치하다 보면 node_modules 파일이 점차 커지게 되므로 해당 파일은 .gitignore로 파일을 버전관리하지 못하도록 막아준다.
npm install 을 하게 되면 node_modules는 자동으로 생성되기 때문에 버전관리를 하지 않아도 된다.

2. .gitignore 파일에 node_modules 추가

```
 ## .gitignore
 node_modules
```

3. vscode extensions 에서 eslint를 설치 후 npm에서 lint를 설치한다.

```
 npm install eslint -D
```

(Devdependency) flag를 -D 를 주면 개발의존성으로 해당 프로젝트에 설치되게 된다.

4. npm에 eslint를 설치후 .eslint.json 파일 생성

```
 npx eslint --init
```

프로젝트 환경에서 init 하려면 npx 명령어를 앞에 추가해주어야 한다.

- to check syntax and find problems
- js modules
- vue, react: none of these (react나 vue를 사용할 경우는 맞게 설정)
- typescript : no (사용할 경우 yes)
- browser
- json

여기까지 진행 했다면 eslint 작업은 끝!!

5. airbnb 포맷 설정하기!

react를 사용한다면 eslint-airbnb를 사용하면 되지만, js에서는 eslint-airbnb-base를 사용하면 된다.

npm version 5 이상을 사용하고 있다면 아래 shortcut 명령어 사용!

```
npx install-peerdeps --dev eslint-config-airbnb-base
```

설치가 끝나면 eslintrc.json 파일 안에 extends 등 수정

```json
// eslintrc.json
{
  "env": {
    "browser": true,
    "node": true, // 필요시 -> 에러 방지 위해 browswer, node 둘다 true로 해도 된다.
    "es2020": true //2020-12-03 기준 2021은 eslint가 안되는 오류가 있다고 한다.
  },
  "extends": ["eslint:recommended", "airbnb-base"], // airbnb-base 포맷 추가 (순서 중요!!)
  "parserOptions": {
    "ecmaVersion": 11, // es2020
    "sourceType": "module"
  },
  "rules": {} // rules에는 추후 프로젝트 진행하면서 필요시 rules를 추가하며 진행한다.
}
```

6. vscode extensions 에서 prettier를 설치 후 npm에서 lint를 설치한다.

```
 npm install prettier —save-dev —save-exact
 npm install eslint-plugin-prettier@latest —save-dev
 npm install eslint-config-prettier —save-dev
 npm install eslint-plugin-prettier —save-dev
```

```json
// eslintrc.json
{
  ...
  "extends": ["eslint:recommended", "airbnb-base", "plugin:prettier/recommended"], // 순서 중요!!
  ...
}
```

7. prettierrc 파일 생성 후 아래 코드 삽입

```json
{
  // default: 80
  "printWidth": 80,
  "singleQuote": true,
  // default: true
  "semi": true,
  // default: false
  "useTabs": false,
  // default: 2
  "tabWidth": 2,
  // default: es5
  "trailingComma": "all",
  // default: always
  "arrowParens": "always",
  // default: lf
  "endOfLine": "lf"
}
```

8. @babel/eslint-parser 설치

es6이상의 코드를 읽는데 오류가 발생할 경우

```
npm install @babel/eslint-parser -D
```

아래 코드 삽입

```json
// eslintrc
"parser": "@babel/eslint-parser",
"parserOptions": {
  // ...
  "requireConfigFile": false
}
```
