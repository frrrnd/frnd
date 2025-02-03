import { getAccessToken } from '../../components/NowPlaying/spotify-token';

export const GET = async () => {
  try {
    if (!import.meta.env.SPOTIFY_CLIENT_ID ||
        !import.meta.env.SPOTIFY_CLIENT_SECRET ||
        !import.meta.env.SPOTIFY_REFRESH_TOKEN) {
      return new Response(JSON.stringify({
        error: 'Missing required environment variables'
      }), { status: 500 });
    }

    const access_token = await getAccessToken();
   
    if (!access_token) {
      return new Response(JSON.stringify({
        error: 'Failed to get access token'
      }), { status: 500 });
    }

    // Buscar música atual
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Se houver uma música tocando
    if (response.status === 200) {
      const data = await response.json();
     
      if (!data.item) {
        return new Response(JSON.stringify({
          error: 'No track data found in response'
        }), { status: 500 });
      }

      return new Response(JSON.stringify({
        isPlaying: true,
        title: data.item.name,
        artist: data.item.artists.map(artist => artist.name).join(', '),
        albumImageUrl: data.item.album.images[0]?.url,
        songUrl: data.item.external_urls.spotify
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
   
    // Se não houver música tocando, buscar última música
    const recentlyPlayed = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!recentlyPlayed.ok) {
      return new Response(JSON.stringify({
        error: `Recently played request failed with status: ${recentlyPlayed.status}`
      }), { status: recentlyPlayed.status });
    }

    const recentData = await recentlyPlayed.json();
   
    if (!recentData.items || recentData.items.length === 0) {
      return new Response(JSON.stringify({
        error: 'No recently played tracks found'
      }), { status: 404 });
    }

    const track = recentData.items[0].track;
    return new Response(JSON.stringify({
      isPlaying: false,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      albumImageUrl: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Spotify API Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch Spotify data',
      details: error.message
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};