# 202230140 이주영

# 12주차

## 외부(서드파티) component

- 클라이언트 전용 기능에 의존하는 외부 컴포넌트는 클라이언트 컴포넌트 안에서 사용하면 예상대로 동작

- acme-carousel 패키지의 <Carousel />은 useState를 사용 - 자체적으로 "use client" 지시문은 포함X
  이 컴포넌트를 클라이언트 컴포넌트에서 불러와 사용

```tsx
"use client";

import { useState } from "react";
import { Carousel } from "acme-carousel";

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  );
}
```

- server component 내에서 직접 실행시 오류
  <Carousel />이 클라이언트 전용 기능을 사용하지만, Next.js가 이를 알지 못하면 서버 컴포넌트에서 렌더링할 때 문제가 발생

* 이 문제를 해결하려면 외부 컴포넌트를 별도의 클라이언트 컴포넌트로 감싸면 됨 - 서버 컴포넌트에서 감싼 컴포넌트를 불러와 사용O

```tsx
"use client";

import { Carousel } from "acme-carousel";

export default Carousel;
```

```tsx
import Carousel from "./carousel";

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/* Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  );
}
```

## 라이브러리 작성자를 위한 조언

- 컴포넌트 라이브러리를 만들 때 - 클라이언트 전용 기능에 의존하는 진입점에 "use client" 지시문을 추가
- 그러면 사용자는 별도의 래퍼를 만들지 않고도 해당 컴포넌트를 서버 컴포넌트에서 가져와 사용 가능
- 일부 번들러는 "use client" 지시문을 제거 가능 React Wrap Balancer와 Vercel Analytics 저장소에서 esbuild가 이 지시문을 포함하도록 설정하는 예시를 확인 가능

### 환경 변수 노출 예방

- JavaScript 모듈은 server 및 client compoment 모듈 간 공유o

* 실수로 전용 코드를 client로 가져올 수 있음

- 컴포넌트 라이브러리를 만들 때는 클라이언트 전용 기능에 의존하는 진입점에 "use client" 지시문을 추가
- 그러면 사용자는 별도의 래퍼를 만들지 않고도 해당 컴포넌트를 서버 컴포넌트에서 가져와 사용O
- 일부 번들러는 "use client" 지시문을 제거할 수 있습니다. React Wrap Balancer와 Vercel Analytics 저장소에서 esbuild가 이 지시문을 포함하도록 설정하는 예시를 확인

```tsx
import "server-only";

export async function getData() {
  const res = await fetch("https://external-service.com/data", {
    headers: {
      authorization: process.env.API_KEY,
    },
  });

  return res.json();
}
```

- 이 모듈을 클라이언트 컴포넌트에서 가져오려고 하면 빌드 시 오류가 발생

* client-only 패키지는 window 객체에 접근하는 코드처럼 클라이언트 전용 로직이 포함된 모듈을 표시할 때 사용o
  - Next.js에서 server-only 또는 client-only 패키지를 설치하는 것은 선택 사항
  - 다만 린트 규칙에서 해당 패키지가 필요하다고 안내한다면, 경고를 해결하기 위해 설치o

- npm install server-only

## Fetching Data

- 데이터 가져오기 1-1. 서버 컴포넌트
- 서버컴포넌트에서 데이터를 fetch하는 방법 2가지.

1. fetch API
2. ORM or DATABASE

- fetch API

* 데이터를 가져오려면 fetch API를 사용하여 컴포넌트를 비동기식 함수로 변환하고 다음 fetch 호출 기다림

```tsx
export default async function Page() {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 알아두면 좋은 정보

- fetch 응답은 기본적으로 캐시되지 않음
- Next.js는 라우팅 페이지를 미리 렌더링하며, 성능 향상을 위해 렌더링 결과를 캐시O
- 동적 렌더링을 사용하려면 fetch에 { cache: 'no-store' } 옵션을 지정
- 개발 중에는 가시성과 디버깅을 위해 fetch 호출을 기록O
  Next.js 15.1 이후부터는 서버 컴포넌트에서 await 없이 fetch를 사용O

* ORM 또는 데이터베이스 사용

- 서버 컴포넌트는 서버에서 렌더링되므로 ORM이나 데이터베이스 클라이언트를 사용해 안전하게 데이터베이스 쿼리를 실행할 수 있다
- 컴포넌트를 async 함수로 선언하고, 쿼리 결과를 기다리면 된다

```tsx
import { db, posts } from "@/lib/db";

