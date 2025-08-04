
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session } = useSession();
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch fun fact
  // useEffect(() => {
  //   const fetchFact = async () => {
  //     setLoading(true);
  //     const movie = localStorage.getItem('favorite');
  //     if (!movie) return;
  //     console.log("Geting Fact:");

  //     const res = await fetch('/api/fun-fact', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ movie }),
  //     });
  //     const data = await res.json();
  //     setFact(data.fact);
  //     setLoading(false);
  //   };

  //   if (session) fetchFact();
  // }, [session]);
  
  useEffect(() => {
  const fetchFact = async () => {
    setLoading(true);

    // Fetch user's favorite movie from DB
    const movieRes = await fetch('/api/save-movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session?.user?.email,
        name: session?.user?.name,
        image: session?.user?.image,
      }),
    });

    const movieData = await movieRes.json();
    const movie = movieData.favorite;

    console.log("Favorite movie:", movie);
    if (!movie) {
      console.log("Favorite movie:", movie);
      setLoading(false);
      return;
    }

    // Get fun fact from OpenAI
    const res = await fetch('/api/fun-fact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie }),
    });

    const data = await res.json();
    setFact(data.fact);
    setLoading(false);
  };

  if (session) fetchFact();
}, [session]);


  // Ask for favorite movie if not saved
  useEffect(() => {
    if (session) {
      fetch('/api/save-movie', {
        method: 'POST',
        body: JSON.stringify({
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(async (res) => {
        if (res.status === 204) {
          const movie = prompt("What's your favorite movie?");
          if (movie) {
            await fetch('/api/save-movie', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user?.email,
                name: session.user?.name,
                image: session.user?.image,
                favorite: movie,
              }),
            });
            localStorage.setItem('favorite', movie);
          }
        }
      });
    }
  }, [session]);

  if (session) {
    return (
      <div className="p-4 space-y-4">
        <p>Welcome <strong>{session.user?.name}</strong> ({session.user?.email})</p>
        <Image src={session.user?.image || '/default.png'} alt="Profile" width={100} height={100} />
        <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => signOut()}>
          Sign out
        </button>
        <div>
          {loading ? <p>Loading fact...</p> : <p><strong>Fun Fact:</strong> {fact}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <p>Not signed in</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => signIn('google')}>
        Sign in with Google
      </button>
    </div>
  );
}
