import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();

    if (!loggedUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedUser.id,
          postId,
        },
      },
    });

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();

    if (!loggedUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bookmark.upsert({
      where: {
        userId_postId: {
          userId: loggedUser.id,
          postId,
        },
      },
      create: {
        userId: loggedUser.id,
        postId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();

    if (!loggedUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedUser.id,
        postId,
      },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
