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

                {/* MAIN BUTTON SHOWING ALL INFO */}
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        className="conversation-list__row"
                        onClick={() => setSelectedUser(user)}
                        // style={{
                        //     display: 'flex',
                        //     width: '100%',
                        //     padding: '.5rem 0.5rem',
                        //     border: 'none',
                        //     borderTop: 'none',
                        //     borderBottom: '.5px solid #ccc',
                        //     background: 'none',
                        //     cursor: 'pointer'
                        // }}
                    >

                        {/* PROFILE PIC/AVATAR SECTION */}
                        <div className="conversation-list__avatar" style={{ marginRight: '1rem', position: 'relative' }}>
                            <img
                                src={user.profilePic || '/avatar.png'}
                                alt={user.fullName}
                                style={{ width: '60px', height: '60px', borderRadius: '50%' }}
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


                        {/* LAST MESSAGE AND NAME SECTION */}
                        <div className="conversation-list__info row" style={{ textAlign: 'left', flexDirection: 'column', flexGrow: 1}}>
                            <div className="conversation-list__name" style={{ fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>{user.fullName}</div>
                            <div className="conversation-list__preview" style={{ color: '#555', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
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
