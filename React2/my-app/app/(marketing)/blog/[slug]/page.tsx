import Link from "next/link";

export default function () {
  return (
    <div>
      <h1>Welcome to the Root Page</h1>
      <Link
        href={{
          pathname: '/blog',
          query: { name: 'test' },
        }}
      
        >Go to Blog
      </Link>
    </div>
  );
}