export default async function Page() {
  const allPosts = await db.select().from(posts);

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

\*ORM(Object-Relational Mapping)\*\*은 객체 지향 프로그래밍 언어와 관계형 데이터베이스 사이의 데이터를 자동으로 변환해 주는 기술

1-2. 클라이언트 컴포넌트
클라이언트 컴포넌트에서 데이터를 가져오는 방법은 크게 두 가지입니다.

1. React의 use 훅을 사용합니다.
2. SWR이나 React Query 같은 데이터 통신 라이브러리를 사용합니다.
3. use 훅으로 데이터 스트리밍
   서버 컴포넌트에서 데이터를 먼저 가져온 뒤, 그 결과인 Promise를 클라이언트 컴포넌트에 props로 전달할 수 있습니다. 서버 컴포넌트는 async 함수로 선언할 수 있어 await fetch()를 사용할 수 있지만, 클라이언트 컴포넌트는 async 함수가 될 수 없으므로 렌더링 중 직접 fetch할 수 없습니다.

클라이언트 컴포넌트에서는 전달받은 Promise를 use 훅으로 읽어 데이터를 표시합니다.

# 11주차

## Context provider 실습 코드 설명

### Context 생성 코드 설명 (theme-provider.tsx) – client 컴포넌트

- context를 사용하면 props를 사용하지 않고도 전역적으로 사용할 theme, 언어 설정, 로그인 정보 등을 하위 컴포넌트에 전달할 수 있음

- createContext()는 React 컴포넌트 트리 전체에 값을 공유할 수 있도록 하는 역할을 함

- createContext(...)로 Context 객체를 생성하여, Theme state를 공유 line5 ~

```tsx
5 export const ThemeContext = createContext<{
6  theme: "light" | "drak";
7  toggleTheme: () => void;
}>;
```

- <{...}> 부분은 타입 부분 - line6, 7

* theme: 'light' 또는 'dark' 중 하나
* toggleTheme: 아무 인자도 받지 않고, 반환값도 없는 함수라는 것을 의미

* 초기값(default value)은 provider가 없을 때 사용할 fallback value. line9, 10
  - React에서는 createContext()를 호출할 때 기본값이 반드시 있어야 함
  - 보통은 실제 동작하지 않는 빈 함수(() => {})를 기본으로 넣어둔다
  - 실제 동작은 ThemeProvider 컴포넌트에서 설정하게 된다
  - theme: 'light', toggleTheme: () => {}

```tsx
8 }>({
9  theme: 'light',
10  toggleTheme: ()=> { },
11 })
```

- ThemeProvider 컴포넌트 정의 line 13~

- useState theme 상태 관리 line 18
  : line6 에서도 나왔던 light | dark = TypeScript의 유니온타입 - 초기값 = light

```tsx
const [theme, setTheme] = useState<"light" | "dark">("light");
```

TypeScript의 유니온 타입

- |(파이프)로 여로 타입 연결 - 이 값은 각각의 타입 중 하나가 될 수 있다 지정
- 코드에서 문자열 리터럴 유니온 타입 경우 state 값으로 light or dark만 설정할수 있어 코드 자동완성, 타입 안정성 향상

* useEffect Hook 사용 - 테마(Theme)를 HTML 문서 전체에 적용(전형적 패턴) line 20~24
* useEffect Hook = 컴포넌트가 렌더링된 후 부수효과를 실행하기 위한 함수

```tsx
20 useEffect(() => {
21  if (typeof window !== "undefined") {
22    document.documentElement.dataset.theme = theme;
23  }
24 }, [theme]);
```

- if문 조건절 = 현재 실행 환경 브라우저인지 확인 line 21

* 서버 사이드 렌더링(SSR) 단계 - windoe 객체X
* 서버에서 window 참조 - 오류 (ReferenceError: window is not defined) - typeof window !=='undefined' 는 클라이언트(브라우저) 환경일 때만 실행하라

* line22는 다음과 같은 의미

* `document.documentElement`는 HTML 문서의 `<html>` 요소를 가리킴
* `.dataset.theme`은 `<html>` 태그에 `data-theme` 속성을 설정하는 코드
  ➜ 만일 theme state 값이 `"dark"`라면 다음과 같이 HTML을 반환
  `<html data-theme="dark">`

* useEffect의 두 번째 인자 `[theme]`는 의존성 배열(dependency array) line24

- `theme` 값이 변경될 때마다 `useEffect` 안의 코드가 다시 실행
  ➜ 테마가 바뀔 때마다 HTML의 `data-theme` 속성도 업데이트

* 이 방법을 사용 - CSS에서 속성을 조건으로 스타일을 다르게 지정O

```tsx
20 useEffect(() => {
21  if (typeof window !== "undefined") {
22    document.documentElement.dataset.theme = theme;
23  }
24 }, [theme]);
```

```css
html[data-theme="light"] {
  background-color: white;
  color: black;
}

html[data-theme="dark"] {
  background-color: black;
  color: white;
}
```

- theme state를 3항 연산자를 사용, 토글 setTheme 함수를 이용 - toggleTheme에 저장 line26

```tsx
26 const toggleTheme - () => {setTheme((t) =>
27 (t==='dark' ? 'light' : 'dark'))}
28 return (
29  <ThemeContext.Provider value={{ theme, toggleTheme}}>
30  {children}
31  </ThemeContext.Provider>
)
}
```

## ThemeContext.Provider = ?

- `createContext` 함수를 호출하면, React는 Context 객체 하나를 만들어줌
- 객체 안에는 여러 가지 속성이 있음 대표적인 것 - 두 가지
- `ThemeContext.Provider`, `ThemeContext.Consumer`
- `Provider`는 `createContext()`를 호출 - 자동으로 생성 React 컴포넌트 line28

* 따라서 ThemeContext.Provider 컴포넌트에 현재 theme state와 함께 toggleTheme 함수도 함께 props로 전달 line28

➜ 하위 컴포넌트에서는 현재 theme state를 알 수 없기 때문 - 버튼 쪽으로 toggleTheme 함수와 함께 theme state를 전달하는 것

# 8주차

## Exampleㅇ

### 3-1 client component 사용

- 파일 맨 위 즉 import 위에 use client 지시문 추가 - client componet 생성
- use client는 server와

### 3-2 JS bundle 크기 줄이기

- client JavaScript 번들의 크기를 줄이려면 UI의 큰 부분을 clident component로 표시하는 대신 특정 대화형 component에 "use client" 추가
- <Layout> component = 로고와 탐색 링크와 같으 정적 요소가 대부분 / 대화형 검생창 포함
- <Search /> = 대화형 = client compoenet가 되야 하지만 나머지 layout은 server component로 유지
- 나머지 layout은 server component로 유지.
- <Search />는 사용자와의 상호작용이 바로 이루어질 가능성이 있기 때문에 Client Component로 사용 <Logo />는 상대적으로 중요하지 않고 이미지 등 용량이 큼 - Server Component로 사용하는 것이 좋음

### 3-3 server에서 client component로 데이터 전달

- props를 사용 - server component에서 client component로 데이터 전달 가능
  import LikeButton from '@/app/ui/like-button'
  import { getPost } from '@/lib/data'

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const post = await getPost((await params).id);

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  );
}
```

```tsx
"use client";

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

