import { create } from 'zustand'
import { devtools } from "zustand/middleware";
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { useSocketStore } from './useSocketStore.js' // ✅ NEW: import the correct socket store



export const useChatStore = create(devtools((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
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

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            // console.log(`Fetching messages for user ${userId}...`)
            const res = await axiosInstance.get(`/messages/${userId}`)

            // console.log('Messages API response:', res)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false })
        }

    },

    getAllMessages: async () => {
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

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: () => {
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

    unsubscribeFromMessages: () => {
        const { offMessage } = useSocketStore.getState() // ✅ FIXED: use new socket store
        offMessage()
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

}), { name: 'ChatStore'}))