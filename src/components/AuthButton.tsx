'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session } = useSession();
  const [movie, setMovie] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch('/api/save-movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session?.user?.email,
        name: session?.user?.name,
        image: session?.user?.image,
        favorite: movie,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert('Failed to save movie.');
    }
  };

  if (!session) {
    return (
      <>
        <p>Not signed in</p>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </>
    );
  }

  return (
    <>
      <p>Welcome {session.user?.name} ({session.user?.email})</p>
      <img src={session.user?.image || '/default-avatar.png'} width={100} alt="avatar" />
      <button onClick={() => signOut()}>Sign out</button>

      {!submitted ? (
        <>
          <input
            placeholder="Your favorite movie"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            className="border p-2 m-2"
          />
          <button onClick={handleSubmit}>Submit</button>
        </>
      ) : (
        <p>✅ Favorite movie saved!</p>
      )}
    </>
  );
}
