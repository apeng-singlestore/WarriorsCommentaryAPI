// components/Layout.js

import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Warriors Game AI Commentary</title>
        <meta
          name="description"
          content="AI-powered commentary for Warriors games"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <h1 className="ml-3 text-xl font-semibold text-gray-800">
                Warriors Game AI Commentary
              </h1>
            </div>
            {/* Add navigation items here if needed */}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
