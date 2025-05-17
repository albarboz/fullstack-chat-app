import { create } from 'zustand'
import { devtools } from "zustand/middleware";
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { useSocketStore } from './useSocketStore.js'

export const useChatStore = create(devtools((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isLoadingOlderMessages: false,
    hasMoreMessages: true, // Track if there are more messages to load

    clearSelectedUser: () => set({
        selectedUser: null,
        messages: [],
        hasMoreMessages: true
    }),

    fetchChatUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('/messages/users')
            set({
                users: res.data.map(user => ({
                    ...user,
                    lastMessage: user.lastMessage,
                    readAt: user.readAt
                }))
            })
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to fetch users')
        } finally {
            set({ isUsersLoading: false })
        }
    },

    openChatWithUser: (user) => {
        set({
            selectedUser: user,
            messages: [],
            hasMoreMessages: true // Reset pagination when opening a new chat
        });
    },

    loadChatHistory: async (userId) => {
        set({ isMessagesLoading: true })

        try {
            const res = await axiosInstance.get(`/messages/${userId}`, {
                params: { limit: 20 } // Set a consistent limit for pagination
            });
            console.log("[loadChatHistory] Response:", res.data) // Add logging

            set({
                messages: res.data.messages,
                // If we received fewer messages than requested, there are no more to load
                hasMoreMessages: res.data.messages.length >= 20
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    loadOlderMessages: async () => {
        const { selectedUser, messages, isLoadingOlderMessages, hasMoreMessages } = get();
        
        // Don't load if we're already loading or if there are no more messages
        if (isLoadingOlderMessages || !hasMoreMessages || !selectedUser || messages.length === 0) {
          return false;
        }
        
        set({ isLoadingOlderMessages: true });
        
        try {
          // Use the timestamp of the oldest message as a cursor
          const before = messages[0]?.createdAt;
          const res = await axiosInstance.get(`/messages/${selectedUser._id}`, {
            params: { 
              limit: 20,
              before
            }
          });
          
          const olderMessages = res.data.messages;
          console.count("[loadOlderChatHistory] Response:", res.data) // Add logging

          // Check if we have more messages to load
          const hasMore = olderMessages.length >= 20;
          
          // Filter out any duplicates (in case of race conditions)
          const uniqueOlderMessages = olderMessages.filter(
            oldMsg => !messages.some(existingMsg => existingMsg._id === oldMsg._id)
          );
          
          set({ 
            messages: [...uniqueOlderMessages, ...messages],
            hasMoreMessages: hasMore,
          });
          
          return true; // Return true to indicate successful loading
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load older messages');
          return false;
        } finally {
          set({ isLoadingOlderMessages: false });
        }
      },

    fetchAllMessages: async () => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendChatMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    listenForIncomingMessages: () => {
        const { selectedUser } = get()
        const { socket, onMessage } = useSocketStore.getState()

        if (!selectedUser || !socket?.connected) return

        onMessage((newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if (!isMessageSentFromSelectedUser) return

            set({ messages: [...get().messages, newMessage] })
        })
    },

    stopListeningForMessages: () => {
        const { offMessage } = useSocketStore.getState()
        offMessage()
    },


    updateMessageReadStatus: (messageId, readerId, readAt) => {
        set(state => ({
            messages: state.messages.map(msg =>
                msg._id === messageId
                    ? {
                        ...msg,
                        readBy: [...(msg.readBy || []), { userId: readerId, readAt }]
                    }
                    : msg
            )
        }));
    }

}), { name: 'ChatStore' }))
