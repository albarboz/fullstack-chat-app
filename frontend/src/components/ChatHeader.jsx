import React from 'react'
import { X } from 'lucide-react'
import { useChatStore } from '../store/useChatStore.js'
import { useSocketStore } from '../store/useSocketStore.js'

const ChatHeader = () => {
    const { selectedUser, openChatWithUser } = useChatStore()
    const { onlineUsers } = useSocketStore()

    return (
        <div>

            {/* Avatar */}
            {/* <div>
                <img src={selectedUser.profilePic || '/avatar.png'} alt={selectedUser.fullName} />
            </div>
             */}
            {/* User info */}
            <div>
                <h3>{selectedUser.fullName}</h3>
                <p>
                    {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                </p>
            </div>

            <button onClick={() => openChatWithUser(null)}>
                <X />
            </button>

        </div>
    )
}

export default ChatHeader