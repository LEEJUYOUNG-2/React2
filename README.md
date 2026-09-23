# 202230140 이주영

# 4주차
## Link Component
href(required)
```js

```
* root layout 필수 - html 및 body 포함
* subpage layout 필수X
## 중첩 라우트 만들기 
* 다중 URL 세그먼트로 구성된 라우트
* /blog/[slug]경로는 세 개의 세그먼트 구성
1. (Root Segment)
2. blog(Segment)
3. [slug] (Leaf Segment)
* 폴더를 계속 중첩하여 중첩된 경로 만들기O
* 특정 블로그 게시물에 대한 경로를 만들려면 blog 안에 새 [slug] 폴더를 만들고 page 파일을 추가
* 폴더 이름을 대괄호 [slug]로 묶으면 데이터에서 여러 페이지를 생성하는데 사용된느 동적 경로 세그먼트 생성 - 블로그 게시물, 제품 페이지 등

## [Next.js에서]
* 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트 정의(폴더가 URL세그먼트가 된다)
* /blog에 대한 경로를 추가하려면 app 디렉터리에 blog 폴더를 만듦
* /blog에 공개적으로 엑세스 할 수 있도록 하려면 page.tsx파일 추가

## [slug]의 이해
* slug는 사이트의 특정 페이지를 쉽게 읽을 수 있는 형태로 식별하는 URL의 일부
* 따라서 데이터에는 slug key가 반드시 있어야 한다

```js
// dummy data

export const posts = [
  { slug: "nextjs", title: "Next.js 소개", content: "Next.js는 React 기반의 풀스택 프레임워크입니다." },
  { slug: "routing", title: "라우팅", content: "App Router 알아보기 - Next.js 13부터 App Router가 도입되었습니다." },
  { slug: "ssr-ssg", title: "SSR vs SSG", content: "서버사이드 렌더링과 정적 사이트 생성의 차이를 알아봅니다." },
  { slug: "dynamic-routes", title: "동적 라우팅", content: "Next.js에서 [slug]를 활용한 라우팅 방식입니다." },
];
```

* 예를 들어 첫 번째 데이터를 호출하는 경우라면 /blog/nextjs 라고 호출
* [slug]는 반드시 slug일 필요X / 단, [foo]라고 했다면 데이터에 반드시 foo key(필드)가 있어야함

## 디렉터리 구조
```text
app/
└─ blog/
   ├─ page.tsx          // 블로그 메인 (목록)
   └─ [slug]/
      └─ page.tsx       // 블로그 상세 페이지
```

```js
import { posts } from "../posts";

export default function Posts({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return <h1>게시글을 찾을 수 없습니다!</h1>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

* 3, 4, 5 라인 의미 설명
- async function: 함수를 async로 선언 - 내부에서 await 사용가능
- await 사용이유 - 서버 데이터 읽어 올 때 타임 딜레이에 의한 오류방지
- 매개변수 구조({params}); Next.js가 페이지 호출할 때 props 객체로 {params,searchParams, ...}같은 값 넘기는데 여기서 params만 구조 분해로 받음
- 타입 {params: Promis<{slug: string}>} TypeScript 타입 선언
- params - promise(비동기 값) 명시




# 3주차
## Folder and file conventions 폴더 및 파일 규칙
### 라우팅 그룹 및 비공개 폴더 - Route Groups and private folders
* 라우트 그룹을 사용 - URL 변경 안 하고 코드 정리 가능
* 라우팅 되지 않은 파일 = _folder라는 비공개 디렉토리에 저장

## 병렬 및 가로채기 라우팅
* 슬롯 기반 레이아웃이나 모달 라우팅과 같은 특정 UI 패턴 적합
* 부모 레이아웃에서 렌더링되는 명명된 슬롯 - @slot사용
* 인터셉트 패턴 사용 - URL 변경 없이 현재 레이아웃 내에서 다른 경로 렌더링 가능
* 목록 위에 모달 형태로 상세 보기 표시 사용

| Pattern(docs) | Meanig | 일반적 사용 사례 |
|:---:|---|---|
| @folder | 명령된 슬롯 | 사이드바 + 메인 콘텐츠 |
| ()folder | 동일 레벨 가로채기 | 현재 화면에서 같은 레벨의 다른 페이지를 모달 등으로 표시 |
| (.)folder | 한 레벨 위에서 가로채기 | 상위 경로의 페이지를 현재 화면에서 다른 UI 형태로 표시 |
| (..)folder | 두 레벨 위에서 가로채기 | 패키지 재사용을 통한 빠른 설치 |
| (...)folder | 루트에서 가로채기 | 현재 경로와 관계없이 루트 기준의 페이지를 가로채서 표시 |

## Open Graph Protocol
* 웹사이트나 페이스북, 인스타, X, 카톡 등 링크 전달할 때 미리보기를 생성하는 프로토콜
* Open Graph Protocol - 대표적 프로토콜

## Organizing your project 프로젝트 구성
* next.js - 파일 구성 어디에 배치할지 제약X
* 프로젝트 체계적으로 구성하는데 도움되는 기능

### component의 계층 구조
#### 특수 파일에 정의된 component = 특정 계층 구조로 렌더링
- layout.js
- template.js
- error.js(React 오류 경계)
- loading(리액트 서스펜스 경계)
- not-found.js(React 오류 경계)
- pags.js or 중첩 layout.js
### 코로케이션
#### 파일 및 폴더를 기능별로 그룹화 - 프로젝트의 구조를 명확하게 정의
* app 디렉토리에서 중첩된 폴더 - 라우팅 구조 정의
* 각 폴더는 URL의 해당 세그먼트에 맵핑되는 라우팅 세그먼트 표현
* 폴더를 통해 라우트 구조가 정의되도 해당 라우트 세그먼트에 page.js or route.js파일이 추가 되기 전까지 외부에서 해당 라우트 접근 불가
* 팁 - 프로젝트 파일을 app 폴더에 함께 저장할 수는 있지만 그럴 필요X 원한다면 app디렉터리 외부 보관 가능
* app 디렉토리 파일은 기본적으로 안전하게 코로케이션O - 비공개 폴더 불필요 - 이런 경우 유용
* UI로직 라우팅 로직 분리
* 프로젝트와 Next.js 생태계 전반에서 내부 파일 일관 구성
* 코드 편집기서 파일 정렬 그룹화
* 향후 Next.js 파일 규칙과 관련된 잠재적 이름 충돌 방지
#### 알아두면 좋음
* 프레임워크 규칙X 동일한 밑줄 패턴을 사용하여 비공개 폴더 외부 파일을 비공개로 표시하는 것도 고려 가능
* 폴더 이름 앞에 %5F(밑줄로 URL 인코딩된 형태)를 접두사로 붙여 밑줄로 시작하는 URL 세크먼트 만들기 가능 - 아스키 코드의 URL-encoding

## layout template 차이
* layout - 정적(유지형) template - 동적(초기화형)


# 1주차
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

