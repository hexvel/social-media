"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const mentionedUsernames = [...content.matchAll(/@([a-zA-Z0-9_]+)/g)].map(
    (match) => match[1],
  );

  const mentionedUsers =
    mentionedUsernames.length > 0
      ? await prisma.user.findMany({
          where: { username: { in: mentionedUsernames } },
          select: { id: true },
        })
      : [];

  const mentionedUserIds = mentionedUsers
    .map((recordUser) => recordUser.id)
    .filter((mentioned) => mentioned !== user.id);

  console.log(mentionedUserIds);

  const newPost = await prisma.$transaction(async (prisma) => {
    const post = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        attachments: { connect: mediaIds.map((mediaId) => ({ id: mediaId })) },
      },
      include: getPostDataInclude(user.id),
    });

    if (mentionedUserIds.length > 0) {
      await prisma.notification.createMany({
        data: mentionedUserIds.map((recipientId) => ({
          issuerId: user.id,
          recipientId,
          postId: post.id,
          type: "MENTION",
        })),
      });
    }

    return post;
  });

  return newPost;
}
