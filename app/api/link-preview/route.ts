import kyInstance from "@/lib/ky";
import { load } from "cheerio";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || "";

  if (!url || url === "") {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  try {
    const data = await kyInstance.get(url).text();
    const $ = load(data);

    const getMetaTag = (name: string) =>
      $(`meta[name=${name}]`).attr("content") ||
      $(`meta[property=${name}]`).attr("content");

    const previewData = {
      title: $("title").text(),
      description: getMetaTag("og:description") || getMetaTag("description"),
      image: getMetaTag("og:image"),
      url: getMetaTag("og:url") || url,
    };

    return Response.json(previewData);
  } catch (error) {
    return Response.json({ error: "Invalid url" }, { status: 400 });
  }
}
