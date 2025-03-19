"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

// Dynamically import the GoBoard component to avoid SSR issues
const GoBoard = dynamic(() => import("@/components/GoBoard"), { ssr: false });

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTab, setCurrentTab] = useState("basics");

  // Tutorial content for each tab
  const tutorialSteps = {
    basics: [
      {
        title: "The Board and Stones",
        content: (
          <div className="space-y-4">
            <p>Go is played on a grid of 19×19 lines (or smaller 9×9 or 13×13 for faster games). The stones are placed on the intersections of the lines, not within the squares.</p>
            <p>Players take turns placing stones of their color (black or white) on empty intersections. Black plays first, and the goal is to surround and capture your opponent's stones while securing territory for yourself.</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard size={9} readOnly={true} />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Capturing Stones",
        content: (
          <div className="space-y-4">
            <p>Stones that are connected horizontally or vertically form a chain. Each empty intersection directly adjacent to a stone is called a "liberty".</p>
            <p>When a stone or chain of stones has no more liberties (is completely surrounded), it is captured and removed from the board.</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={true}
                  boardState={[
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, "white", "black", null, null, null, null],
                    [null, null, "white", "black", "black", "black", null, null, null],
                    [null, null, null, "white", "white", "black", null, null, null],
                    [null, null, null, null, "white", "black", null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                  ]}
                />
              </div>
            </div>
            <p className="text-center text-sm mt-2">In this example, the white stones are in danger of being captured if black plays at the marked position.</p>
          </div>
        ),
      },
      {
        title: "The Ko Rule",
        content: (
          <div className="space-y-4">
            <p>The "ko rule" prevents infinite cycles of capturing and recapturing. If a player captures a single stone, creating a board position identical to the position after their previous move, they cannot immediately recapture.</p>
            <p>This rule ensures the game progresses and eventually ends.</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={true}
                  boardState={[
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, "white", "white", "white", null, null, null],
                    [null, null, "white", "black", null, "black", "white", null, null],
                    [null, null, "white", "black", "white", "black", "white", null, null],
                    [null, null, "white", "black", "black", "black", "white", null, null],
                    [null, null, null, "white", "white", "white", null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                  ]}
                />
              </div>
            </div>
            <p className="text-center text-sm mt-2">Ko situation: After White captures a Black stone, Black must play elsewhere before recapturing.</p>
          </div>
        ),
      },
    ],
    strategy: [
      {
        title: "Connecting Stones",
        content: (
          <div className="space-y-4">
            <p>Connected stones are stronger than isolated ones. Stones connected diagonally are not as strong as those connected horizontally or vertically.</p>
            <p>Try to keep your stones connected and working together to form strong shapes.</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={true}
                  boardState={[
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, "black", "black", "black", null, null, null, null],
                    [null, null, "black", null, null, null, null, null, null],
                    [null, null, "black", "black", null, null, null, null, null],
                    [null, null, null, null, null, "white", "white", null, null],
                    [null, null, null, null, null, "white", null, "white", null],
                    [null, null, null, null, null, "white", "white", null, null],
                    [null, null, null, null, null, null, null, null, null],
                  ]}
                />
              </div>
            </div>
            <p className="text-center text-sm mt-2">Both players have formed strong connected shapes.</p>
          </div>
        ),
      },
      {
        title: "Influence and Territory",
        content: (
          <div className="space-y-4">
            <p>Stones exert "influence" over nearby intersections, making it easier to claim that area as territory.</p>
            <p>Balance between securing territory (concrete points) and building influence (potential for future territory).</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={true}
                  boardState={[
                    ["black", "black", "black", "black", null, null, null, null, null],
                    ["black", null, null, "black", null, null, null, null, null],
                    ["black", "black", "black", "black", null, null, null, "white", "white"],
                    [null, null, null, null, null, null, "white", null, null],
                    [null, null, null, null, null, "white", null, "white", null],
                    [null, null, null, null, "white", null, "white", null, "white"],
                    [null, null, null, null, null, "white", null, "white", null],
                    [null, null, null, null, null, null, "white", null, null],
                    [null, null, null, null, null, null, null, "white", "white"],
                  ]}
                />
              </div>
            </div>
            <p className="text-center text-sm mt-2">Black has secured the top-left corner territory while White has influence in the lower-right.</p>
          </div>
        ),
      },
      {
        title: "Opening Strategy",
        content: (
          <div className="space-y-4">
            <p>In the opening phase (fuseki), focus on establishing positions around the board rather than immediate battles.</p>
            <p>The corners are more efficient to secure as territory, followed by the sides, and finally the center.</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={true}
                  boardState={[
                    [null, null, "black", null, null, null, "white", null, null],
                    [null, null, null, null, null, null, null, null, null],
                    ["black", null, null, null, "black", null, null, null, "white"],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, "black", null, null, null, "white", null, null],
                    [null, null, null, null, null, null, null, null, null],
                    ["white", null, null, null, "white", null, null, null, "black"],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, "white", null, null, null, "black", null, null],
                  ]}
                />
              </div>
            </div>
            <p className="text-center text-sm mt-2">A typical opening with stones placed around star points and corners.</p>
          </div>
        ),
      },
    ],
    practice: [
      {
        title: "Practice: Capturing Stones",
        content: (
          <div className="space-y-4">
            <p>Try to capture the white stones by placing your black stones in the correct positions.</p>
            <p>Remember that stones are captured when they have no liberties (empty adjacent intersections).</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={false}
                  currentPlayer="black"
                  boardState={[
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, "white", "white", null, null, null, null],
                    [null, null, null, "white", null, "white", null, null, null],
                    [null, null, null, null, "white", "white", null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                  ]}
                />
              </div>
            </div>
            <p className="text-center mt-4">Place black stones to capture white.</p>
          </div>
        ),
      },
      {
        title: "Practice: Connecting Stones",
        content: (
          <div className="space-y-4">
            <p>Practice connecting your stones to form strong structures that cannot be easily cut apart.</p>
            <p>Remember that horizontally and vertically connected stones are stronger than diagonally connected ones.</p>
            <div className="flex justify-center mt-6">
              <div className="w-[300px] h-[300px]">
                <GoBoard 
                  size={9} 
                  readOnly={false}
                  currentPlayer="black"
                  boardState={[
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, "black", null, "black", null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, "black", null, "black", null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                  ]}
                />
              </div>
            </div>
            <p className="text-center mt-4">Connect the black stones to form a strong shape.</p>
          </div>
        ),
      },
    ],
  };

  const steps = tutorialSteps[currentTab as keyof typeof tutorialSteps];
  const currentTutorial = steps[currentStep];

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Learn to Play Go</h1>
        <p className="text-muted-foreground">
          Master the ancient game of Go with our interactive tutorial
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basics" onClick={() => setCurrentStep(0)}>
            Basics
          </TabsTrigger>
          <TabsTrigger value="strategy" onClick={() => setCurrentStep(0)}>
            Strategy
          </TabsTrigger>
          <TabsTrigger value="practice" onClick={() => setCurrentStep(0)}>
            Practice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="mb-4 text-2xl font-medium">{currentTutorial.title}</h2>
            {currentTutorial.content}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-secondary/50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="mb-4 text-2xl font-medium">{currentTutorial.title}</h2>
            {currentTutorial.content}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-secondary/50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="mb-4 text-2xl font-medium">{currentTutorial.title}</h2>
            {currentTutorial.content}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-secondary/50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Link
          href="/play"
          className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90"
        >
          Ready to Play
        </Link>
      </div>
    </div>
  );
} 