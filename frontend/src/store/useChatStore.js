import { create } from 'zustand'
import { devtools } from "zustand/middleware";
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { useSocketStore } from './useSocketStore.js' // ✅ NEW: import the correct socket store



export const useChatStore = create(devtools((set, get) => ({
    messages: [],
    nextCursor: null,
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    clearSelectedUser: () => set({ selectedUser: null }),

    fetchChatUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('/messages/users')
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    openChatWithUser: (user) => {
        set({ selectedUser: user, messages: [], nextCursor: null });
    },

    loadChatHistory: async (userId, cursor = null) => {
        set({ isMessagesLoading: true })

        try {
            const res = await axiosInstance.get(`/messages/${userId}`, {
                params: { limit: 10, cursor }
            })

            const { messages: page, nextCursor } = res.data;

            set(state => ({
                messages: cursor ? [...page, ...state.messages] : page,
                nextCursor
            }));
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false })
        }

    },

    loadMoreMessages: () => {
        const { selectedUser, nextCursor } = get();
        if (!nextCursor) return;
        return get().loadChatHistory(selectedUser._id, nextCursor);
    },

    fetchAllMessages: async () => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages`) // all messages route
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
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
        const { socket, onMessage } = useSocketStore.getState() // ✅ FIXED: use new socket store

        if (!selectedUser || !socket?.connected) return

        onMessage((newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if (!isMessageSentFromSelectedUser) return

            set({
                messages: [...get().messages, newMessage],
            })
        })
    },

    stopListeningForMessages: () => {
        const { offMessage } = useSocketStore.getState() // ✅ FIXED: use new socket store
        offMessage()
    },

}), { name: 'ChatStore' }))