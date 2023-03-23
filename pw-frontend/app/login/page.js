'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle email/password login or registration
  };

  console.log("GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET);
console.log("NEXTAUTH_SECRET:", process.env.NEXT_PUBLIC_NEXTAUTH_SECRET);
console.log("NEXT_PUBLIC_NEXTAUTH_URL:", process.env.NEXT_PUBLIC_NEXTAUTH_URL);

  return (
  <div>
    <h1>{isLogin ? 'Login' : 'Register'}</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
    </form>
    <button onClick={() => signIn('google')}>Sign in with Google</button>
    <p onClick={() => setIsLogin(!isLogin)}>
      {isLogin
        ? "Don't have an account? Register"
        : 'Already have an account? Login'}
    </p>
  </div>
);

}

export default Login;
