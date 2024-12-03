import { Server } from 'socket.io';
let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join room khi bắt đầu chat
        socket.on('join chat', (room) => {
            socket.join(room);
            console.log('User joined room:', room);
        });

        // Xử lý tin nhắn mới
        socket.on('new message', (newMessageReceived) => {
            const recipientId = newMessageReceived.recipient;
            if (!recipientId) return;

            // Emit message to recipient
            socket.to(recipientId).emit('message received', newMessageReceived);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}; 