import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const count = await prisma.user.count();
    return Response.json(count);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
