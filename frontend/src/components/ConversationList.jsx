import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
// import { SidebarSkeleton } from './skeletons/SidebarSkeleton.jsx'
import { useAuthStore } from '../store/useAuthStore.js'

const ConversationList = () => {
  const { getUsers, users, setSelectedUser, isUsersLoading, } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const filteredUsers = showOnlineOnly
    ? users.filter(user => onlineUsers.includes(user._id))
    : users

//   if (isUsersLoading) return <SidebarSkeleton />

  return (
    <div className="conversation-list">
      <div className="conversation-list__rows">
        {filteredUsers.map((user) => (
          <button 
            key={user._id} 
            className="conversation-list__row"
            onClick={() => setSelectedUser(user)}
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.5rem 1rem',
                border: 'none',
                borderTop: '.5px solid #ccc',
                borderBottom: '.5px solid #ccc',
                background: 'none',
                cursor: 'pointer'
            }}
          >
            <div className="conversation-list__avatar" style={{ marginRight: '1rem', position: 'relative' }}>
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.fullName}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              {onlineUsers.includes(user._id) && (
                <span 
                  className="conversation-list__status-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'green',
                    border: '2px solid white'
                  }}
                />
              )}
            </div>
            <div className="conversation-list__info" style={{ textAlign: 'left' }}>
              <div className="conversation-list__name" style={{ fontWeight: 'bold' }}>{user.fullName}</div>
              <div className="conversation-list__preview" style={{ color: '#555', fontSize: '0.9rem' }}>
                {/* If your user data has a lastMessage field, you can show its text here;
                    otherwise, you can replace it with any preview or leave a placeholder */}
                {user.lastMessage ? user.lastMessage.text : 'No messages yet'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ConversationList
