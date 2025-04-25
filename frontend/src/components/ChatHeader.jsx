import React from 'react'
import { EllipsisVertical } from 'lucide-react'
import { useChatStore } from '../store/useChatStore.js'
import { useSocketStore } from '../store/useSocketStore.js'

const ChatHeader = () => {
  const { selectedUser, openChatWithUser } = useChatStore()
  const { onlineUsers } = useSocketStore()
  const isOnline = onlineUsers.includes(selectedUser._id)

  return (


    <header className="chat-header--cool">



      <div className="chat-header--cool__avatar">
        <img
          src={selectedUser.profilePic || '/avatar.png'}
          alt={selectedUser.fullName}
        />
        <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
      </div>
      <div className="chat-header--cool__info">
        <h3>{selectedUser.fullName}</h3>
        <p>{isOnline ? 'Online now' : 'last seen 4/9/2025'}</p>
      </div>
      <button
        className="chat-header--cool__close"
        onClick={() => openChatWithUser(null)}
        aria-label="Close Chat"
      >
        <EllipsisVertical size={20} />
      </button>
    </header>

  )
}

export default ChatHeader