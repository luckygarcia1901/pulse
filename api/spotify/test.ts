import { VercelRequest, VercelResponse } from '@vercel/node';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

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

  try {
    // Get token
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // Test search
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=test&type=track&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const searchData = await searchResponse.json();

    return res.status(200).json({
      token_obtained: !!token,
      search_status: searchResponse.status,
      tracks_found: searchData.tracks?.items?.length || 0,
      full_response: searchData,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
