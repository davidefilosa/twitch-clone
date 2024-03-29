import { getSelf } from "./auth-service";
import { prismadb } from "./prismadb";

export const getRecommended = async () => {
  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let users = [];

  if (userId) {
    users = await prismadb.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: userId,
            },
          },
          {
            followedBy: {
              some: {
                followerId: userId,
              },
            },
          },
          {
            blockedBy: {
              some: { blockerId: userId },
            },
          },
        ],
      },
      include: { stream: { select: { isLive: true } } },
      orderBy: { createdAt: "desc" },
    });
  } else {
    users = await prismadb.user.findMany({
      include: { stream: { select: { isLive: true } } },
      orderBy: { createdAt: "desc" },
    });
  }
  return users;
};
