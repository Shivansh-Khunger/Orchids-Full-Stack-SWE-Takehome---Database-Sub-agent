import { NextRequest, NextResponse } from "next/server";
import { RecentlyPlayedService } from "@/lib/db/services";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const song = await RecentlyPlayedService.getSongById(params.id);

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch song" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();

    if (body.action === "toggle_like") {
      const song = await RecentlyPlayedService.toggleLike(params.id);

      if (!song) {
        return NextResponse.json(
          { success: false, error: "Song not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: song,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update song" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await RecentlyPlayedService.deleteSong(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete song" },
      { status: 500 }
    );
  }
}
