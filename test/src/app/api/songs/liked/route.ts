import { NextResponse } from "next/server";
import { RecentlyPlayedService } from "@/lib/db/services";

export async function GET() {
  try {
    const songs = await RecentlyPlayedService.getLikedSongs();

    return NextResponse.json({
      success: true,
      data: songs,
      count: songs.length,
    });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch liked songs" },
      { status: 500 }
    );
  }
}
