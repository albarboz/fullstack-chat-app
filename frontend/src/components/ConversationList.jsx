import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
// import { SidebarSkeleton } from './skeletons/SidebarSkeleton.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import { formatMessageDate } from '../lib/utils.js'
import Highlight from './Highlight.jsx'

const ConversationList = ({ searchTerm }) => {
    const { getUsers, users, setSelectedUser, isUsersLoading, getMessages, messages, getAllMessages } = useChatStore()
    const { onlineUsers } = useAuthStore()
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    useEffect(() => {
        getUsers()
        getAllMessages()
    }, [getUsers, getAllMessages])


    // Step 1: Find matching messages
    const filteredMessages = searchTerm
        ? messages.filter(
            (msg) =>
                msg.text &&
                msg.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : []

    // Step 2: Create a map of userId => matched message
    const matchedMessageMap = new Map()
    filteredMessages.forEach((msg) => {
        const otherUserId = msg.senderId === useAuthStore.getState().authUser._id
            ? msg.receiverId
            : msg.senderId
        if (!matchedMessageMap.has(otherUserId)) {
            matchedMessageMap.set(otherUserId, msg)
        }
    })

    // Step 3: Filter users by name OR by matched messages
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matchedMessageMap.has(user._id)
    )

    // Step 4: Sort by newest matched message or lastMessage
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aMsg = matchedMessageMap.get(a._id) || a.lastMessage
        const bMsg = matchedMessageMap.get(b._id) || b.lastMessage
        const dateA = new Date(aMsg?.createdAt || 0)
        const dateB = new Date(bMsg?.createdAt || 0)
        return dateB - dateA
    })



    //   if (isUsersLoading) return <SidebarSkeleton />

    return (
        <div className="conversation-list__rows">

            {/* MAIN BUTTON SHOWING ALL INFO */}
            {/* iterate through each convo */}
            {sortedUsers.map((user) => (
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
                                {user.lastMessage?.createdAt ? formatMessageDate(user.lastMessage.createdAt) : ''}
                            </div>
                        </div>

                        <div className="conversation-list__preview">
                            {matchedMessageMap.has(user._id) ? (
                                <Highlight
                                    text={matchedMessageMap.get(user._id).text}
                                    highlight={searchTerm}
                                />
                            ) : user.lastMessage ? (
                                <Highlight text={user.lastMessage.text} highlight={searchTerm} />
                            ) : (
                                'No messages yet'
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default ConversationList
