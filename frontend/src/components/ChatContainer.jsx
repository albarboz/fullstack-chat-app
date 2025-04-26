import { useChatStore } from "../store/useChatStore.js"
import { useEffect, useRef } from "react"
import ChatHeader from "./ChatHeader.jsx"
import MessageInput from "./MessageInput.jsx"
import { useAuthStore } from "../store/useAuthStore.js"
import { formatMessageTime } from "../lib/utils.js"
import Highlight from "./Highlight.jsx"


const ChatContainer = ({ searchTerm }) => {
  const { messages, loadChatHistory, selectedUser, listenForIncomingMessages, stopListeningForMessages } = useChatStore()
  const { authUser } = useAuthStore()


  useEffect(() => {
    loadChatHistory(selectedUser._id)
    listenForIncomingMessages()

    return () => stopListeningForMessages()
  }, [selectedUser._id, loadChatHistory, listenForIncomingMessages, stopListeningForMessages])


  // Filter messages based on the search term
  const filteredMessages = searchTerm
    ? messages.filter(message =>
      message.text &&
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : messages;


  return (
    <div className="chat-container">
      {/* <ChatHeader /> */}

      {/* Chat Messages */}
      <div className="chat-messages">



          {filteredMessages.map((message) => (
            <div
              key={message._id}
              className={`chat-message ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            >

              {/* Avatar */}
              <div>
                <img
                  src={message.senderId === authUser._id ? authUser.profilePic || '/avatar.png' :
                    selectedUser.profilePic || '/avatar.png'}
                  alt="profile pic"
                />
              </div>

              {/* Time */}
              <div>
                <time className="text-xs opacity-50 ml-1">
                  <time>{formatMessageTime(message.createdAt)}</time>
                </time>
              </div>

              {/* Message and Image */}
              <div>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                  />
                )}
                {message.text && <p><Highlight text={message.text} highlight={searchTerm} /></p>}
              </div>
            </div>
          ))}
        </div>

        <div className="message-input-wrapper">
          <MessageInput />
        </div>
    </div>
  )
}

export default ChatContainer