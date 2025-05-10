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

    clearSelectedUser: () => set({ selectedUser: null }),

    fetchChatUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('/messages/users')
            set({ users: res.data.map(user => ({
                ...user,
                lastMessage: user.lastMessage,
                readAt: user.readAt
              })) })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    openChatWithUser: (user) => {
        set({ selectedUser: user, messages: [] });
    },

    loadChatHistory: async (userId) => {
        set({ isMessagesLoading: true })

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);

            set({ messages: res.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isMessagesLoading: false });
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
