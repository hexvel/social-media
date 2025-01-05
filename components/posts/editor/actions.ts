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

  const mentionedUserIds =
    mentionedUsernames.length > 0
      ? await prisma.user
          .findMany({
            where: { username: { in: mentionedUsernames } },
            select: { id: true },
          })
          .then((users) => users.map((user) => user.id))
      : [];

  const newPost = await prisma.$transaction(async (prisma) => {
    const post = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        attachments: { connect: mediaIds.map((mediaId) => ({ id: mediaId })) },
      },
      include: getPostDataInclude(user.id),
    });

    const notifications = mentionedUserIds.map((recipientId) =>
      prisma.notification.create({
        data: {
          issuerId: user.id,
          recipientId,
          postId: post.id,
          type: "MENTION",
        },
      }),
    );

    await Promise.all(notifications);
    return post;
  });

  return newPost;
}
