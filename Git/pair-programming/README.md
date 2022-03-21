# Pari Programming

- 페어 프로그래밍 시 페어 코드 가져오는 명령어
  ```bash
  git clone -b kkojae91 --single-branch {클론할 깃헙 주소}
  git checkout -b kkojae91_step
  git remote add pair 깃 저장소 주소.git
  git fetch pair {상대방_브랜치_이름}
  git checkout -t pair/{상대방_브랜치_이름}
  git checkout kkojae91
  git merge {상대방_브랜치_이름}
  git push origin kkojae91
  ```
