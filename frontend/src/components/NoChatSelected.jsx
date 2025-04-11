import React from 'react'
import { MessageSquare } from 'lucide-react'


const NoChatSelected = () => {
    return (
        <div className='no-chat-selected-container'>
            <div className=''>

                {/* Icon display */}
                <div className=''>
                    <div className=''>
                        <div className=''>
                            <MessageSquare size={55} className='message-square'/>
                        </div>
                    </div>
                </div>

                {/* Welcome Text */}
                <h2 className=''>Welcome to Chatty!</h2>
                <p className=''>Select a conversation from the sidebar to start chatting</p>
            </div>

        </div>
    )
}

export default NoChatSelected