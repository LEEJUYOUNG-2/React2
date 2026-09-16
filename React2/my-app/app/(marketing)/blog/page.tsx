export default async function BlogPage() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return (
        <div>
        Blog 페이지
        </div>
);
}
