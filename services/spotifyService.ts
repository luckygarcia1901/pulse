const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  album: string;
  imageUrl: string | null;
  artistImageUrl: string | null;
  uri: string;
  previewUrl: string | null;
}

const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  
  // Return cached token if still valid
  if (accessToken && tokenExpiresAt > now) {
    return accessToken as string;
  }

  try {
    const response = await fetch(`${API_URL}/api/spotify/token`);

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in * 1000);

    return accessToken as string;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
};

export const searchTracks = async (query: string): Promise<SpotifyTrack[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${API_URL}/api/spotify/search?q=${encodeURIComponent(query)}&token=${token}`
    );

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data = await response.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
  }
};

export const getTrackInfo = async (trackId: string): Promise<SpotifyTrack | null> => {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${API_URL}/api/spotify/search?q=${encodeURIComponent(trackId)}&token=${token}`
    );

    if (!response.ok) {
      throw new Error('Failed to get track info');
    }

    const data = await response.json();
    return data.tracks?.[0] || null;
  } catch (error) {
    console.error('Error getting track info:', error);
    return null;
  }
};

export const getArtistImage = async (artistId: string): Promise<string | null> => {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${API_URL}/api/spotify/artist?artistId=${artistId}&token=${token}`
    );

    if (!response.ok) {
      throw new Error('Failed to get artist info');
    }

    const data = await response.json();
    return data.imageUrl || null;
  } catch (error) {
    console.error('Error getting artist image:', error);
    return null;
  }
};
