import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import User from "../../../backend/src/models/userModel";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data })
            get().connectSocket();
        } catch (err) {
            console.log("Error in checkAuth store: ", err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({ isSigningUp: false});
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data});
            toast.success("Logged in")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (err) {
            toast.err(err.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try{
            const res = await axiosInstance.put("/auth/updateProfilePic", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            set({ authUser: res.data });
            toast.success("Profile picture updated")
        } catch (err) {
            console.log("Error in update profile store: ", err);
            toast.error(err.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
        });
        socket.connect();
        set({ socket: socket })

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })

    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}));