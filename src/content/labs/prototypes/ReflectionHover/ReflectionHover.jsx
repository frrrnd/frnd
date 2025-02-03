import React from 'react';
import "./ReflectionHover.css"

const AlbumList = () => {
  const albums = [
    {
      artwork: 'https://i.scdn.co/image/ab67616d0000b273b19a27e6309ca60342718df8',
      title: 'Synthetic Love',
      artist: 'Trevor Something'
    },
    {
      artwork: 'https://i.scdn.co/image/ab67616d0000b273d6d8c2eaa1f9031b62f7a3f7',
      title: 'Nightcall',
      artist: 'Kavinsky'
    }
  ];

  return (
    <main className="album-container">
      <section className="album__list">
        {albums.map((album, index) => (
          <div key={index} className="album__item">
            <figure className="album__artwork">
              <img src={album.artwork} alt={album.title} />
            </figure>
            <div className="album__info">
              <div className="album__title">
                <h1>{album.title}</h1>
                <h2>{album.artist}</h2>
              </div>
              <span className="album__play">
                <svg
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="Svg-sc-ytk21e-0 Svg-img-icon-medium"
                >
                  <path fill="white" d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                </svg>
              </span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default AlbumList;