const API_URL = process.env.EXPO_PUBLIC_API_URL;
const CLIENT_ID = '3521f783585d45fe9d07a0657284aeac';
const CLIENT_SECRET = 'eb74d8cea5ff4487acabf780cae5ef42';

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

const encodeBase64 = (str: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    let i = 0;
    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;
      const bitmap = (a << 16) | (b << 8) | c;
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
    }
    return result;
  }
};

const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  
  // Return cached token if still valid
  if (accessToken && tokenExpiresAt > now) {
    return accessToken as string;
  }

  try {
    // Use Vercel backend if API_URL is set, otherwise use direct Spotify auth
    if (API_URL) {
      const response = await fetch(`${API_URL}/api/spotify/token`);
      if (!response.ok) {
        throw new Error('Failed to get Spotify access token from backend');
      }
      const data = await response.json();
      accessToken = data.access_token;
      tokenExpiresAt = now + (data.expires_in * 1000);
      return accessToken as string;
    } else {
      // Fallback: Direct Spotify authentication for testing
      const credentials = encodeBase64(CLIENT_ID + ':' + CLIENT_SECRET);
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + credentials,
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify access token');
      }

      const data = await response.json();
      accessToken = data.access_token;
      tokenExpiresAt = now + (data.expires_in * 1000);
      return accessToken as string;
    }
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

    if (API_URL) {
      // Use Vercel backend
      const response = await fetch(
        `${API_URL}/api/spotify/search?q=${encodeURIComponent(query)}&token=${token}`
      );

      if (!response.ok) {
        throw new Error('Failed to search Spotify');
      }

      const data = await response.json();
      console.log('Vercel response:', data);
      return Array.isArray(data.tracks) ? data.tracks : [];
    } else {
      // Direct Spotify API call
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search Spotify');
      }

      const data = await response.json();
      console.log('Spotify search response:', JSON.stringify(data, null, 2));
      
      if (!data.tracks || !data.tracks.items) {
        console.error('No tracks in response');
        return [];
      }
      
      const tracks = data.tracks.items;
      console.log('Found tracks:', tracks.length);
      
      return tracks.map((track: any) => {
        console.log('Processing track:', track.name);
        return {
          id: track.id,
          name: track.name,
          artist: track.artists?.[0]?.name || 'Unknown',
          artistId: track.artists?.[0]?.id || '',
          album: track.album?.name || 'Unknown',
          imageUrl: track.album?.images?.[0]?.url || null,
          artistImageUrl: null,
          uri: track.uri,
          previewUrl: track.preview_url,
        };
      });
    }
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
  }
};

export const getTrackInfo = async (trackId: string): Promise<SpotifyTrack | null> => {
  try {
    const token = await getAccessToken();

    if (API_URL) {
      // Use Vercel backend
      const response = await fetch(
        `${API_URL}/api/spotify/search?q=${encodeURIComponent(trackId)}&token=${token}`
      );

      if (!response.ok) {
        throw new Error('Failed to get track info');
      }

      const data = await response.json();
      return data.tracks?.[0] || null;
    } else {
      // Direct Spotify API call
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get track info');
      }

      const track = await response.json();
      return {
        id: track.id,
        name: track.name,
        artist: track.artists?.[0]?.name || 'Unknown',
        artistId: track.artists?.[0]?.id || '',
        album: track.album?.name || 'Unknown',
        imageUrl: track.album?.images?.[0]?.url || null,
        artistImageUrl: null,
        uri: track.uri,
        previewUrl: track.preview_url,
      };
    }
  } catch (error) {
    console.error('Error getting track info:', error);
    return null;
  }
};

export const getArtistImage = async (artistId: string): Promise<string | null> => {
  try {
    const token = await getAccessToken();

    if (API_URL) {
      // Use Vercel backend
      const response = await fetch(
        `${API_URL}/api/spotify/artist?artistId=${artistId}&token=${token}`
      );

      if (!response.ok) {
        throw new Error('Failed to get artist info');
      }

      const data = await response.json();
      return data.imageUrl || null;
    } else {
      // Direct Spotify API call
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get artist info');
      }

      const data = await response.json();
      return data.images?.[0]?.url || null;
    }
  } catch (error) {
    console.error('Error getting artist image:', error);
    return null;
  }
};
