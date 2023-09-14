import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();

  const roomId = request.nextUrl.searchParams.get("roomId");
  const foundRoomid = DB.messages.find((r) => r.roomId === roomId);
  if (!foundRoomid) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  let filered = DB.messages;
  if (roomId !== null) {
    filered = filered.filter((db) => db.roomId === roomId);
  }
  return NextResponse.json({
    ok: true,
    message: filered,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  readDB();
  const { roomId, messageText } = body;
  const foundRoomid = DB.messages.find((r) => r.roomId === roomId);
  if (!foundRoomid) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const body = await request.json();
  const payload = checkToken();
  const { messageId } = body;
  if (payload === null || payload.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  const foundMessagesId = DB.messages.find((r) => r.messageId === messageId);
  if (!foundMessagesId) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  const foundIndex = DB.messages.findIndex((x) => x.messageId === messageId);
  DB.messages.splice(foundIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
