// app/page.js
'use client'
import { fetchProducts } from '../lib/api';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

// ** Spinner Import
import Spinner from '@/components/spinner'
import ThemeComponent from '@/core/theme/ThemeComponent'
import { SettingsConsumer, SettingsProvider } from '@/core/context/settingsContext'

export default function Home() {

  const { data: session } = useSession();

  return (
          <main>
            <div className="container mx-auto px-4 py-8">
      <div className="hero bg-gray-100 rounded-lg p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Price Comparison Site</h1>
        <p className="text-2xl text-gray-700 mb-6">
          Find the best deals on your favorite products from top webshops
        </p>
        <div className="relative">
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Playstation 5..."
          />
          <button
            className="absolute right-0 top-0 mt-2 mr-2 px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700"
            type="submit"
          >
            Search
          </button>
        </div>
      </div>
    </div>

            <div>
              <h1>Home Page</h1>
              {/* Your other homepage content */}
            </div>
            <Link href="/dashboard" />

            {!session ? (
          <>
            <p>Not signed in</p>
            <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        ) : (
        <main className={styles.main}>
          <div className={styles.header}>
            <h4>Signed in as {session.user.name}</h4>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
          <h1 className={styles.title}>My Blog</h1>
          <div className={styles.row}>
            <div className={styles.blogCard}>
              <Image
                src="/Getting-Started-with-NextJS-Inside.jpeg"
                alt="blog1"
                width={300}
                height={200}
              />
              <div className={styles.blogCardContent}>
                <h2>Nexjs for Beginers</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quidem.
                </p>

                <a href="/blog1">Read More</a>
              </div>
            </div>
            <div className={styles.blogCard}>
              <Image
                src="/pasted image 0.png"
                alt="blog1"
                width={300}
                height={200}
              />
              <div className={styles.blogCardContent}>
                <h2>Django Full Course</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quidem.
                </p>

                <a href="/blog1">Read More</a>
              </div>
            </div>
          </div>
        </main>
      )}

          </main>
  );
}
