import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Pattarapol Na Nakorn",
    studentId: "650610796",
  });
};
