'use client';

import { useState } from 'react';
import Link from 'next/link';
import GoBoard from '@/components/GoBoard';

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to Go',
      content: 'Go is an ancient board game that originated in China more than 2,500 years ago. The game is played on a grid board with black and white stones.',
    },
    {
      title: 'The Board',
      content: 'The game is typically played on a 19×19 grid, but 9×9 and 13×13 boards are also common for beginners. The stones are placed on the intersections of the lines.',
    },
    {
      title: 'Taking Turns',
      content: 'Players take turns placing stones on the board. Black always plays first. Once placed, stones do not move, but they can be captured.',
    },
    {
      title: 'Capturing Stones',
      content: 'Stones are captured when they are completely surrounded by the opponent\'s stones. The key is to maintain "liberties" - empty points adjacent to your stones.',
    },
    {
      title: 'Territory',
      content: 'The goal is to surround and secure territory on the board. At the end of the game, players score points for the territory they control plus the stones they\'ve captured.',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Go Tutorial</h1>
        <p className="text-muted-foreground">
          Learn the basics of playing Go
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="mb-4 text-xl font-medium">
              {tutorialSteps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {tutorialSteps[currentStep].content}
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border rounded-md hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(tutorialSteps.length - 1, prev + 1))}
              disabled={currentStep === tutorialSteps.length - 1}
              className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="p-6 space-y-4 border rounded-lg">
            <h2 className="text-xl font-medium">Ready to Play?</h2>
            <p className="text-muted-foreground">
              Now that you know the basics, try playing a game against the computer or another player.
            </p>
            <Link
              href="/play"
              className="block w-full px-4 py-2 text-center text-white rounded-md bg-primary hover:bg-primary/90"
            >
              Start Playing
            </Link>
          </div>
        </div>

        <div>
          <div className="sticky p-6 border rounded-lg top-8">
            <h2 className="mb-4 text-xl font-medium">Example Board</h2>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={true} 
                  currentPlayer="black"
                  boardState={[
                    [null, null, 'black', null, null, null, null, null, null],
                    [null, 'black', 'white', 'white', null, null, null, null, null],
                    ['black', 'white', null, 'black', null, null, null, null, null],
                    [null, 'black', 'black', 'white', null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                  ]}
                />
              </div>
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              This is an example of a 9×9 board with some stones placed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}