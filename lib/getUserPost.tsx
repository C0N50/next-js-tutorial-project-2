import React from 'react'

export default async function getUserPosts(userId: string) {

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?usersId=${userId}`, {next: {revalidate:60}})

    if(!res.ok) return undefined

    return res.json()
}
