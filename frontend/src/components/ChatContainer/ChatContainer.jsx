import { useChatStore } from "../../store/useChatStore.js"
import { useEffect, useRef } from "react"
// import ChatHeader from "../ChatHeader/ChatHeader.jsx"
import MessageInput from '../MessageInput/MessageInput.jsx'
import { useAuthStore } from "../../store/useAuthStore.js"
import { formatMessageTime } from "../../lib/utils.js"
import Highlight from "../Highlight.jsx"
import '../../components/ChatContainer/ChatContainer.css'


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
    <div className="message-list">


      {/* Chat Messages */}
      <div className="chat-messages">



        {filteredMessages.map((message) => (
          <div
            key={message._id}
            className={`chat-message ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
          >

            {/* Avatar */}



            {/* Message and Image */}
            <div
              className={`message-chat_container ${message.text && message.text.length > 33 ? 'column-layout' : 'row-layout'}`}
            >

              {/* {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                />
              )} */}
              
              <div className="text-content">
                {message.text && <p><Highlight text={message.text} highlight={searchTerm} /></p>}
              </div>

              <div className="message-meta">
                <time>
                  {formatMessageTime(message.createdAt)}
                  {message.senderId === authUser._id && (
                    <span className="checkmarks">✔️✔️</span>
                  )}
                </time>
              </div>

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