# git 버전 관리 명령어 모음 (작성중..📝)

- 현재 프로젝트에서 버전관리 시작

  ```
  git init
  ```

- 변경사항 확인

  ```
  git status
  ```

- 모든 변경사항 버전관리 지정

  ```
  git add .
  ```

- 특정 파일 변경사항 버전관리 지정

  ```
  git add SOME_FILE_NAME.js
  ```

- 원격 저장소에 버전 내역 전송

  - branch가 없을 경우는 master

  ```
  git push origin BRANCH_NAME
  ```

- 현재 디렉토리를 원격 저장소와 연결

  ```
  git remote add origin REPOSITORIES_URL
  ```

- 원격 저장소에 있는 변경사항을 로컬 환경에 가져오기

  ```
  git pull origin master
  ```

- branch 확인

  ```
  git branch
  git branch -a
  ```

- branch 생성 후 branch 변경

  ```
  git checkout -b BRANCH_NAME
  ```

- branch 생성

  ```
  git branch BRANCH_NAME
  ```

- branch 이동

  ```
  git checkout BRANCH_NAME
  ```

- 필요 없는 branch 제거

  ```
  git branch -d BRANCH_NAME
  ```

- 다른 디바이스에서 branch 가져오기
  - branch -r로 branch 목록을 출력 후 해당하는 BRANCH_NAME 확인 후 checkout -t origin/BRANCH_NAME 입력
  ```
  git branch -r
  git checkout -t origin/BRANCH_NAME
  ```
