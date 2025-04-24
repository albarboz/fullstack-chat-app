import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useContactStore = create(devtools((set, get) => ({
  contacts: [],
  contactRequests: [],
  isLoading: false,

  fetchContacts: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/contacts');
      set({ contacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchContactRequests: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/contacts/requests');
      set({ contactRequests: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch contact requests');
    } finally {
      set({ isLoading: false });
    }
  },

  sendContactRequest: async (userId) => {
    try {
      await axiosInstance.post(`/contacts/request/${userId}`);
      toast.success('Contact request sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send contact request');
    }
  },

  acceptContactRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/contacts/accept/${requestId}`);
      toast.success('Contact request accepted');
      get().fetchContactRequests();
      get().fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept contact request');
    }
  },

  rejectContactRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/contacts/reject/${requestId}`);
      toast.success('Contact request rejected');
      get().fetchContactRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject contact request');
    }
  },

  removeContact: async (contactId) => {
    try {
      await axiosInstance.delete(`/contacts/${contactId}`);
      toast.success('Contact removed');
      set(state => ({
        contacts: state.contacts.filter(contact => contact._id !== contactId)
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove contact');
    }
  },
  
}), { name: 'ContactStore' }))