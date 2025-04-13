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
        <div className="conversation-list__rows">

            {/* MAIN BUTTON SHOWING ALL INFO */}
            {filteredUsers.map((user) => (
                <button
                    key={user._id}
                    className="conversation-list__row"
                    onClick={() => setSelectedUser(user)}
                >

                    {/* PROFILE PIC/AVATAR SECTION */}
                    <div className="conversation-list__avatar">
                        <img
                            src={user.profilePic || '/avatar.png'}
                            alt={user.fullName}
                            style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                        />
                        {onlineUsers.includes(user._id) && (
                            <span className="conversation-list__status-indicator" />
                        )}
                    </div>


                    {/* LAST MESSAGE AND NAME SECTION */}
                    <div className="conversation-list__info">
                        <div className="conversation-list__name"><h3>{user.fullName}</h3>


                            <div className="conversation-list__timestamp">
                                {user.lastMessage?.createdAt
                                    ? new Date(user.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : ''}
                            </div>

                        </div>
                        <div className="conversation-list__preview">
                            {user.lastMessage ? user.lastMessage.text : 'No messages yet'}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default ConversationList
