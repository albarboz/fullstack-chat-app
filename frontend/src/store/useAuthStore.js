import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { axiosInstance } from "../lib/axios.js"
import toast from 'react-hot-toast'



// helper to pull the error message cleanly
const getErrorMessage = err =>
    err?.response?.data?.message || "Something unexpected went wrong."


export const useAuthStore = create(
    // wrap in devtools only in development

    persist(
        devtools((set, get) => ({
            authUser: null,
            isSigningUp: false,
            isLoggingIn: false,
            isUpdatingProfile: false,
            isCheckingAuth: true,

            checkAuth: async () => {
                try {
                    const res = await axiosInstance.get('/auth/check')
                    if (!get().authUser || get().authUser._id !== res.data._id) {
                        set({ authUser: res.data });
                    }

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
                    const res = await axiosInstance.post("/auth/register", data)
                    set({ authUser: res.data })
                    toast.success("Account created succesfully")

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
                    set({ authUser: res.data })

                    toast.success('Logged in successfully')

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


        }), { name: 'AuthStore' }),
        {
            name: 'auth-storage', // 👈 localStorage key
            partialize: (state) => ({ authUser: state.authUser }) // 👈 only persist this
        }))