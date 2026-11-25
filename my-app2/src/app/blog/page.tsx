import Posts from '@/components/Posts';
import {Suspense} from 'react';
import getPosts from '@/lib/getPosts';

export default async function Page() {

    const posts = await getPosts('https//jsonplaceholder.typicoder.com/posts');

    return (
        Suspense fallback={<div>Loading...</div>}>
            <Posts posts={posts} />
        </Suspense>
    )
}
