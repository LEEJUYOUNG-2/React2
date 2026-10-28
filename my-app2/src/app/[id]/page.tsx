import LikeButton from "../ui/LikeButton";
import { posts } from "../lib/data";
import { notFound } from "next/navigation";

// 문서에서는 다음 구문을 풀어서 작성했지만 한 줄로하는 것이 더 명확하다
// export default async function PostPage({ params }: { params: { id: string } }) {

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // posts에서 슬러그에 해당하는 포스트를 찾습니다.
  // posts 배열에서 해당 ID의 포스트를 찾습니다.
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <main>
        <h1>{post.title}</h1>
        {/*...*/}
        <LikeButton likes={post.likes ?? 0} />
      </main>
    </>
  );
}
//<LikeButton likes={post.likes} />
