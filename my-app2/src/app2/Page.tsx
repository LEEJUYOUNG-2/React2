'use client'
import useSWR from 'swr'
import {Suspense} from 'react'

const fetcher =<T,>(url: string): Promise<T> => fetch(url).then((res) => res.json())
type Photo = {
    id: string
    title: string
}
export defulat function Blog2Page() {
    const { data, error, isLoading } = useSWR<Photo[]>(
        'https://jsonplaceholder.typicode.com/photos',
        fetcher
    )
    if(isLoading) return <div>Loading...</div>
    if(error) return <div>Error: {error.message}</div>

    return (
        <>
        <h1>Blog2 Page</h1>
        <Suspense fallback={<div>Loading...</div>}>
            <ul>
                {data?.map((photo) => (
                    <li key={photo.id}>{photo.title}</li>
                ))}
            </ul>
        </Suspense>
        </>
    )
}