import React, { useEffect, useState } from 'react'
import { useChatStore } from '../../store/useChatStore.js'
// import { SidebarSkeleton } from './skeletons/SidebarSkeleton.jsx'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useSocketStore } from '../../store/useSocketStore.js'
import { formatMessageDate } from '../../lib/utils.js'
import Highlight from '../Highlight.jsx'
import '../../components/ConversationList/ConversationList.css'

const ConversationList = ({ searchTerm }) => {
    const { fetchChatUsers, users, openChatWithUser, messages, fetchAllMessages } = useChatStore()
    const { onlineUsers } = useSocketStore()

    // const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    useEffect(() => {
        fetchChatUsers()
        fetchAllMessages()
    }, [fetchChatUsers, fetchAllMessages])


    // console.log(messages)

    // If the user has typed something into the search bar, go through all the messages and keep only the ones that have text and that text includes the search term (case-insensitive).
    // But if the search bar is empty, just give me an empty list of messages.

    const filteredMessages = searchTerm ? messages.filter((msg) => msg.text && msg.text.toLowerCase().includes(searchTerm.toLowerCase())) : messages


    // For every message that matches the search, figure out who the other person is (not me), and if we haven’t already saved a match for them, store this message as their match.
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
    const filteredUsers = searchTerm
        ? users.filter(user => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matchedMessageMap.has(user._id)) : users




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
                    onClick={() => openChatWithUser(user)}
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
