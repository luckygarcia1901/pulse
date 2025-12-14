import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { artistId, token } = req.query;

  if (!artistId || !token) {
    return res.status(400).json({ error: 'Missing artistId or token' });
  }

  try {
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

    const artist = await response.json();
    const imageUrl = artist.images[0]?.url || null;

    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error getting artist image:', error);
    return res.status(500).json({ error: 'Failed to get artist image' });
  }
}
