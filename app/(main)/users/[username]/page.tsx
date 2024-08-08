import { validateRequest } from "@/auth"
import TrendSiderbar from "@/components/trends-sidebar"
import prisma from "@/lib/prisma"
import { getUserDataSelect } from "@/lib/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import UserPosts from "./_components/user-posts"
import UserProfile from "./_components/user-profile"

interface UserPageProps {
  params: {
    username: string;
  };
}

const getUser = cache(async (username: string, loggedUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
    description: user.bio,
  };
}

export default async function UserProfilePage({
  params: { username },
}: UserPageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return <p className="text-destructive">You&apos;re not logged in</p>;
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUser={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s Posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendSiderbar />
    </main>
  );
}
