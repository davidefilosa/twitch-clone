import { prismadb } from "./prismadb";

export const getUserByUsername = async (username: string) => {
  const user = await prismadb.user.findUnique({
    where: { username },
  });

  return user;
};
