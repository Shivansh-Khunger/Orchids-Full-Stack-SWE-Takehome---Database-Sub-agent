import { NextRequest, NextResponse } from "next/server";
import { RecentlyPlayedService } from "@/lib/db/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const songs = await RecentlyPlayedService.getMostPlayed(limit);

    return NextResponse.json({
      success: true,
      data: songs,
      count: songs.length,
    });
  } catch (error) {
    console.error("Error fetching most played songs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch most played songs" },
      { status: 500 }
    );
  }
}
