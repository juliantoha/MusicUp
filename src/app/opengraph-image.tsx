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
          background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
          padding: '80px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '32px',
            padding: '80px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Logo/Icon Circle */}
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              boxShadow: '0 10px 25px -5px rgba(235, 106, 24, 0.5)',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                color: 'white',
              }}
            >
              🎵
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            MusicUp
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '42px',
              color: '#1f2937',
              marginBottom: '32px',
              fontWeight: 600,
            }}
          >
            Music Every Day
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: '#6b7280',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Connect performers with libraries, senior homes, markets, and community spaces
          </div>

          {/* Bottom accent */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '24px',
                color: 'white',
                fontWeight: 600,
              }}
            >
              Verified Service Hours
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '24px',
                color: 'white',
                fontWeight: 600,
              }}
            >
              Sheet Music Included
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
