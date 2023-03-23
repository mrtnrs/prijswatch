// app/page.js
'use client'
import { fetchProducts } from '../lib/api';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {

  const { data: session } = useSession();

  return (
          <main>
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
