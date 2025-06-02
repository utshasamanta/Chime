import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingUsers: false,
    isLoadingMessages: false,

    getUsers: async () => {
        set({ isLoadingUsers: true})
        try{
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data});
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    getMessages: async (receiverId) => {
        set({ isLoadingMessages: true });
        try {
            const res = await axiosInstance.get(`/messages/${receiverId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (data) => {
        const { selectedUser, messages } = get();
        try{
            // console.log("Before sending");
            // console.log(messages);
            // console.log(selectedUser);
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            set({ messages: [...messages, res.data] });
            // console.log(messages);
            // console.log(res.data);
            // return 
        } catch (err) {
            console.log("Error in sendMessage store: ", err);
            toast.error(err.response.data.message);
            throw err;
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))