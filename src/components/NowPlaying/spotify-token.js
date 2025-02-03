// src/utils/spotify-token.js
const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

// Validação inicial das variáveis de ambiente
if (!client_id || !client_secret || !refresh_token) {
  console.error('Missing required environment variables:', {
    hasClientId: !!client_id,
    hasClientSecret: !!client_secret,
    hasRefreshToken: !!refresh_token
  });
  throw new Error('Missing required Spotify credentials');
}

// Função para codificar em base64
const toBase64 = (str) => {
  try {
    if (typeof window !== 'undefined') {
      return window.btoa(str);
    } else {
      return Buffer.from(str).toString('base64');
    }
  } catch (error) {
    console.error('Error encoding to base64:', error);
    throw new Error('Failed to encode credentials');
  }
};

const basic = toBase64(`${client_id}:${client_secret}`);
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SCOPES = 'user-read-currently-playing user-read-recently-played';

// Função para obter um novo access token usando o refresh token
const getAccessToken = async () => {
  try {
    console.log('Iniciando requisição do token...'); // Debug

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        scope: SCOPES
      }),
    });

    console.log('Status da resposta:', response.status); // Debug

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Token request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.access_token) {
      console.error('Resposta sem access token:', data);
      throw new Error('No access token in response');
    }

    console.log('Token obtido com sucesso'); // Debug
    return data.access_token;
  } catch (error) {
    console.error('Erro ao obter access token:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export { getAccessToken };