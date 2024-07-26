import TrendsSidebar from "@/components/trends-sidebar";
import { Metadata } from "next";
import SearchResults from "./_components/hastag-result";

export function generateMetadata({
  params: { hashtag },
}: {
  params: { hashtag: string };
}): Metadata {
  return {
    title: `Search hashtags for "${hashtag}"`,
  };
}

export default function Page({
  params: { hashtag },
}: {
  params: { hashtag: string };
}) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search hashtags for &quot;{hashtag}&quot;
          </h1>
        </div>
        <SearchResults hastag={`#${hashtag}`} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
