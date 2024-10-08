import { useLinkPreview } from "@/hooks/use-link-preview";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const LinkPreview = ({ children }: { children: ReactNode }) => {
  const [url, setUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: preview, isLoading } = useLinkPreview(url);

  useEffect(() => {
    const extractUrl = () => {
      if (containerRef.current) {
        const text = containerRef.current.innerText;
        const urlMatch = text.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          setUrl(urlMatch[0]);
        }
      }
    };

    extractUrl();
  }, [children]);

  return (
    <div ref={containerRef}>
      {children}
      {!url || (isLoading && <Loader2 className="mx-auto my-3 animate-spin" />)}
      {preview && (
        <Link
          href={preview.url}
          target="_blank"
          className="mt-8 flex cursor-pointer flex-col items-center gap-y-4 rounded-xl px-2 py-6 shadow-lg dark:bg-violet-950/40"
        >
          {preview.image && (
            <img
              className="rounded-xl"
              src={preview.image}
              alt={preview.title}
            />
          )}
          <h3 className="text-2xl font-medium">{preview.title}</h3>
        </Link>
      )}
    </div>
  );
};

export default LinkPreview;
