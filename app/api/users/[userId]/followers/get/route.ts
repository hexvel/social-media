import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();

    if (!loggedUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          select: {
            followerId: true,
            follower: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user.followers);
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
