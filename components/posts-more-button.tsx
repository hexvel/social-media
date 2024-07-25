"use client";

import { PostData } from "@/lib/types";
import { MoreHorizontalIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import DeletePostDialog from "./delete-post-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PostsMoreButtonProps {
  post: PostData;
  className?: string;
}

export default function PostsMoreButton({
  post,
  className,
}: PostsMoreButtonProps) {
  const [showDeletePostDialog, setShowDeletePostDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontalIcon className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeletePostDialog(true)}>
            <span className="flex items-center gap-3 text-destructive dark:text-white">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDeletePostDialog}
        onClose={() => setShowDeletePostDialog(false)}
      />
    </>
  );
}
