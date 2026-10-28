import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Next.js 학습 페이지</h1>
      <p>RootLayout과 연계되는 메인 페이지입니다.</p>

      <hr />

      <h2>학습 메뉴</h2>
      <ul>
        <li>
          <Link href="/nextjs">Next.js 소개</Link>
        </li>
        <li>
          <Link href="/routing">App Router 알아보기</Link>
        </li>
        <li>
          <Link href="/ssr-ssg">SSR vs SSG</Link>
        </li>
        <li>
          <Link href="/dynamic-routes">동적 라우팅</Link>
        </li>
        <li>
          <Link href="/counter">Counter 예제</Link>
        </li>
      </ul>

      <hr />

      <h2>환영합니다!</h2>
      <p>상단 메뉴를 이용해 Next.js의 다양한 기능을 학습해 보세요.</p>
    </div>
  );
}
