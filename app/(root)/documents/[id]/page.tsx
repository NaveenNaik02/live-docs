import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  let room: any;
  let usersData: any;
  let currentUserType: any;
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    room = await getDocument({
      roomId: id,
      userId: clerkUser.emailAddresses[0].emailAddress,
    });

    const userIds = Object.keys(room.usersAccesses);
    const users = await getClerkUsers({ userIds });
    usersData = users.map((user: User) => ({
      ...user,
      userType: room.usersAccesses[user.email]?.includes("room:write")
        ? "editor"
        : "viewer",
    }));

    currentUserType = room.usersAccesses[
      clerkUser.emailAddresses[0].emailAddress
    ]?.includes("room:write")
      ? "editor"
      : "viewer";
  } catch (error) {
    console.log(error);
    if (!room) redirect("/");
  }

  if (!room) redirect("/");

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
