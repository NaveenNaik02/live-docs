import { liveblocks } from "@/lib/live-blocks";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: "",
    },
  };

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.id,
      groupIds: [],
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
