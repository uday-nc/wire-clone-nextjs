'use client';

import WireGame from '@/components/WireGame';

export default function Home() {
  return (
    <main className="bg-white dark:bg-black min-h-screen flex items-center justify-center transition-colors duration-200">
      <div className="bg-white dark:bg-black transition-colors duration-200">
        <WireGame />
      </div>
    </main>
  );
}
