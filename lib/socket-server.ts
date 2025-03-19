import { Server as NetServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { GoGame } from './go-game-logic';

type GameState = {
  id: string;
  game: GoGame;
  players: {
    black?: string;
    white?: string;
  };
  spectators: string[];
  lastActivity: Date;
};

/**
 * Initialize a Socket.IO server
 * @param server HTTP Server
 * @returns Socket.IO server instance
 */
export function initSocketServer(server: NetServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Store active games
  const activeGames = new Map<string, GameState>();

  // Clean up abandoned games periodically (every hour)
  setInterval(() => {
    const now = new Date();
    for (const [gameId, gameState] of activeGames.entries()) {
      // Remove games inactive for more than 24 hours
      const inactiveHours = (now.getTime() - gameState.lastActivity.getTime()) / (1000 * 60 * 60);
      if (inactiveHours > 24) {
        activeGames.delete(gameId);
      }
    }
  }, 60 * 60 * 1000);

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Handle creating a new game
    socket.on('create_game', ({ size = 19 }: { size: 9 | 13 | 19 }) => {
      const gameId = generateGameId();
      const game = new GoGame(size);

      activeGames.set(gameId, {
        id: gameId,
        game,
        players: {},
        spectators: [],
        lastActivity: new Date(),
      });

      socket.emit('game_created', { gameId });
    });

    // Handle joining a game
    socket.on('join_game', ({ gameId, role = 'spectator' }: { gameId: string; role: 'black' | 'white' | 'spectator' }) => {
      const gameState = activeGames.get(gameId);

      if (!gameState) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Update last activity
      gameState.lastActivity = new Date();

      // Join the game room
      socket.join(gameId);

      if (role === 'spectator') {
        gameState.spectators.push(socket.id);
        socket.emit('joined_as_spectator', { gameId });
      } else if (role === 'black' && !gameState.players.black) {
        gameState.players.black = socket.id;
        socket.emit('joined_as_player', { gameId, color: 'black' });
      } else if (role === 'white' && !gameState.players.white) {
        gameState.players.white = socket.id;
        socket.emit('joined_as_player', { gameId, color: 'white' });
      } else {
        // Role already taken, join as spectator
        gameState.spectators.push(socket.id);
        socket.emit('joined_as_spectator', { gameId, message: `${role} is already taken` });
      }

      // Send current game state to the client
      const boardState = gameState.game.getBoard();
      const currentPlayer = gameState.game.getCurrentPlayer();
      const capturedStones = gameState.game.getCapturedStones();

      socket.emit('game_state', {
        boardState,
        currentPlayer,
        capturedStones,
      });

      // Notify other players that someone joined
      socket.to(gameId).emit('player_joined', {
        players: gameState.players,
        spectators: gameState.spectators.length,
      });
    });

    // Handle placing a stone
    socket.on('place_stone', ({ gameId, row, col }: { gameId: string; row: number; col: number }) => {
      const gameState = activeGames.get(gameId);

      if (!gameState) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Update last activity
      gameState.lastActivity = new Date();

      // Check if the player is allowed to move
      const currentPlayer = gameState.game.getCurrentPlayer();
      if (
        (currentPlayer === 'black' && gameState.players.black !== socket.id) ||
        (currentPlayer === 'white' && gameState.players.white !== socket.id)
      ) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      // Try to place the stone
      const success = gameState.game.placeStone(row, col);

      if (success) {
        // Get updated game state
        const boardState = gameState.game.getBoard();
        const newCurrentPlayer = gameState.game.getCurrentPlayer();
        const capturedStones = gameState.game.getCapturedStones();

        // Broadcast the updated state to all clients in the room
        io.to(gameId).emit('game_state', {
          boardState,
          currentPlayer: newCurrentPlayer,
          capturedStones,
          lastMove: { row, col },
        });
      } else {
        socket.emit('error', { message: 'Invalid move' });
      }
    });

    // Handle passing
    socket.on('pass', ({ gameId }: { gameId: string }) => {
      const gameState = activeGames.get(gameId);

      if (!gameState) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Update last activity
      gameState.lastActivity = new Date();

      // Check if the player is allowed to pass
      const currentPlayer = gameState.game.getCurrentPlayer();
      if (
        (currentPlayer === 'black' && gameState.players.black !== socket.id) ||
        (currentPlayer === 'white' && gameState.players.white !== socket.id)
      ) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      // Pass the turn
      gameState.game.pass();

      // Get updated game state
      const boardState = gameState.game.getBoard();
      const newCurrentPlayer = gameState.game.getCurrentPlayer();
      const capturedStones = gameState.game.getCapturedStones();
      const isGameOver = gameState.game.isGameOver();

      // Broadcast the updated state to all clients in the room
      io.to(gameId).emit('game_state', {
        boardState,
        currentPlayer: newCurrentPlayer,
        capturedStones,
        lastMove: 'pass',
      });

      // If the game is over, calculate and broadcast scores
      if (isGameOver) {
        const scores = gameState.game.calculateScore();
        io.to(gameId).emit('game_over', { scores });
      }
    });

    // Handle resigning
    socket.on('resign', ({ gameId }: { gameId: string }) => {
      const gameState = activeGames.get(gameId);

      if (!gameState) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Update last activity
      gameState.lastActivity = new Date();

      // Determine which player resigned
      let resignedColor: 'black' | 'white' | null = null;
      if (gameState.players.black === socket.id) {
        resignedColor = 'black';
      } else if (gameState.players.white === socket.id) {
        resignedColor = 'white';
      }

      if (!resignedColor) {
        socket.emit('error', { message: 'You are not a player in this game' });
        return;
      }

      // Broadcast resignation
      io.to(gameId).emit('player_resigned', { color: resignedColor });

      // Determine winner
      const winner = resignedColor === 'black' ? 'white' : 'black';
      io.to(gameId).emit('game_over', { winner, byResignation: true });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Check all games for the disconnected player
      for (const [gameId, gameState] of activeGames.entries()) {
        // If the player was in this game, notify others
        if (gameState.players.black === socket.id) {
          gameState.players.black = undefined;
          io.to(gameId).emit('player_left', { color: 'black' });
        } else if (gameState.players.white === socket.id) {
          gameState.players.white = undefined;
          io.to(gameId).emit('player_left', { color: 'white' });
        } else {
          // Remove from spectators if present
          const spectatorIndex = gameState.spectators.indexOf(socket.id);
          if (spectatorIndex !== -1) {
            gameState.spectators.splice(spectatorIndex, 1);
            io.to(gameId).emit('spectator_left', { count: gameState.spectators.length });
          }
        }

        // Update activity timestamp
        gameState.lastActivity = new Date();
      }
    });
  });

  return io;
}

/**
 * Generate a random game ID
 * @returns Random 8-character game ID
 */
function generateGameId(): string {
  return Math.random().toString(36).substring(2, 10);
} 