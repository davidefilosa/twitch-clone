import { getSelf } from "./auth-service";
import { prismadb } from "./prismadb";

export const isBlockedByUser = async (id: string) => {
  try {
    const self = await getSelf();
    const otherUser = await prismadb.user.findUnique({ where: { id } });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return false;
    }

    const existingBlock = await prismadb.block.findUnique({
      where: {
        blockerId: otherUser.id,
        blockedId: self.id,
      },
    });

    return !!existingBlock;
  } catch {
    return false;
  }
};

export const blockUser = async (id: string) => {
  const self = await getSelf();
  const otherUser = await prismadb.user.findUnique({ where: { id } });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (self.id === otherUser.id) {
    throw new Error("Cannot block yourself");
  }

  const existingBlock = await prismadb.block.findUnique({
    where: { blockerId: self.id, blockedId: otherUser.id },
  });

  if (existingBlock) {
    throw new Error("Already blocked");
  }

  const block = await prismadb.block.create({
    data: { blockerId: self.id, blockedId: otherUser.id },
    include: {
      blocked: true,
    },
  });

  return block;
};

export const unblockUser = async (id: string) => {
  const self = await getSelf();
  const otherUser = await prismadb.user.findUnique({ where: { id } });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (self.id === otherUser.id) {
    throw new Error("Cannot unblock yourself");
  }

  const existingBlock = await prismadb.block.findUnique({
    where: { blockerId: self.id, blockedId: otherUser.id },
  });

  if (!existingBlock) {
    throw new Error("Not blocked");
  }

  const unblock = await prismadb.block.delete({
    where: { blockerId: self.id, blockedId: otherUser.id },
    include: { blocked: true },
  });

  return unblock;
};

export const getBlockedUsers = async () => {
  const self = await getSelf();

  const blockedUsers = await prismadb.block.findMany({
    where: { blockerId: self.id },
    include: { blocked: true },
  });

  return blockedUsers;
};
