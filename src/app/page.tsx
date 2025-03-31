// src/app/page.tsx

import Image from 'next/image'
import logo from '../../public/Frame2.png' // adjust if your path is different

export default function Home() {
  return (
    <main style={styles.body}>
      <div style={styles.container}>
        <Image
          src={logo}
          alt="CopySnap Logo"
          style={styles.logo}
          priority
        />
        <p style={styles.description}>
          We are upgrading our look and feel of the application, we will be soon out.
        </p>
        <p style={styles.subHeading}>Don’t want to miss the launch?</p>
        <p style={styles.subNote}>We will mail you for the updates.</p>

        <div style={styles.inputContainer}>
          <svg
            style={styles.icon}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.045 1.894l-7.5 4.732a2.25 2.25 0 01-2.41 0L3.295 8.887a2.25 2.25 0 01-1.045-1.894V6.75"
            />
          </svg>
          <input
            type="email"
            placeholder="Your Email Address..."
            style={styles.input}
          />
        </div>
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#f9f9f9',
    fontFamily: "'Noto Sans', sans-serif",
    color: '#333',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  container: {
    maxWidth: 500,
    margin: 'auto',
    padding: '40px 20px',
  },
  logo: {
    maxWidth: '100%',
    height: 'auto',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 24,
    marginBottom: 32,
  },
  subHeading: {
    color: '#1e88e5',
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 4,
  },
  subNote: {
    fontSize: 13,
    color: '#555',
  },
  inputContainer: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: 4,
    maxWidth: 280,
    padding: '6px 10px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    color: '#aaa',
    flexShrink: 0,
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: 13,
    width: '100%',
    fontFamily: "'Noto Sans', sans-serif",
    color: '#333',
  },
}
