export default function AboutLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
    >
      <body>
        <header> About Layout Header</header>
          {children}
        <footer> About Layout Footer</footer>
      </body>
    </html>
  );
}
