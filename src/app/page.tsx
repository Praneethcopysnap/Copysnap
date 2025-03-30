export default function Home() {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Instant UX Copy. Zero Writing Blocks.
        </h1>
  
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Generate clear, high-converting product copy for buttons, tooltips, modals, errors, and onboarding—in seconds.
        </p>
  
        <button style={{
          padding: '1rem 2rem',
          backgroundColor: '#4DABF7',
          color: '#fff',
          border: 'none',
          fontSize: '1rem',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Try Free →
        </button>
  
        <div style={{ marginTop: '4rem' }}>
          <h2>Why CopySnap?</h2>
          <ul style={{ fontSize: '1rem', lineHeight: '2' }}>
            <li>⚡ Built for Speed – generate copy in seconds</li>
            <li>✍️ Tone Flexibility – choose how you sound</li>
            <li>🧠 Context-Aware – AI understands your product</li>
          </ul>
        </div>
      </div>
    );
  }