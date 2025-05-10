// React & core
import { useEffect } from "react"

// State and side-effects 
import { useChatStore } from "../../store/useChatStore.js"
import { useAuthStore } from "../../store/useAuthStore.js"
import { useSocketStore } from "../../store/useSocketStore.js"

// Components & utilities
import MessageInput from '../MessageInput/MessageInput.jsx'
import Highlight from "../Highlight.jsx"
import { formatMessageTime } from "../../lib/utils.js"

// Assets & Utilities
import DoubleCheckmark from '../../assets/double-checkmark.png';
import SingleCheckmark from '../../assets/single-checkmark.png';
import '../../components/ChatContainer/ChatContainer.css'

const ChatContainer = ({ searchTerm }) => {
  const { messages, loadChatHistory, selectedUser, listenForIncomingMessages, stopListeningForMessages, updateMessageReadStatus } = useChatStore()
  const { authUser } = useAuthStore()
  const { socket, onMessageReadUpdate, offMessageReadUpdate } = useSocketStore();



  useEffect(() => {
    loadChatHistory(selectedUser._id)
    listenForIncomingMessages()
    return () => stopListeningForMessages()
  }, [selectedUser._id, loadChatHistory, listenForIncomingMessages, stopListeningForMessages])

  // Emit read receipts for unread messages received by authUser
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => msg.receiverId === authUser._id && !msg.readBy?.some(rb => rb.userId === authUser._id)
    );

    if (socket && unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg._id);

      // ✅ 1. Optimistically update local state
      messageIds.forEach(messageId => {
        updateMessageReadStatus(messageId, authUser._id, new Date().toISOString());
      });

      // ✅ 2. Emit to server
      socket.emit('message_read', {
        messageIds,
        readerId: authUser._id
      });
    }
  }, [messages, authUser._id, socket, updateMessageReadStatus]);

  // Subscribe to read status updates
  useEffect(() => {
    const handleReadUpdate = ({ messageId, readerId, readAt }) => {
      updateMessageReadStatus(messageId, readerId, readAt);
    };

    onMessageReadUpdate(handleReadUpdate);
    return () => offMessageReadUpdate();
  }, [onMessageReadUpdate, offMessageReadUpdate, updateMessageReadStatus]);




  // Filter messages based on the search term
  const filteredMessages = searchTerm
    ? messages.filter(message =>
      message.text &&
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : messages;

  const lastSentMessageId = filteredMessages
    .slice()
    .reverse()
    .find(msg => msg.senderId === authUser._id)?._id

  const getCheckmarkStatus = (message) => {
    if (message.senderId !== authUser._id) return null; // Only show checkmarks on your own sent messages

    const isLast = message._id === lastSentMessageId;
    const hasBeenRead = message.readBy?.some(rb => rb.userId === selectedUser._id);

    if (isLast) {
      return hasBeenRead
        ? <img src={DoubleCheckmark} alt="Read" className="double" />
        : <img src={SingleCheckmark} alt="Delivered" className="double" />;;  // Or replace with a single-check image if you have one
    }

    return <img src={DoubleCheckmark} alt="Delivered" className="double" />;
  };

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
                </time>
                {message.senderId === authUser._id && (
                  <span >{getCheckmarkStatus(message)}</span>
                )}

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