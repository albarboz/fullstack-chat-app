import { useMemo, useRef, useEffect, useCallback, useState } from "react"
import { ArrowDown, Loader } from "lucide-react"

// Import global CSS for chat styling
import '../../components/ChatContainer/ChatContainer.css'

// Zustand stores for chat data and authentication
import { useChatStore } from "../../store/useChatStore.js"
import { useAuthStore } from "../../store/useAuthStore.js"
import { useSocketStore } from "../../store/useSocketStore.js"

// Chat UI components and utilities
import MessageInput from '../MessageInput/MessageInput.jsx'
import Highlight from "../Highlight.jsx"
import { formatMessageTime } from "../../lib/utils.js"

// Assets & Utilities
import DoubleCheckmark from '../../assets/double-checkmark.png';
import SingleCheckmark from '../../assets/single-checkmark.png';

// Custom hooks handling chat load, read receipts, and subscriptions
import useLoadAndListen from '../../hooks/useLoadAndListen.js'
import useEmitReadReceipts from '../../hooks/useEmitReadReceipts.js'
import useReadReceiptSubscription from '../../hooks/useReadReceiptSubscription.js'


/**
 * ChatContainer renders the list of messages and the input box.
 * @param {object} props
 * @param {string} props.searchTerm Text to highlight and filter messages
 */


const ChatContainer = ({ searchTerm }) => {
  // Pull data and actions from our Zustand chat store
  const {
    messages,
    loadChatHistory,
    selectedUser,
    listenForIncomingMessages,
    stopListeningForMessages,
    updateMessageReadStatus,
    loadOlderMessages: storeLoadOlderMessages,
    hasMoreMessages,
  } = useChatStore()

  // Pull the authenticated user info
  const { authUser } = useAuthStore()
  const { socket, onMessageReadUpdate, offMessageReadUpdate } = useSocketStore();

  // Local state for UI controls
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // Refs 
  const chatContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const lastMessageIdRef = useRef()

  // Set up message loading and real-time listening on mount/unmount
  useLoadAndListen(selectedUser, loadChatHistory, listenForIncomingMessages, stopListeningForMessages)

  // Emit read receipts when messages update
  useEmitReadReceipts({ messages, authUserId: authUser._id, socket, updateMessageReadStatus })

  // Listen for read-receipt events from server
  useReadReceiptSubscription(onMessageReadUpdate, offMessageReadUpdate, updateMessageReadStatus)


  // Filter messages by search term (case-insensitive)
  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages
    const lower = searchTerm.toLowerCase()
    return messages.filter(m => m.text?.toLowerCase().includes(lower))
  }, [messages, searchTerm])

  // Find the ID of the last sent message for read receipt display
  const lastSentMessageId = useMemo(() => {
    return filteredMessages
      .slice()
      .reverse()
      .find(m => m.senderId === authUser._id)?._id
  }, [filteredMessages, authUser._id])

  // Determine which checkmark to show based on message read status
  const getCheckmarkStatus = useCallback((message) => {
    if (message.senderId !== authUser._id) return null;

    const isLast = message._id === lastSentMessageId;
    const hasBeenRead = message.readBy?.some(rb => rb.userId === selectedUser._id);

    if (isLast) {
      return hasBeenRead
        ? <img src={DoubleCheckmark} alt="Read" className="read-receipt double" />
        : <img src={SingleCheckmark} alt="Delivered" className="read-receipt double" />
    }

    return <img src={DoubleCheckmark} alt="Read" className="read-receipt double" />;
  }, [authUser._id, lastSentMessageId, selectedUser._id]);


  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollToBottom(false);
  }, []);

  // Load older messages handler with visual feedback
  const loadOlderMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoadingOlder) return;

    setIsLoadingOlder(true);
    const prevHeight = chatContainerRef.current?.scrollHeight || 0;

    try {
      await storeLoadOlderMessages();

      // Preserve scroll position after loading older messages
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight - prevHeight;
        }
      });
    } finally {
      setIsLoadingOlder(false);
    }
  }, [hasMoreMessages, storeLoadOlderMessages, isLoadingOlder]);

  // Handle scroll events to detect when to show scroll-to-bottom button
  // and when to load more messages
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Show scroll to bottom button when not at bottom
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollToBottom(!isNearBottom);

      // Load more messages when near top
      if (container.scrollTop < 100 && hasMoreMessages && !isLoadingOlder) {
        loadOlderMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadOlderMessages, hasMoreMessages, isLoadingOlder]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const newestId = messages[messages.length - 1]?._id;
    const container = chatContainerRef.current;

    if (newestId && newestId !== lastMessageIdRef.current) {
      // Only auto-scroll if user is already near the bottom
      if (container && container.scrollHeight - container.scrollTop - container.clientHeight < 200) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If user is scrolled up, just show the scroll-to-bottom button
        setShowScrollToBottom(true);
      }
    }

    lastMessageIdRef.current = newestId;
  }, [messages]);
  return (
    <div className="message-list">

      {/* Scrollable area for chat messages */}
      <div className="chat-messages" ref={chatContainerRef}>
        {/* Loading indicator for older messages */}

        {hasMoreMessages && (
          <div className="loading-older-messages">
            {isLoadingOlder ? (
              <div className="loader-container">
                <Loader size={20} className="animate-spin" />
                <span>Loading older messages...</span>
              </div>
            ) : (
              <button
                className="load-more-button"
                onClick={loadOlderMessages}
              >
                Load older messages
              </button>
            )}
          </div>
        )}

        {filteredMessages.map((message) => (
          <div
            key={message._id}
            className={`chat-message ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>

            {/* Message and Image */}
            <div className={`message-chat_container ${message.text && message.text.length > 33 ? 'column-layout' : 'row-layout'}`}>

              {/* {message.image && (<img src={message.image} alt="Attachment" />)} */}

              <div className="text-content">
                {/* Display text content with highlighted search terms */}
                {message.text && <p><Highlight text={message.text} highlight={searchTerm} /></p>}
              </div>

              {/* Timestamp and read status */}
              <div className="message-meta">
                <time>{formatMessageTime(message.createdAt)}</time>
                {message.senderId === authUser._id && (
                  <span >{getCheckmarkStatus(message)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* This is the element we scroll to */}
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <button 
          className="scroll-to-bottom"
          onClick={scrollToBottom}
        >
          <ArrowDown size={16} />
          <span>New messages</span>
        </button>
      )}


      {/* Input box for composing new messages */}
      <div className="message-input-wrapper">
        <MessageInput />
      </div>



    </div>

  )
}

export default ChatContainer