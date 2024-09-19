import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Warriors Game AI Commentary</title>
        <meta
          name="description"
          content="AI-powered commentary for Warriors games"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="bg-black text-neon-green p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-neon-green">
            Warriors AI Commentary
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-green-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:text-green-400">
                Analytics
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
