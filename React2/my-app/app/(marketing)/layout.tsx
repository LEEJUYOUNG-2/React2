export default function MarketingLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
    >
      <body>
        <header> Marketing Layout Header</header>
          {children}
        <footer> Marketing Layout Footer</footer>
      </body>
    </html>
  );
}
