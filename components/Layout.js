// layout.js

import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Real-time NBA Analytics</title>
        <meta
          name="description"
          content="AI-powered NBA analytics and commentary"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex items-center">
          {/* Left Side */}
          <div className="flex-1">
            <span className="text-neon-purple text-sm font-roboto">
              Powered with ❤️ on SingleStore
            </span>
          </div>

          {/* Center */}
          <div className="flex-1 text-center">
            <Link href="/" className="text-3xl font-bold text-neon-green font-orbitron">
              NBA OnTheFlyAI
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex justify-end">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-green-400 text-neon-green font-orbitron">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-green-400 text-neon-green font-orbitron">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
