import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Go Game</h1>
        <p className="text-muted-foreground">
          Choose a game mode to get started
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/play"
          className="p-6 space-y-4 border rounded-lg hover:bg-secondary/10"
        >
          <h2 className="text-xl font-medium">Play Game</h2>
          <p className="text-muted-foreground">
            Start a new game against the computer or another player
          </p>
        </Link>

        <Link
          href="/tutorial"
          className="p-6 space-y-4 border rounded-lg hover:bg-secondary/10"
        >
          <h2 className="text-xl font-medium">Tutorial</h2>
          <p className="text-muted-foreground">
            Learn the rules and basic strategies of Go
          </p>
        </Link>

        <Link
          href="/login"
          className="p-6 space-y-4 border rounded-lg hover:bg-secondary/10"
        >
          <h2 className="text-xl font-medium">Sign In</h2>
          <p className="text-muted-foreground">
            Sign in to track your progress and play with friends
          </p>
        </Link>
      </div>
    </div>
  );
}
