# 202230140 이주영

## pnpm
### Performant NPM 약자 - 고성능 Node 패키지 매니지
* npm, yam과 같은 목적의 패키지 관리자 - 디스크 공간 낭비, 복잡한 의존성 관리, 느린 설치 속도 문제 개선 위해 개발
* 하드 링크 기반의 효율적 저장 공간 활용
* 패키지를 한 번만 설치 - 글로벌 저장소에 저장 - 각 프로젝트 node modules 디렉토리에는 설치된 패키지에 대한 하드 링크(심볼릭 링크) 생성
* 빠른 패키지 생성 속도 - 이미 설치된 패키지 다시 설치x(재사용) - 빠른 설치 속도 체감 가능

## pnpm create next-app@latest
* npm의 npx 대신 pnpm create 사용
* $ pnpm create react-app my-app
* $ cd my-app
* $ re -rf node_modules package-lock.json
* $ pnpm install
* 서버 실행 $ pnpm dev

## 하드링크
### 파일 - 세 부분
* Directory Entry : 파일 이름과 해당 incode 번호를 매핑 정보가 있는 특수한 파일
* incode : 파일 또는 디렉토리에 대한 모든 메타데이터를 저장하는 구조체(권한, 소유자, 크기, 데이터가 블록 위치 등)
* data blocks : 실제 데이터가 존재하는 영역
* 하드링크 생성 - 디렉토리 엔트리에 매핑 정보 추가 - 동일한 incode를 가르킴 
* 원본 - 하드링크 동일 파일(원본 사본 개념x)

## Hard link vs. Symbolic link(Soft link)
* 디렉토리 엔트리에 있는 원본 하드링크 - 같은 incode - 데이터 블록 100% 공유
* 원본, 하드링크 중 하나 삭제 - 디렉토리 엔트리 이름만 삭제
* link count - 0 되지 않는 한 데이터 남음
## Soft link
* incode 공유x 경로 문자열 저장해 두는 특수 파일
* 심볼릭 링크 열면 내부에 적힌 경로를 따라가 원본 파일 찾음
* 원본 삭제 - 심볼릭 링크 끊어진 경로 - 이용 불가
* 윈도우의 바로 가기 파일과 비슷


 
