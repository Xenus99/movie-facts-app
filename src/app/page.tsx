
import Image from "next/image";
import './globals.css'

import SessionWrapper from './session-wrapper';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  return (
    <SessionWrapper>
      <main className="flex justify-center items-center min-h-screen">
        <AuthButton />
      </main>
    </SessionWrapper>
  );
}
