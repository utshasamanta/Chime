import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore";
import { X, Image, Send } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, SetImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64Image = reader.result;
            SetImagePreview(base64Image);
        }

    };

    const removeImage = () => {
        SetImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const textContent = text.trim();
        const image = fileInputRef.current?.files[0]

        if (!textContent && !image) {
            toast.error("Cannot send empty message");
            return;
        }

        const formData = new FormData();
        if (image) {
            formData.append("messageMedia", image)
        }
        formData.append("text", textContent);

        try {
            await sendMessage(formData);
            console.log("Message sent!");
            setText("");
            SetImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.log("Failed to send message: ", err);
        }
        
    };

    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700"/>
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3"/>
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input 
                        type="text"
                        className="w-full input input-bordered rounded-lg input-md"
                        placeholder="Type a msg..."
                        value={text}
                        onChange={(e) => (setText(e.target.value))} 
                    />
                    <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange} 
                    />

                    <button
                        type="button"
                        className={`flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center btn btn-md btn-circle"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
};

export default MessageInput;