- import LikeButton from '@/app/ui/like-button': 좋아요 버튼 컴포넌트를 가져옵니다.
- import { getPost } from '@/lib/data': 게시글 데이터를 가져오는 함수를 불러옵니다.
- params: Promise<{ id: string }>: 동적 경로에서 전달되는 게시글 ID를 정의합니다.
- await getPost((await params).id): URL의 ID를 이용해 게시글을 조회합니다.
- <h1>{post.title}</h1>: 게시글 제목을 화면에 표시합니다.
- <LikeButton likes={post.likes} />: 게시글의 좋아요 수를 버튼 컴포넌트에 전달합니다.
- 'use client': LikeButton을 클라이언트 컴포넌트로 지정해 상태 관리와 클릭 이벤트를 사용할 수 있게 합니다.
  참고: 위 코드는 Next.js App Router 기준입니다. params를 Promise로 정의하는 방식은 Next.js 15 이상에서 사용하는 패턴입니다. getPost는 게시글의 id, title, likes를 반환하도록 구현되어 있어야 합니다.

# 4주차

## Link Component

href(required)

```js

```

- root layout 필수 - html 및 body 포함
- subpage layout 필수X

## 중첩 라우트 만들기

- 다중 URL 세그먼트로 구성된 라우트
- /blog/[slug]경로는 세 개의 세그먼트 구성

1. (Root Segment)
2. blog(Segment)
3. [slug] (Leaf Segment)

