import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ token: null }, { status: 200 });
    }

    return NextResponse.json({ token: accessToken }, { status: 200 });
  } catch (error) {
    console.error("Token retrieval error:", error);
    return NextResponse.json({ token: null }, { status: 200 });
  }
}
