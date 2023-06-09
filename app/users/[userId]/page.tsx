import React from "react";
import getUser from "@/lib/getUser";
import getUserPosts from "@/lib/getUserPost";
import { Suspense } from "react";
import { Http2ServerRequest } from "http2";
import UserPosts from "./components/UserPosts";
import type { Metadata } from "next";
import getAllUsers from "@/lib/getAllUsers";

import { notFound } from 'next/navigation';

type Params = {
  params: {
    userId: string;
  };
};

export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId);
  const user: User = await userData 

  if(!user?.name) {
    return {
      title:"User not found"
    }
  }

  return {
    title: user.name,
    description: `${user.name} Page`
  }
}

export default async function UserPage({ params: { userId } }: Params) {
  const userData: Promise<User> = getUser(userId);
  const userPostsData: Promise<Post[]> = getUserPosts(userId);

  const user = await userData;

  if(!user?.name) return notFound();

  // const [user, userPosts] = await Promise.all([userData, userPostsData])
  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        {/*  @ts-ignore Server Component */}
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers();
  const users = await usersData;

  return users.map(user => {
    return (
      { userId: user.id.toString() }
    )})
}