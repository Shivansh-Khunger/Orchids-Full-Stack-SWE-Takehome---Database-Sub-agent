import { useState, useEffect } from "react";
import { Song, InsertSong } from "@/lib/db/schema";

interface UseRecentlyPlayedReturn {
  songs: Song[];
  loading: boolean;
  error: string | null;
  addSong: (song: InsertSong) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useRecentlyPlayed(
  initialLimit: number = 20
): UseRecentlyPlayedReturn {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/recently-played?limit=${initialLimit}`
      );
      const result = await response.json();

      if (result.success) {
        setSongs(result.data);
      } else {
        setError(result.error || "Failed to fetch songs");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSong = async (songData: InsertSong) => {
    try {
      const response = await fetch("/api/recently-played", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state by adding the new song to the beginning
        setSongs((prev) => [
          result.data,
          ...prev.filter((s) => s.id !== result.data.id),
        ]);
      } else {
        throw new Error(result.error || "Failed to add song");
      }
    } catch (err) {
      console.error("Error adding song:", err);
      throw err;
    }
  };

  const toggleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/recently-played/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "toggle_like" }),
      });

      const result = await response.json();

      if (result.success) {
        setSongs((prev) =>
          prev.map((song) => (song.id === id ? result.data : song))
        );
      } else {
        throw new Error(result.error || "Failed to toggle like");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      throw err;
    }
  };

  const deleteSong = async (id: string) => {
    try {
      const response = await fetch(`/api/recently-played/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setSongs((prev) => prev.filter((song) => song.id !== id));
      } else {
        throw new Error(result.error || "Failed to delete song");
      }
    } catch (err) {
      console.error("Error deleting song:", err);
      throw err;
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch("/api/recently-played", {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setSongs([]);
      } else {
        throw new Error(result.error || "Failed to clear songs");
      }
    } catch (err) {
      console.error("Error clearing songs:", err);
      throw err;
    }
  };

  const refresh = async () => {
    await fetchSongs();
  };

  useEffect(() => {
    fetchSongs();
  }, [initialLimit]);

  return {
    songs,
    loading,
    error,
    addSong,
    toggleLike,
    deleteSong,
    clearAll,
    refresh,
  };
}
