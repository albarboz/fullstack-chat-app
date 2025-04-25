import React from 'react'
import { EllipsisVertical, MessageCircleMore, Mic, Search, Trash } from 'lucide-react'
import { useChatStore } from '../store/useChatStore.js'
import { useSocketStore } from '../store/useSocketStore.js'
import { useEffect, useRef, useState } from 'react'

const ChatHeader = () => {
  const { selectedUser, openChatWithUser } = useChatStore()
  const { onlineUsers } = useSocketStore()
  const isOnline = onlineUsers.includes(selectedUser._id)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)


  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])


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
        className={`chat-header--cool__close ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        ref={buttonRef}
        aria-label="Open Chat Menu"
      >
        <EllipsisVertical size={25} />
      </button>
      {isMenuOpen && (
        <div className="header-modal-menu" ref={menuRef}>
          <ul className='modal-menu'>
            <li onClick={() => alert('View Profile clicked')}><a><Search />Search</a></li>
            <li onClick={() => alert('Mute Notifications clicked')}><a><Mic />Mute Chat</a></li>
            <li onClick={() => openChatWithUser(null)}><a><Trash />Delete Chat</a></li>
          </ul>
        </div>
      )}
    </header>

  )
}

export default ChatHeader