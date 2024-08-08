import { Loader2 } from "lucide-react"
import { Suspense, useCallback } from "react"
import FollowUsers from "./follow-users"
import TrendingTopics from "./trending-topics"

export default function TrendSiderbar() {
  const renderFollowUsers = useCallback(() => <FollowUsers />, []);
  const renderTrendingTopics = useCallback(() => <TrendingTopics />, []);

  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {renderFollowUsers()}
        {renderTrendingTopics()}
      </Suspense>
    </div>
  );
}
