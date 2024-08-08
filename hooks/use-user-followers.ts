import kyInstance from "@/lib/ky";
import { UserDataWithFollowInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useUserFollowers = (userId: string) => {
  const query = useQuery({
    queryKey: ["user-followers", userId],
    queryFn: () =>
      kyInstance
        .get(`/api/users/${userId}/followers/get`)
        .json<UserDataWithFollowInfo[]>(),
  });

  return query;
};
