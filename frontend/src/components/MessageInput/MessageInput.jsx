import React, { useState, useRef } from "react";
import { useChatStore } from "../../store/useChatStore.js";
import { Image, Paperclip, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
// import sendIcon from "../assets/send.svg";
import { useSocketStore } from '../../store/useSocketStore.js';


import '../../components/MessageInput/MessageInput.css'

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null); // Add this with your other refs and state


  const { sendChatMessage, selectedUser } = useChatStore();
  const { emitTyping, emitStopTyping } = useSocketStore();

  // Typing event handler
  const handleInputChange = (e) => {
    setText(e.target.value);
    if (selectedUser?._id) {
      emitTyping(selectedUser._id);

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(selectedUser._id);
      }, 1500);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendChatMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊"];

  const addEmoji = (emoji) => {
    setText(text + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="message-input-container">
      {imagePreview && (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="preview-image" />
            <button
              onClick={removeImage}
              type="button"
              className="remove-image-btn"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="emoji-picker">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className="emoji-btn"
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSendChatMessage}
        className="message-input-form-container"
      >
        <button
          type="button"
          className="icon-button smile-icon"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile size={20} />
        </button>

        <input
          type="text"
          placeholder="Message..."
          value={text}
          onChange={handleInputChange} // Updated to use typing-aware handler
          className="message-input"
        />


        <button
          type="button"
          className="icon-button paperclip-icon"
          onClick={() => fileInputRef.current.click()}
        >
          <Paperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <div className="svg-container">
          <svg className="svg-appendix" width="9" height="17">
            <defs>
              <filter
                x="-60%"
                y="-10.7%"
                width="200%"
                height="141.2%"
                filterUnits="objectBoundingBox"
                id="composerAppendix"
              >
                <feOffset
                  dy="1"
                  in="SourceAlpha"
                  result="shadowOffsetOuter1"
                ></feOffset>
                <feGaussianBlur
                  stdDeviation="1"
                  in="shadowOffsetOuter1"
                  result="shadowBlurOuter1"
                ></feGaussianBlur>
                <feColorMatrix
                  values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0"
                  in="shadowBlurOuter1"
                ></feColorMatrix>
              </filter>
            </defs>
            <g fill="none" fillRule="evenodd">
              <path
                d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"
                fill="#000"
                filter="url(#composerAppendix)"
              ></path>
              <path
                d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"
                fill="#FFF"
                className="corner"
              ></path>
            </g>
          </svg>
        </div>

        <button
          type="submit"
          className="btn btn-circle send-mask"
          disabled={!text.trim() && !imagePreview}
        >
          <span className="icon" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
