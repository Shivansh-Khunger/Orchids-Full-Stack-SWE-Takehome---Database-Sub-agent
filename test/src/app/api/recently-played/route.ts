import { NextRequest, NextResponse } from "next/server";
import { RecentlyPlayedService } from "@/lib/db/services";
import { insertSongSchema } from "@/lib/db/schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const songs = await RecentlyPlayedService.getRecentlyPlayed(limit, offset);

    return NextResponse.json({
      success: true,
      data: songs,
      count: songs.length,
    });
  } catch (error) {
    console.error("Error fetching recently played songs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recently played songs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = insertSongSchema.parse(body);

    const song = await RecentlyPlayedService.addSong(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: song,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error adding recently played song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add song to recently played" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await RecentlyPlayedService.clearAll();

    return NextResponse.json({
      success: true,
      message: "All recently played songs cleared",
    });
  } catch (error) {
    console.error("Error clearing recently played songs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear recently played songs" },
      { status: 500 }
    );
  }
}
