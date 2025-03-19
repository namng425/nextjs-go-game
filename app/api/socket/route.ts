import { createServer } from 'http';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { initSocketServer } from '@/lib/socket-server';

// Create HTTP server
const httpServer = createServer();

// Initialize Socket.IO server
const io = initSocketServer(httpServer);

// Start the server on a free port
httpServer.listen(3001, () => {
  console.log('Socket.IO server started on port 3001');
});

// API route handler
export async function GET(req: NextRequest) {
  return NextResponse.json({ socketServer: 'running on port 3001' });
}

export const dynamic = 'force-dynamic'; 