- 폴더를 계속 중첩하여 중첩된 경로 만들기O
- 특정 블로그 게시물에 대한 경로를 만들려면 blog 안에 새 [slug] 폴더를 만들고 page 파일을 추가
- 폴더 이름을 대괄호 [slug]로 묶으면 데이터에서 여러 페이지를 생성하는데 사용된느 동적 경로 세그먼트 생성 - 블로그 게시물, 제품 페이지 등

## [Next.js에서]

- 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트 정의(폴더가 URL세그먼트가 된다)
- /blog에 대한 경로를 추가하려면 app 디렉터리에 blog 폴더를 만듦
- /blog에 공개적으로 엑세스 할 수 있도록 하려면 page.tsx파일 추가

## [slug]의 이해

- slug는 사이트의 특정 페이지를 쉽게 읽을 수 있는 형태로 식별하는 URL의 일부
- 따라서 데이터에는 slug key가 반드시 있어야 한다

```js
// dummy data

export const posts = [
  {
    slug: "nextjs",
    title: "Next.js 소개",
    content: "Next.js는 React 기반의 풀스택 프레임워크입니다.",
  },
  {
    slug: "routing",
    title: "라우팅",
    content:
      "App Router 알아보기 - Next.js 13부터 App Router가 도입되었습니다.",
  },
  {
    slug: "ssr-ssg",
    title: "SSR vs SSG",
    content: "서버사이드 렌더링과 정적 사이트 생성의 차이를 알아봅니다.",
  },
  {
    slug: "dynamic-routes",
    title: "동적 라우팅",
    content: "Next.js에서 [slug]를 활용한 라우팅 방식입니다.",
  },
];
```

- 예를 들어 첫 번째 데이터를 호출하는 경우라면 /blog/nextjs 라고 호출
- [slug]는 반드시 slug일 필요X / 단, [foo]라고 했다면 데이터에 반드시 foo key(필드)가 있어야함

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

- 3, 4, 5 라인 의미 설명

* async function: 함수를 async로 선언 - 내부에서 await 사용가능
* await 사용이유 - 서버 데이터 읽어 올 때 타임 딜레이에 의한 오류방지
* 매개변수 구조({params}); Next.js가 페이지 호출할 때 props 객체로 {params,searchParams, ...}같은 값 넘기는데 여기서 params만 구조 분해로 받음
* 타입 {params: Promis<{slug: string}>} TypeScript 타입 선언
* params - promise(비동기 값) 명시

## Rendering with search params

- 페이지에 대한 데이터를 로드하기 위해 검색 매개변수가 필요한 경우(페이지 매김, 데이터베이스에서 필터링)사용
- 검색 매개변수가 클라이언트에서만 사용되는 경우(props를 통해 이미 로딩된 목록을 필터링하는 경우)사용

## searchParams

```tsx
/products?category=shoes&page=2
```

- category=shoes, page=2 search parameteres.

- next.js의 app Router에서 searchParams는 이렇게

```tsx
export default function prudectsPage((searchParams)){
    return <p>카테고리: {searchParams.category}</p>;
}
```

- searchParams는 컴포넌트의 props로 전달 내부적으로 URLSearchParams처럼 작동

## 왜 동적 렌더링이 되는가

# 3주차

## Folder and file conventions 폴더 및 파일 규칙

### 라우팅 그룹 및 비공개 폴더 - Route Groups and private folders

- 라우트 그룹을 사용 - URL 변경 안 하고 코드 정리 가능
- 라우팅 되지 않은 파일 = \_folder라는 비공개 디렉토리에 저장

## 병렬 및 가로채기 라우팅

- 슬롯 기반 레이아웃이나 모달 라우팅과 같은 특정 UI 패턴 적합
- 부모 레이아웃에서 렌더링되는 명명된 슬롯 - @slot사용
- 인터셉트 패턴 사용 - URL 변경 없이 현재 레이아웃 내에서 다른 경로 렌더링 가능
- 목록 위에 모달 형태로 상세 보기 표시 사용

| Pattern(docs) | Meanig                  | 일반적 사용 사례                                         |
| :-----------: | ----------------------- | -------------------------------------------------------- |
|    @folder    | 명령된 슬롯             | 사이드바 + 메인 콘텐츠                                   |
|   ()folder    | 동일 레벨 가로채기      | 현재 화면에서 같은 레벨의 다른 페이지를 모달 등으로 표시 |
|   (.)folder   | 한 레벨 위에서 가로채기 | 상위 경로의 페이지를 현재 화면에서 다른 UI 형태로 표시   |
|  (..)folder   | 두 레벨 위에서 가로채기 | 패키지 재사용을 통한 빠른 설치                           |
|  (...)folder  | 루트에서 가로채기       | 현재 경로와 관계없이 루트 기준의 페이지를 가로채서 표시  |

