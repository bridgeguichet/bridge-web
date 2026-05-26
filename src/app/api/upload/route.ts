import { NextResponse } from "next/server";

import { cloudinary } from "@/lib/cloudinary";

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "bridge-marketplace",
      },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return NextResponse.json({ error: "Failed to generate upload signature" }, { status: 500 });
  }
}
