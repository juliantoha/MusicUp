import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MusicUp Concert Series - 9 formats for community spaces';
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
          background: 'white',
          padding: '80px',
        }}
      >
        {/* Left side - Logo and branding */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '40%',
          }}
        >
          {/* Logo */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 1000 1000"
            style={{
              marginBottom: '32px',
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
              fontSize: '56px',
              fontWeight: 700,
              color: '#000000',
              fontFamily: 'Montserrat',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            MusicUp
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#6b7280',
              fontFamily: 'Montserrat',
              fontWeight: 500,
            }}
          >
            Concert Series
          </div>
        </div>

        {/* Right side - Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '60%',
            paddingLeft: '60px',
          }}
        >
          {/* Main Title */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#000000',
              fontFamily: 'Montserrat',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            9 Ready-to-Run
            <br />
            Concert Formats
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: '#6b7280',
              fontFamily: 'Montserrat',
              marginBottom: '32px',
              fontWeight: 500,
            }}
          >
            Libraries • Senior Homes • Markets
            <br />
            Schools • Hospitals • Coffee Shops
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '22px',
              color: '#4b5563',
              fontFamily: 'Montserrat',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px', fontSize: '28px' }}>✓</span>
              <span>Verified Service Hours</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px', fontSize: '28px' }}>✓</span>
              <span>Sheet Music Included</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px', fontSize: '28px' }}>✓</span>
              <span>Format Guidelines</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
