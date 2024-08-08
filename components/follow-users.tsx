import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import Link from "next/link";
import FollowButton from "./follow-button";
import UserAvatar from "./user-avatar";
import UserTooltip from "./user-tooltip";

export default async function FollowUsers() {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const usersToFoolow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFoolow.map((user) => (
        <div key={user.id} className="gap-3- flex items-center justify-between">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>

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
        </div>
      ))}
    </div>
  );
}
