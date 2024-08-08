"use client";

import useFollowerInfo from "@/hooks/use-followers-info";
import { FollowerInfo } from "@/lib/types";
import UserFollowersDialog from "./user-followers-dialog";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  return <UserFollowersDialog userId={userId} data={data} />;
};

export default FollowerCount;
