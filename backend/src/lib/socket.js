import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

// Used to store online users
const userSocketMap = {} // {userId: socketId}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}



io.on('connection', (socket) => {
    console.log('A user connected', socket.id)

    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id

    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))



    // Typing start event
    socket.on('typing', ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', { userId });
        }
    });

    // Typing stop event
    socket.on('stopTyping', ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userStopTyping', { userId });
        }
    });

    // Message read
    socket.on('message_read', ({ messageIds, readerId }) => {
        console.log(`[Socket.IO] Message(s) read by ${readerId}:`, messageIds);


        messageIds.forEach(messageId => {
            io.emit('message_read_update', {
                messageId,
                readerId,
                readAt: new Date().toISOString()
            })
        })
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})




export { io, app, server }