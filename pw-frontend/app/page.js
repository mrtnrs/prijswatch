// app/page.js
'use client'
import { fetchProducts } from '../lib/api';
import Link from 'next/link';
// import { useSession, signIn, signOut } from "next-auth/react";

// ** Spinner Import
import Spinner from '@/components/spinner'



export default function Home() {

 // const { data: session } = useSession();

  const session = false;

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
        <>
          <div className={styles.header}>
            <h4>Signed in as {session.user.name}</h4>
            <button onClick={() => signOut()}>Sign out</button>
          </div> 
        </>
      )}

          </main>
  );
}
