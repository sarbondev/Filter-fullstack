import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { JwtPayload } from '../types/common.types';
import { logger } from '../utils/logger';

let io: Server;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.NODE_ENV === 'production'
        ? process.env['ALLOWED_ORIGINS']?.split(',')
        : '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as JwtPayload;
    logger.info({ userId: user.sub, role: user.role }, 'WebSocket client connected');

    // Join role-based rooms
    socket.join(`role:${user.role}`);
    socket.join(`user:${user.sub}`);

    // Join admin room for admins and call managers
    if (user.role === 'ADMIN' || user.role === 'CALL_MANAGER') {
      socket.join('staff');
    }

    socket.on('disconnect', () => {
      logger.info({ userId: user.sub }, 'WebSocket client disconnected');
    });
  });

  logger.info('WebSocket server initialized');
  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

// Emit helpers
export const emitToUser = (userId: string, event: string, data: unknown): void => {
  io?.to(`user:${userId}`).emit(event, data);
};

export const emitToStaff = (event: string, data: unknown): void => {
  io?.to('staff').emit(event, data);
};

export const emitToRole = (role: string, event: string, data: unknown): void => {
  io?.to(`role:${role}`).emit(event, data);
};

export const emitToAll = (event: string, data: unknown): void => {
  io?.emit(event, data);
};
