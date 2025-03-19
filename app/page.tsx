import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
      <h1 className="text-4xl font-bold text-center sm:text-6xl">
        Welcome to Online Go Game
      </h1>
      <p className="max-w-[600px] text-center text-muted-foreground text-lg">
        Play the ancient game of Go against other players or the computer.
        Learn the rules, improve your skills, and enjoy the challenge.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/play" 
          className="px-8 py-3 text-lg font-medium text-white rounded-md bg-primary hover:bg-primary/90"
        >
          Play Now
        </Link>
        <Link 
          href="/tutorial" 
          className="px-8 py-3 text-lg font-medium rounded-md bg-secondary hover:bg-secondary/90"
        >
          Learn to Play
        </Link>
        <Link 
          href="/login" 
          className="px-8 py-3 text-lg font-medium border rounded-md hover:bg-secondary/10"
        >
          Sign In
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-3">
        <FeatureCard
          title="Play Online"
          description="Challenge other players from around the world in real-time or asynchronous matches."
          icon="🎮"
        />
        <FeatureCard
          title="Practice with AI"
          description="Improve your skills by playing against our computer opponent with adjustable difficulty."
          icon="🤖"
        />
        <FeatureCard
          title="Learn the Game"
          description="Master the ancient game of Go with our interactive tutorial and practice exercises."
          icon="📚"
        />
      </div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: string; 
}) {
  return (
    <div className="p-6 space-y-3 border rounded-lg">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}