// app/components/LoginPage.js

import { signIn, signOut, useSession } from 'next-auth/react';

function LoginPage() {
  const [session, loading] = useSession();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {!session && (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}

export default LoginPage;
