import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Action } from "./_components/action";
import { isBlockedByUser } from "@/lib/block-service";

interface UserPageProps {
  params: { username: string };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);

  return (
    <div>
      isFollowing: {JSON.stringify(isFollowing)}
      <Action userId={user.id} isFollowing={isFollowing} />
    </div>
  );
};

export default UserPage;
