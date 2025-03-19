import { Metadata } from 'next';
import { Suspense } from 'react';
import GoGameBoard from '@/components/game/GoGameBoard';
import GameControls from '@/components/game/GameControls';

export const metadata: Metadata = {
  title: 'Play Go | Go Game',
  description: 'Play the ancient game of Go against other players or the computer',
};

export default async function PlayPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Play Go</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <Suspense fallback={<div className="w-[570px] h-[570px] bg-gray-100 animate-pulse"></div>}>
            <GoGameBoard />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-md"></div>}>
            <GameControls />
          </Suspense>
          
          <div className="bg-secondary/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Game Info</h2>
            <p className="text-muted-foreground mb-4">
              Go is an abstract strategy board game for two players in which the aim is to surround more territory than the opponent.
            </p>
            <div className="space-y-2">
              <p><strong>Black stones captured:</strong> <span id="black-captured">0</span></p>
              <p><strong>White stones captured:</strong> <span id="white-captured">0</span></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 