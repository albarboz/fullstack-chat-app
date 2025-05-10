import { create } from 'zustand';
import { io } from 'socket.io-client';
import { devtools } from 'zustand/middleware';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5002' : '/';

// This lives outside of Zustand state to persist without re-renders
let isConnected = false;

export const useSocketStore = create(devtools((set, get) => ({
  socket: null,
  onlineUsers: [],

  connect: (userId) => {
    if (isConnected) {
      console.log('[SocketStore] Already connected. Skipping.');
      return;
    }

    console.count('[SocketStore] connect() actually triggered');

    const socket = io(BASE_URL, {
      query: { userId }
    });

    socket.on('connect', () => {
      console.log('[SocketStore] Socket connected ✅');
      isConnected = true;
      
      set({ socket });
    });

    socket.on('disconnect', () => {
      console.log('[SocketStore] Socket disconnected ❌');
      isConnected = false;
      set({ socket: null, onlineUsers: [] });
    });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });

  },

  disconnect: () => {
    const socket = get().socket;
    if (socket?.connected || isConnected) {
      console.log('[SocketStore] Disconnecting...');
      socket.disconnect();
      isConnected = false;
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

    // Read receipt listener
    onMessageReadUpdate: (callback) => {
      const socket = get().socket;
      if (!socket || !socket.connected) return;
      socket.on('message_read_update', callback);
    },
  
    offMessageReadUpdate: () => {
      const socket = get().socket;
      if (socket?.connected) {
        socket.off('message_read_update');
      }
    },

  

}), { name: 'SocketStore' }));
