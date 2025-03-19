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

- `/app` - Next.js App Router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and custom hooks
- `/public` - Static assets
- `/types` - TypeScript type definitions

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