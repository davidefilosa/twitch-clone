import { StreamPlayer } from "@/components/stream-player";
import { getSelf } from "@/lib/auth-service";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface CreatorPageProps {
  params: { username: string };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const user = await getUserByUsername(params.username);
  const exsternalUser = await currentUser();

  if (!user || user.externalUserId !== exsternalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer user={user} stream={user.stream} isFollowing />
    </div>
  );
};

export default CreatorPage;
