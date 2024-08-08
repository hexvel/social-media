"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserFollowers } from "@/hooks/use-user-followers";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import FollowButton from "./follow-button";
import UserAvatar from "./user-avatar";
import UserTooltip from "./user-tooltip";

export default function UserFollowersDialog({
  userId,
  data,
}: {
  userId: string;
  data: FollowerInfo;
}) {
  const { data: usersToFollow } = useUserFollowers(userId);

  if (!usersToFollow) return null;

  console.log(usersToFollow);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer hover:underline">
          Followers:{" "}
          <span className="font-semibold">{formatNumber(data.followers)}</span>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Users in followers</DialogTitle>
        </DialogHeader>
        {usersToFollow.length === 0 && <p>No users in followers</p>}
        {usersToFollow.length > 0 &&
          usersToFollow.map((user) => (
            <div
              key={user.follower.id}
              className="gap-3- flex items-center justify-between"
            >
              <UserTooltip user={user}>
                <Link
                  href={`/users/${user.follower.username}`}
                  className="flex items-center gap-3"
                >
                  <UserAvatar
                    avatarUrl={user.follower.avatarUrl}
                    className="flex-none"
                  />
                  <div>
                    <p className="line-clamp-1 break-all font-semibold hover:underline">
                      {user.follower.displayName}
                    </p>
                    <p className="line-clamp-1 break-all text-muted-foreground">
                      @{user.follower.username}
                    </p>
                  </div>
                </Link>
              </UserTooltip>

              <FollowButton
                userId={user.follower.id}
                initialState={{
                  followers: user._count?.followers ?? 0,
                  isFollowedByUser:
                    user.followers?.some(
                      ({ followerId }) => followerId === user.follower.id,
                    ) ?? false,
                }}
              />
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}
