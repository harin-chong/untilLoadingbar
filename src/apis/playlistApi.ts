const API_BASE_URL = "https://spotify-yic0.onrender.com";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  items?: {
    total: number;
  };
}

interface PlaylistResponse {
  items: Playlist[];
  total: number;
  next: string | null;
}

export interface PlaylistPage {
  items: Playlist[];
  nextOffset: number;
  hasMore: boolean;
}

export const getMyPlaylists = async (
  accessToken: string,
  offset = 0,
  limit = 20,
): Promise<PlaylistPage> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  const response = await fetch(
    `https://api.spotify.com/v1/me/playlists?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch playlists: ${response.status}`);
  }

  const data: PlaylistResponse = await response.json();

  return {
    items: data.items,
    nextOffset: offset + data.items.length,
    hasMore: data.next !== null,
  };
};

export interface PlaylistTrack {
  added_at?: string | null;
  item: {
    id: string;
    uri?: string;
    name: string;
    duration_ms: number;
    artists: {
      id: string;
      name: string;
    }[];
    album: {
      name: string;
      images: {
        url: string;
        height: number | null;
        width: number | null;
      }[];
    };
  } | null;
}

export interface PlaylistDetail {
  id: string;
  name: string;
  description: string;
  owner?: {
    display_name?: string;
  };
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  items: {
    total: number;
    items: PlaylistTrack[];
  };
}

export const getPlaylistById = async (
  accessToken: string,
  playlistId: string,
): Promise<PlaylistDetail> => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to fetch playlist: ${response.status} ${message}`,
    );
  }

  return (await response.json()) as PlaylistDetail;
};

export interface CreatePlaylistInput {
  name: string;
  description?: string;
  public?: boolean;
}

export const createPlaylist = async (
  accessToken: string,
  input: CreatePlaylistInput,
): Promise<Playlist> => {
  const response = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input.name.trim(),
        description: input.description?.trim() ?? "",
        public: input.public ?? false,
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to create playlist: ${response.status} ${message}`,
    );
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    images: data.images ?? [],
    items: {
      total: 0,
    },
  };
};

/**
 * Add tracks to an existing Spotify playlist.
 * Each URI must look like: spotify:track:TRACK_ID
 */
export const addItemsToPlaylist = async (
  accessToken: string,
  playlistId: string,
  uris: string[],
): Promise<void> => {
  if (uris.length === 0) {
    throw new Error("Select at least one track.");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error?.message ??
        `Failed to add tracks: ${response.status}`,
    );
  }
};

export interface SearchTrack {
  id: string;
  uri: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    name: string;
    images: {
      url: string;
      height: number | null;
      width: number | null;
    }[];
  };
  duration_ms: number;
}

interface TrackSearchResponse {
  items?: SearchTrack[];
  tracks?: {
    items?: SearchTrack[];
  };
}

/**
 * Search Spotify's public catalogue through the backend.
 * The backend should expose GET /api/search?q=...
 */
export const searchTracks = async (
  query: string,
): Promise<SearchTrack[]> => {
  const params = new URLSearchParams({
    q: query.trim(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Track search failed: ${response.status}`);
  }

  const data: TrackSearchResponse = await response.json();

  // Supports either { items: [...] } or { tracks: { items: [...] } }
  return data.items ?? data.tracks?.items ?? [];
};