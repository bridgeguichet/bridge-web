import type { Server as HTTPServer } from "http";

import { auth } from "@/lib/auth/auth";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | undefined;

export function getSocketIOServer(): SocketIOServer | undefined {
  return io;
}

export function initSocketIOServer(httpServer: HTTPServer): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const request = new Request("http://localhost/socket-auth", {
        headers: { cookie: cookieHeader },
      });
      const session = await auth.api.getSession({ headers: request.headers });
      if (session?.user) {
        socket.data.userId = session.user.id;
        socket.data.role = (session.user as { role?: string }).role || "customer";
      }
    } catch {
    }
    next();
  });

  io.on("connection", (socket) => {
    const userId = (socket.data.userId || socket.handshake.auth.userId) as string | undefined;
    const userRole = (socket.data.role || socket.handshake.auth.role) as string | undefined;

    if (userId) {
      socket.join(`user:${userId}`);
    }

    if (userRole) {
      socket.join(`role:${userRole}`);
      if (userRole === "admin" || userRole === "vendor") {
        socket.join("admin:global");
      }
    }

    socket.on("notification:mark-read", async (notificationId: string) => {
      socket.emit("notification:updated", { id: notificationId, readAt: new Date() });
    });

    socket.on("notification:mark-all-read", async () => {
      if (userId) {
        socket.emit("notification:all-read", { userId });
      }
    });

    socket.on("notification:delete", async (notificationId: string) => {
      socket.emit("notification:deleted", { id: notificationId });
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

export function emitToUser(userId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

export function emitToRole(role: string, event: string, data: unknown): void {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
}

export function emitToAdmins(event: string, data: unknown): void {
  if (io) {
    io.to("admin:global").emit(event, data);
  }
}
