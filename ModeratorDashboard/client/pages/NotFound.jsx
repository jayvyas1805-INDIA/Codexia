export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 16px 0'
        }}>
          404
        </h1>
        <p style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 12px 0'
        }}>
          Page Not Found
        </p>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 32px 0',
          lineHeight: '1.6'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
