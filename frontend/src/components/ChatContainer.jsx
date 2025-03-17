import { useChatStore } from "../store/useChatStore.js"
import { useEffect, useRef } from "react"
import ChatHeader from "./ChatHeader.jsx"
import MessageInput from "./MessageInput.jsx"
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx"
import { useAuthStore } from "../store/useAuthStore.js"
import { formatMessageTime } from "../lib/utils.js"


const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)



  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()

    return () => unsubscribeFromMessages()
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages])



  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overscroll-contain">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            ref={messageEndRef}
          >

            <div className="chat-image avatar ">
              <div className="size-10 sm:size-10 rounded-full border-b shadow-sm">
                <img
                  src={message.senderId === authUser._id ? authUser.profilePic || '/avatar.png' :
                    selectedUser.profilePic || '/avatar.png'}
                  alt="profile pic"

                />
              </div>
            </div>

            <div className="chat-header mb-1 text-xs sm:text-sm text-gray-500 flex items-center">
              <time className="text-xs opacity-50 ml-1">
                <time className="ml-2 opacity-70">{formatMessageTime(message.createdAt)}</time>
              </time>
            </div>

            <div className="chat-bubble flex flex-col rounded-md max-w-[85%] sm:max-w-[65%] ">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="max-w-[120px] sm:max-w-[200px] rounded-sm mb-1 sm:mb-2 mt-1 sm:mt-2"
                />
              )}
              {message.text && <p className="text-sm sm:text-base">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer