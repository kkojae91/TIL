# PR merge 이후 새로 작업할 브랜치 생성하기

```bash
git checkout {메인 브렌치}
git branch -D {merge 전에 사용한 브렌치}
git remote add upstream {git 주소}
git fetch upstream {merge 전에 사용한 브렌치}
git rebase upstream/{merge 전에 사용한 브렌치}
git checkout -b {새롭게 작업할 브렌치명}
```
