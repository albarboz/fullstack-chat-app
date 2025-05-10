import React from 'react'
import { CheckCircle, Edit, EllipsisVertical, LockIcon, MessageCircleMore, Mic, MicOff, Search, Trash } from 'lucide-react'
import { useChatStore } from '../../store/useChatStore.js'
import { useSocketStore } from '../../store/useSocketStore.js'
import { useEffect, useRef, useState } from 'react'
import '../../components/NavChatHeader/NavChatHeader.css'
import { formatMessageTime } from '../../lib/utils.js'

const NavChatHeader = () => {
  const { selectedUser, openChatWithUser } = useChatStore()
  const { onlineUsers, typingUsers } = useSocketStore()
  const isOnline = onlineUsers.includes(selectedUser._id)
  const isTyping = typingUsers.includes(selectedUser._id);



  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)



  const lastReadAt = selectedUser.readAt;



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

      {/* Modal avatar */}
      <div className="chat-header--cool__avatar">
        <img
          src={selectedUser.profilePic || '/avatar.png'}
          alt={selectedUser.fullName}
        />
        <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
      </div>

      {/* Modal fnfo */}
      <div className="chat-header--cool__info">
        <h3>{selectedUser.fullName}</h3>
        <p>
          {isTyping
            ? 'Typing…'
            : isOnline
              ? 'Online now'
              : selectedUser.readAt
                ? `Seen at ${formatMessageTime(selectedUser.readAt)}`
                : 'Offline'
          }
        </p>
      </div>

      {/* Modal Button */}
      <button
        className={`chat-header--cool__close ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        ref={buttonRef}
        aria-label="Open Chat Menu"
      >
        <EllipsisVertical size={27} className='ellipsis-icon' />
      </button>

      {/* Modal Window */}
      {isMenuOpen && (
        <div className="header-modal-menu" ref={menuRef}>
          <ul className='modal-menu'>
            <li onClick={() => alert('Search clicked')}><a><Search className='modal-icons' />Search</a></li>
            <li onClick={() => alert('Mute Notifications clicked')}><a><Edit className='modal-icons' />Edit</a></li>
            <li onClick={() => alert(null)}><a><MicOff className='modal-icons' />Mute...</a></li>
            <li onClick={() => alert(null)}><a><CheckCircle className='modal-icons' />Select messages</a></li>
            <li onClick={() => alert(null)}><a><LockIcon className='modal-icons' />Block user</a></li>
            <div className='mod'></div>
            <li onClick={() => openChatWithUser(null)} className='delete-chat'><a><Trash className='modal-icons delete' />Delete Chat</a></li>
          </ul>
        </div>
      )}

    </header>

  )
}

export default NavChatHeader