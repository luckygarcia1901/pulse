import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, token } = req.query;

  if (!q || !token) {
    return res.status(400).json({ error: 'Missing query or token' });
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q as string)}&type=track&limit=50`,
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

    const tracks = data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      artistId: track.artists[0]?.id || '',
      album: track.album.name,
      imageUrl: track.album.images[0]?.url || null,
      artistImageUrl: null,
      uri: track.uri,
      previewUrl: track.preview_url || null,
    }));

    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).json({ tracks });
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return res.status(500).json({ error: 'Failed to search tracks' });
  }
}
