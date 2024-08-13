import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import Linkify from "@/components/linkify";
import Post from "@/components/posts/post";
import UserAvatar from "@/components/user-avatar";
import UserTooltip from "@/components/user-tooltip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2, VerifiedIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUser: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUser),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return <p className="text-destructive">You&apos;re not logged in</p>;
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About {user.displayName}</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 flex items-center gap-x-2 break-all font-semibold hover:underline">
              {user.displayName}
              {user.verified && (
                <VerifiedIcon className="size-5 fill-sky-600" />
              )}
            </p>
            <p className="line-clamp-1 break-all text-sm text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {loggedInUser.id !== user.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count?.followers ?? 0,
            isFollowedByUser:
              user.followers?.some(
                ({ followerId }) => followerId === user.id,
              ) ?? false,
          }}
        />
      )}
    </div>
  );
}
