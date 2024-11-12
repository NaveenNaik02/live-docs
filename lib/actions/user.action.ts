"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../live-blocks";

const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );
    return parseStringify(sortedUsers);
  } catch (error) {
    console.error(`Error while fetching the users: ${error}`);
  }
};

const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length) {
      const lowerCaseTex = text.toLocaleLowerCase();
      const filteredUsers = users.filter((email: string) =>
        email.toLocaleLowerCase().includes(lowerCaseTex)
      );
      return parseStringify(filteredUsers);
    }
    return parseStringify(users);
  } catch (error) {
    console.log(`Error fetching the document user: ${error}`);
  }
};

export { getClerkUsers, getDocumentUsers };
