"use client";

import kyInstance from "@/lib/ky";
import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const UsersCount = () => {
  const { data: usersCount } = useQuery({
    queryKey: ["usersCount"],
    queryFn: () => kyInstance.get("/api/users/count").json<number>(),
  });

  console.log(usersCount);

  return (
    <>
      {!usersCount ? (
        <Loader2 className="mx-auto my-3 animate-spin" />
      ) : (
        <span className="font-semibold">
          {formatNumber(usersCount!)} {usersCount === 1 ? "user" : "users"}
        </span>
      )}
    </>
  );
};

export default UsersCount;
