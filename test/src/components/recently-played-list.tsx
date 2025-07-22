"use client";

import { Heart, Play, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRecentlyPlayed } from "@/hooks/use-recently-played";
import { InsertSong } from "@/lib/db/schema";

interface RecentlyPlayedListProps {
  onPlayTrack?: (track: any) => void;
}

export default function RecentlyPlayedList({
  onPlayTrack,
}: RecentlyPlayedListProps) {
  const { songs, loading, error, addSong, toggleLike, deleteSong, clearAll } =
    useRecentlyPlayed(50);
  const [addingDemo, setAddingDemo] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  const addDemoSong = async () => {
    setAddingDemo(true);
    const demoSongs: InsertSong[] = [
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: 200,
        albumArt:
          "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        spotifyId: "0VjIjW4GlULA4tCtM2YRz6",
      },
      {
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        duration: 233,
        albumArt:
          "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        spotifyId: "7qiZfU4dY1lWllzX7mPBI3",
      },
      {
        title: "Someone Like You",
        artist: "Adele",
        album: "21",
        duration: 285,
        albumArt:
          "https://i.scdn.co/image/ab67616d0000b273372eb33d8be9898fc4b7ffb3",
        spotifyId: "5Fv8U92rVy6yEd7K1MKUsD",
      },
    ];

    try {
      for (const song of demoSongs) {
        await addSong(song);
        // Small delay to simulate realistic timing
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error("Error adding demo songs:", error);
    } finally {
      setAddingDemo(false);
    }
  };

  const handlePlayTrack = (song: any) => {
    // Add to recently played when track is played
    const trackData: InsertSong = {
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      albumArt: song.albumArt,
      spotifyId: song.spotifyId,
    };

    addSong(trackData).catch(console.error);
    onPlayTrack?.(song);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Recently Played
        </h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-2 animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Recently Played
        </h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          Error loading recently played songs: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Recently Played
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={addDemoSong}
            disabled={addingDemo}
            className="px-4 py-2 bg-[var(--color-primary)] text-black rounded-full text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50"
          >
            {addingDemo ? "Adding..." : "Add Demo Songs"}
          </button>
          {songs.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:scale-105 transition-transform"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          <p className="text-lg mb-4">No recently played songs yet.</p>
          <p className="text-sm">
            Play some music or add demo songs to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="group flex items-center space-x-4 p-2 rounded-lg hover:bg-[var(--color-interactive-hover)] transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative">
                  <img
                    src={song.albumArt || "/placeholder-album.png"}
                    alt={song.album}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                    <button
                      onClick={() => handlePlayTrack(song)}
                      className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--color-text-primary)] truncate">
                    {song.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">
                    {song.artist} • {song.album}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {song.playedAt && formatDate(new Date(song.playedAt))} •
                    Played {song.playCount || 1} times
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleLike(song.id)}
                  className={`p-2 rounded-full hover:bg-[var(--color-interactive-hover)] transition-colors ${
                    song.isLiked
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${song.isLiked ? "fill-current" : ""}`}
                  />
                </button>

                <span className="text-sm text-[var(--color-text-secondary)] min-w-[3rem] text-right">
                  {formatDuration(song.duration)}
                </span>

                <button
                  onClick={() => deleteSong(song.id)}
                  className="p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {songs.length > 0 && (
        <div className="text-center text-sm text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border)]">
          Showing {songs.length} recently played songs
        </div>
      )}
    </div>
  );
}
