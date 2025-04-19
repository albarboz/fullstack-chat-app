import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { axiosInstance } from "../lib/axios.js"
import { useSocketStore } from "./useSocketStore.js"
import toast from 'react-hot-toast'


export const useAuthStore = create(devtools((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })

            const { connect } = useSocketStore.getState();
            connect(res.data._id);                          
        } catch (error) {
            console.log("Error in checkAuth:", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created succesfully")

            const { connect } = useSocketStore.getState();
            connect(res.data._id);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong in signup,");

        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('/auth/login', data)
            console.log(res)
            set({ authUser: res.data })
            toast.success('Logged in successfully')

            const { connect } = useSocketStore.getState();
            connect(res.data._id);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong in login, AuthStore");
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ authUser: null })
            toast.success('Logged out successfully')

            const { disconnect } = useSocketStore.getState();
            disconnect();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({ authUser: res.data })
            toast.success('Profile updated successfully')
        } catch (error) {
            console.log('Error in update profile:', error)
            toast.error(error?.response?.data?.message || "Something went wrong in updateProfile, AuthStore");
        } finally {
            set({ isUpdatingProfile: false })
        }
    },


}), { name: 'AuthStore' }))