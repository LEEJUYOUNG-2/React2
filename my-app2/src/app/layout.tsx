// # Context provider 실습

// # 다음은 RootLayout의 추가/수정 사항입니다.

import Link from "next/link";
import ThemeProvider from "@/components/theme-provider";
import ThemeStatus from "@/components/theme-status";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <header>
            <p>=== Root Layout Header ===</p>
            <nav>
              <Link href="/">Home</Link> | <Link href="/counter">Counter</Link>
              <br />
              <br />
              Slug Page Menu: &nbsp;
              <Link href="/nextjs">nextjs</Link>&nbsp; | &nbsp;
              <Link href="/routing">routing</Link>&nbsp; | &nbsp;
              <Link href="/ssr-ssg">ssr-ssg</Link>&nbsp; | &nbsp;
              <Link href="/dynamic-routes">dynamic-routes</Link>
              <br />
              <br /># interleaving 예제:{" "}
              <Link href="/interleaved">interleaving 예제</Link>
            </nav>
            <ThemeStatus />
          </header>
          <main>{children}</main>
          <footer>=== Root Layout Footer ===</footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
