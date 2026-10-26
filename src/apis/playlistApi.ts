
export interface Playlist {
  id: string;
  name: string;
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
  limit = 20
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
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch playlists: ${response.status}`
    );
  }

  const data: PlaylistResponse = await response.json();

  return {
    items: data.items,
    nextOffset: offset + data.items.length,
    hasMore: data.next !== null,
  };
};





export interface PlaylistTrack {
  item: {
    id: string;
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
  playlistId: string
): Promise<PlaylistDetail> => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to fetch playlist: ${response.status} ${message}`
    );
  }

  const data = await response.json();

console.log("Playlist API response:", data);
console.log(
  "First playlist item:",
  JSON.stringify(data.items?.items?.[0], null, 2)
);

return data as PlaylistDetail;
};
