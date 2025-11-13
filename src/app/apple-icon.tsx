import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left bar */}
          <rect x="160" y="200" width="120" height="600" rx="24" ry="24" fill="#000000" />
          {/* Middle bar */}
          <rect x="400" y="429" width="120" height="371" rx="24" ry="24" fill="#000000" />
          {/* Right bar */}
          <rect x="640" y="200" width="120" height="600" rx="24" ry="24" fill="#000000" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
