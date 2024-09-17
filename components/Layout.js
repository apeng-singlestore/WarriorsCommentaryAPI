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
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Warriors AI Commentary
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-blue-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:text-blue-200">
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
