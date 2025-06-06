import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/util";

const ChatContainer = () => {
    const { messages, getMessages, isLoadingMessages, selectedUser, subscribeToMessage, unsubscribeMessage } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessage();
        
        return () => unsubscribeMessage();
    }, [selectedUser._id, getMessages, subscribeToMessage, unsubscribeMessage])

    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isLoadingMessages) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    };

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                    >
                        {/* <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img 
                                    src={msg.senderId === authUser._id ? authUser.profilePicUrl || "/avatar.png" : selectedUser.profilePicUrl || "/avatar.png"} 
                                    alt="Profile Pic" 
                                />
                            </div>
                        </div> */}
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(msg.createdAt)}</time>
                        </div>

                        <div className={`chat-bubble flex flex-col gap-6 ${msg.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                            {msg.mediaUrl && (
                                <img 
                                    src={msg.mediaUrl}
                                    alt="attachment"
                                    className="w-full max-w-xs sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {msg.text && <p className={msg.senderId === authUser._id ? "text-primary-content/70" : "text-base-content/70"}>{msg.text}</p>}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <MessageInput />
        </div>
    )
};

export default ChatContainer;