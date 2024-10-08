"use client";

import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { LinkifyWithPreview } from "../linkify";

import { Media } from "@prisma/client";
import { MessageSquare, VerifiedIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import Comments from "../comments/comment-items";
import FullScreenImage from "../full-screen-image";
import PostsMoreButton from "../posts-more-button";
import { useSession } from "../providers/session-provider";
import UserAvatar from "../user-avatar";
import UserTooltip from "../user-tooltip";
import VideoPlayer from "../video-player";
import BookmarkButton from "./bookmark-button";
import LikeButton from "./like-button";

interface PostsProps {
  post: PostData;
}

export default function Post({ post }: PostsProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const handleImageClick = useCallback((url: string) => {
    setFullScreenImage(url);
  }, []);

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const isPostByCurrentUser = post.user.id === user.id;
  const isLikedByUser = useMemo(
    () => !!post.likes.some((like) => like.userId === user.id),
    [post.likes, user.id],
  );
  const isBookmarkedByUser = useMemo(
    () => post.bookmarks.some((bookmark) => bookmark.userId === user.id),
    [post.bookmarks, user.id],
  );

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link className="select-none" href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="flex items-center gap-x-2 font-medium hover:underline"
              >
                {post.user.displayName}
                <span>
                  {post.user.verified && (
                    <VerifiedIcon className="size-5 fill-sky-600" />
                  )}
                </span>
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {isPostByCurrentUser && (
          <PostsMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <LinkifyWithPreview>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </LinkifyWithPreview>
      {!!post.attachments.length && (
        <MediaPreviews
          attachments={post.attachments}
          onImageClick={handleImageClick}
        />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser,
            }}
          />
          <CommentButton post={post} onClick={toggleComments} />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser,
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
      {fullScreenImage && (
        <FullScreenImage
          url={fullScreenImage}
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
  onImageClick: (url: string) => void;
}

const MediaPreviews = ({ attachments, onImageClick }: MediaPreviewsProps) => {
  const renderPreviews = useMemo(
    () =>
      attachments.map((attachment) => (
        <MediaPreview
          key={attachment.id}
          media={attachment}
          onClick={onImageClick}
        />
      )),
    [attachments, onImageClick],
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {renderPreviews}
    </div>
  );
};

interface MediaPreviewProps {
  media: Media;
  onClick: (url: string) => void;
}

const MediaPreview = ({ media, onClick }: MediaPreviewProps) => {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] cursor-pointer select-none rounded-2xl"
        onClick={() => onClick(media.url)}
      />
    );
  }

  if (media.type === "VIDEO") {
    return <VideoPlayer src={media.url} />;
  }

  return <p className="text-destructive">Unsupported attachment</p>;
};

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

const CommentButton = ({ post, onClick }: CommentButtonProps) => (
  <button onClick={onClick} className="flex items-center gap-2">
    <MessageSquare className="size-5" />
    <span className="text-sm font-medium tabular-nums">
      {post._count.comments} <span className="hidden sm:inline">comments</span>
    </span>
  </button>
);