## Open Graph Protocol

- 웹사이트나 페이스북, 인스타, X, 카톡 등 링크 전달할 때 미리보기를 생성하는 프로토콜
- Open Graph Protocol - 대표적 프로토콜

## Organizing your project 프로젝트 구성

- next.js - 파일 구성 어디에 배치할지 제약X
- 프로젝트 체계적으로 구성하는데 도움되는 기능

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

- app 디렉토리에서 중첩된 폴더 - 라우팅 구조 정의
- 각 폴더는 URL의 해당 세그먼트에 맵핑되는 라우팅 세그먼트 표현
- 폴더를 통해 라우트 구조가 정의되도 해당 라우트 세그먼트에 page.js or route.js파일이 추가 되기 전까지 외부에서 해당 라우트 접근 불가
- 팁 - 프로젝트 파일을 app 폴더에 함께 저장할 수는 있지만 그럴 필요X 원한다면 app디렉터리 외부 보관 가능
- app 디렉토리 파일은 기본적으로 안전하게 코로케이션O - 비공개 폴더 불필요 - 이런 경우 유용
- UI로직 라우팅 로직 분리
- 프로젝트와 Next.js 생태계 전반에서 내부 파일 일관 구성
- 코드 편집기서 파일 정렬 그룹화
- 향후 Next.js 파일 규칙과 관련된 잠재적 이름 충돌 방지

#### 알아두면 좋음

- 프레임워크 규칙X 동일한 밑줄 패턴을 사용하여 비공개 폴더 외부 파일을 비공개로 표시하는 것도 고려 가능
- 폴더 이름 앞에 %5F(밑줄로 URL 인코딩된 형태)를 접두사로 붙여 밑줄로 시작하는 URL 세크먼트 만들기 가능 - 아스키 코드의 URL-encoding

## layout template 차이

- layout - 정적(유지형) template - 동적(초기화형)

# 1주차

## pnpm

### Performant NPM 약자 - 고성능 Node 패키지 매니지

- npm, yam과 같은 목적의 패키지 관리자 - 디스크 공간 낭비, 복잡한 의존성 관리, 느린 설치 속도 문제 개선 위해 개발
- 하드 링크 기반의 효율적 저장 공간 활용
- 패키지를 한 번만 설치 - 글로벌 저장소에 저장 - 각 프로젝트 node modules 디렉토리에는 설치된 패키지에 대한 하드 링크(심볼릭 링크) 생성
- 빠른 패키지 생성 속도 - 이미 설치된 패키지 다시 설치x(재사용) - 빠른 설치 속도 체감 가능

## pnpm create next-app@latest

- npm의 npx 대신 pnpm create 사용
- $ pnpm create react-app my-app
- $ cd my-app
- $ re -rf node_modules package-lock.json
- $ pnpm install
- 서버 실행 $ pnpm dev

## 하드링크

### 파일 - 세 부분

- Directory Entry : 파일 이름과 해당 incode 번호를 매핑 정보가 있는 특수한 파일
- incode : 파일 또는 디렉토리에 대한 모든 메타데이터를 저장하는 구조체(권한, 소유자, 크기, 데이터가 블록 위치 등)
- data blocks : 실제 데이터가 존재하는 영역
- 하드링크 생성 - 디렉토리 엔트리에 매핑 정보 추가 - 동일한 incode를 가르킴
- 원본 - 하드링크 동일 파일(원본 사본 개념x)

## Hard link vs. Symbolic link(Soft link)

- 디렉토리 엔트리에 있는 원본 하드링크 - 같은 incode - 데이터 블록 100% 공유
- 원본, 하드링크 중 하나 삭제 - 디렉토리 엔트리 이름만 삭제
- link count - 0 되지 않는 한 데이터 남음

## Soft link

- incode 공유x 경로 문자열 저장해 두는 특수 파일
- 심볼릭 링크 열면 내부에 적힌 경로를 따라가 원본 파일 찾음
- 원본 삭제 - 심볼릭 링크 끊어진 경로 - 이용 불가
- 윈도우의 바로 가기 파일과 비슷
