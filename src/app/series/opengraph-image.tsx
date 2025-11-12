import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MusicUp Concert Series - 9 formats for community spaces';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const series = [
    { name: 'Empathy', emoji: '💝' },
    { name: 'PianoTales', emoji: '📚' },
    { name: 'Markets', emoji: '🌾' },
    { name: 'Schools', emoji: '🎒' },
    { name: 'Hospitals', emoji: '🏥' },
    { name: 'Coffee Shops', emoji: '☕' },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '32px',
            padding: '60px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            height: '100%',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '24px',
                fontSize: '48px',
              }}
            >
              🎵
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #EB6A18 0%, #c2410c 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                MusicUp
              </div>
              <div
                style={{
                  fontSize: '28px',
                  color: '#6b7280',
                  fontWeight: 600,
                }}
              >
                Concert Series
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '24px',
              lineHeight: 1.2,
            }}
          >
            9 Ready-to-Run Concert Formats
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#6b7280',
              marginBottom: '40px',
              lineHeight: 1.3,
            }}
          >
            Play the right set in the right room
          </div>

          {/* Series Grid */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {series.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  padding: '16px 28px',
                  borderRadius: '16px',
                  border: '2px solid #f59e0b',
                }}
              >
                <div style={{ fontSize: '32px', marginRight: '12px' }}>{s.emoji}</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#92400e',
                  }}
                >
                  {s.name}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Features */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: 'auto',
              fontSize: '20px',
              color: '#6b7280',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '24px' }}>✓</span>
              <span>Curated Repertoire</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '24px' }}>✓</span>
              <span>Format Guidelines</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '24px' }}>✓</span>
              <span>Service Hours</span>
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
