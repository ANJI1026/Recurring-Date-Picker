import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("📥 API Received Recurrence Data:", body);

  return NextResponse.json({ success: true, data: body });
}
