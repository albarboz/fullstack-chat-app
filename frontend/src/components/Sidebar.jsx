import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { SidebarSkeleton } from './skeletons/SidebarSkeleton.jsx'
import { Users } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore.js'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [showUsers, setShowUsers] = useState(true)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const filteredUsers = showOnlineOnly
    ? users.filter(user => onlineUsers.includes(user._id))
    : users

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className='sidebar'>
      <div className='sidebar__header'>
        <div className='sidebar__toggle' >
          <button onClick={() => setShowUsers(!showUsers)}>
            <Users size={14} />
          </button>
          {showUsers && (
            <div className='sidebar__filter'>
              <label>
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  />
                <span>Show online only</span>
              </label>
              <span className='sidebar__online-count'>({onlineUsers.length - 1} online)</span>
            </div>
          )}
          </div>
      </div>



      {showUsers && (
        <div className='sidebar__user-list'>
          {filteredUsers.map((user) => (
            <button 
              key={user._id} 
              onClick={() => setSelectedUser(user)}
            >
              <div className='sidebar__avatar-wrapper'>
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.fullName}
                />
                {onlineUsers.includes(user._id) && (<span className='sidebar__status-indicator' />)}
              </div>
              <div className='sidebar__user-info'>
                <div className='sidebar__user-name'>{user.fullName}</div>
                <div className='sidebar__user-status'>
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
