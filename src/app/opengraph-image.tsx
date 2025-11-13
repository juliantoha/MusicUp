import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MusicUp - Music Every Day';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        {/* Logo */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 1000 1000"
          style={{
            marginBottom: '40px',
          }}
        >
          {/* Left bar */}
          <rect x="160" y="200" width="120" height="600" rx="24" ry="24" fill="#000000" />
          {/* Middle bar */}
          <rect x="400" y="429" width="120" height="371" rx="24" ry="24" fill="#000000" />
          {/* Right bar */}
          <rect x="640" y="200" width="120" height="600" rx="24" ry="24" fill="#000000" />
        </svg>

        {/* Wordmark */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 700,
            color: '#000000',
            fontFamily: 'Montserrat',
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}
        >
          MusicUp
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '36px',
            color: '#6b7280',
            fontFamily: 'Montserrat',
            fontWeight: 500,
          }}
        >
          Music Every Day
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
