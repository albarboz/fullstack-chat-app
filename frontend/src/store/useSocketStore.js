import { create } from 'zustand';
import { io } from 'socket.io-client';
import { devtools } from "zustand/middleware";

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5002' : '/';

export const useSocketStore = create(devtools((set, get) => ({
    socket: null,
    onlineUsers: [],

    connect: (userId) => {
        const existingSocket = get().socket
        if (existingSocket?.connected || existingSocket?.connecting) return

        const socket = io(BASE_URL, {
            query: { userId }
        })

        console.count("connect called")

        socket.on('connect', () => {
            console.log('Socket connected')
            set({ socket })
        })

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds })
        })

        set({ socket })

    },

    disconnect: () => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.disconnect();
          set({ socket: null, onlineUsers: [] });
        }
      },

    onMessage: (callback) => {
        const socket = get().socket;
        if (!socket || !socket.connected) return;
        socket.on('newMessage', callback);
      },
    
      offMessage: () => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.off('newMessage');
        }
      },

}), { name: 'SocketStore'}))


