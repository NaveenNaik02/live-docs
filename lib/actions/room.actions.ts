"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../live-blocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

const createDocument = async ({ userId, email }: CreateDocumentParams) => {
  debugger;
  const roomId = nanoid();
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error occurred while creating room: ${error}`);
  }
};

const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    // if (!hasAccess) {
    //   throw new Error("You do not have access to this document");
    // }

    return parseStringify(room);
  } catch (error) {
    console.error(`Error happened while getting a room: ${error}`);
  }
};

const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.error(`Error happened while updating the room title:${error}`);
  }
};

const getAllDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(rooms);
  } catch (error) {
    console.error(`Error happened while fetching rooms: ${error}`);
  }
};

export { createDocument, getDocument, updateDocument, getAllDocuments };
