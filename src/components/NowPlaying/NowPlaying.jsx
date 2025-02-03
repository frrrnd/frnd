import React, { useState, useEffect } from 'react';

const SpotifyNowPlaying = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        // Usa a URL base do site atual
        const baseUrl = import.meta.env.DEV 
          ? 'http://localhost:1234' // Porta padrão do Astro
          : ''; // Em produção, usa path relativo
        
        const response = await fetch(`${baseUrl}/api/spotify`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        
        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-sm bg-neutral-50">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 animate-pulse bg-neutral-200 rounded" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-2/3 animate-pulse bg-neutral-200 rounded" />
              <div className="h-4 w-1/2 animate-pulse bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm bg-red-50">
        <div className="p-4">
          <div className="flex items-center space-x-2 text-red-500">
            <span role="img" aria-label="música">🎵</span>
            <span>Erro ao carregar dados do Spotify: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  const { isPlaying, albumImageUrl, title, artist, songUrl } = data || {};

  return (
    <div className="w-full max-w-sm spotify-player">
      <div>
        <a
          href={songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-4"
        >
          {albumImageUrl ? (
            <img
              src={albumImageUrl}
              alt={`${title} capa do álbum`}
              className="h-16 w-16 rounded shadow"
            />
          ) : (
            <div className="h-16 w-16 bg-neutral-200 rounded flex items-center justify-center">
              <span role="img" aria-label="música" className="text-2xl">🎵</span>
            </div>
          )}
          
          <div className="flex-1 space-y-1 min-w-0">
            <h3 className="truncate">
              {title || 'Nada tocando'}
            </h3>
            <p className="truncate">
              {artist || 'Spotify'}
            </p>
            <div className="flex items-center space-x-1">
              {isPlaying ? (
                <>
                  <div className="playing-bars playing">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="text-xs">Now playing</span>
                </>
              ) : (
                <>
                  <div className="playing-bars stoped">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="text-xs text-neutral-500">Last played</span>
                </>
              )}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default SpotifyNowPlaying;