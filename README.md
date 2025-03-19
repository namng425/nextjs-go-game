# Go Game

A modern implementation of the ancient board game Go (围棋/囲碁/바둑) built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎮 Play against AI with multiple difficulty levels
- 🎯 Fully implemented Go rules including:
  - Capturing stones
  - Ko rule
  - Suicide rule
  - Territory scoring
  - Komi (6.5 points compensation for white)
- 🎨 Beautiful and responsive UI built with Tailwind CSS
- 🚀 Fast and efficient game logic
- 📱 Mobile-friendly design
- 🎓 Tutorial mode for beginners
- 🔄 Real-time game state updates
- 🎲 Multiple board sizes (9x9, 13x13, 19x19)

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [React](https://reactjs.org/) - UI library

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/namng425/nextjs-go-game.git
cd nextjs-go-game
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Modes

### Play Against Computer
- Choose from three difficulty levels: Beginner, Intermediate, Advanced
- AI uses different strategies based on difficulty
- Practice and improve your skills

### Tutorial Mode
- Learn the basic rules of Go
- Interactive lessons
- Practice exercises

## Project Structure

```
nextjs-go-game/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── play/          # Game play page
│   ├── tutorial/      # Tutorial pages
│   └── login/         # Authentication pages
├── components/        # React components
│   ├── ui/           # UI components
│   └── GoBoard.tsx    # Main game board component
├── lib/              # Core game logic
│   ├── go-game-logic.ts   # Game rules implementation
│   ├── computer-ai.ts     # AI implementation
│   └── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to [Sensei's Library](https://senseis.xmp.net/) for Go game theory resources
- Inspired by [KataGo](https://github.com/lightvector/KataGo) for AI implementation concepts