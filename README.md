# Online Go Game

A modern web application for playing the ancient game of Go online against other players or a computer opponent. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Play Go Online**: Real-time or asynchronous games against other players
- **Practice with AI**: Play against a computer opponent with adjustable difficulty
- **Interactive Tutorial**: Learn the rules and strategies of Go
- **User Accounts**: Register and manage your games
- **Beautiful UI**: Clean, modern interface with responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Real-time Communication**: Socket.io
- **Authentication**: NextAuth.js
- **Form Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/go-game.git
   cd go-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows domain-driven design principles and modern React patterns:

```
├── app/ - Next.js App Router pages and layouts
├── components/
│   ├── game/ - Game-specific components
│   │   ├── GoBoard.tsx - The Go board UI component
│   │   ├── GoGameBoard.tsx - Client component that connects board to state
│   │   └── GameControls.tsx - Game control UI
│   └── ui/ - Reusable UI components and error boundaries
├── lib/
│   ├── game/ - Game logic domain
│   │   ├── core.ts - Core game rules and logic
│   │   ├── ai.ts - Computer AI implementation
│   │   └── index.ts - Domain exports
│   ├── hooks/ - React hooks for state management
│   └── utils.ts - Utility functions
└── types/ - TypeScript type definitions
```

## Recent Refactoring

This codebase was recently refactored to improve:

1. **Type Organization**: Centralized type definitions to eliminate duplication
2. **Component Structure**: Consistent organization with domain-specific folders
3. **State Management**: Implemented Zustand for global game state
4. **React Patterns**: Leveraged React 19 features including Server Components and Error Boundaries
5. **Code Modularity**: Reorganized code around domain concepts
6. **TypeScript Enhancements**: Improved type safety and reuse

## Game Rules

Go is played on a grid of 19×19 lines (or 9×9 or 13×13 for faster games). The basic rules are:

1. Players take turns placing stones on the intersections of the grid
2. A stone or group of stones is captured when it has no liberties (empty adjacent intersections)
3. The goal is to surround and capture territory
4. The game ends when both players pass consecutively
5. The player with the most territory and captured stones wins

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Go community for preserving this beautiful game
- The creators and maintainers of Next.js, React, and all the libraries used in this project