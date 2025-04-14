import { useChatStore } from "../store/useChatStore.js"
import { useEffect, useRef } from "react"
import ChatHeader from "./ChatHeader.jsx"
import MessageInput from "./MessageInput.jsx"
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx"
import { useAuthStore } from "../store/useAuthStore.js"
import { formatMessageTime } from "../lib/utils.js"
import Highlight from "./Highlight.jsx"


const ChatContainer = ({ searchTerm }) => {
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

    // Filter messages based on the search term
    const filteredMessages = searchTerm
    ? messages.filter(message =>
        message.text &&
        message.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;


  return (
    <div className="chat-container">
      <ChatHeader />
      <div>
        {filteredMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            ref={messageEndRef}
          >

            <div className="">
              <div className="">
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
              {message.text && <p className="text-sm sm:text-base"><Highlight text={message.text} highlight={searchTerm} /></p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer