import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const fetchLinkPreview = async (url: string): Promise<PreviewData> => {
  const response = await kyInstance
    .get(`/api/link-preview?url=${encodeURIComponent(url)}`)
    .json<PreviewData>();
  return response;
};

export const useLinkPreview = (url: string) => {
  return useQuery({
    queryKey: ["linkPreview", url],
    queryFn: () => fetchLinkPreview(url),
  });
};
