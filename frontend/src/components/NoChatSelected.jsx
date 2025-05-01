import React from 'react'
import { MessageSquare } from 'lucide-react'


const NoChatSelected = () => {
    return (
        <div>
            <div>

                {/* Icon display */}
                <div>
                    <div>
                        <div>
                            <MessageSquare size={55} className='message-square' />
                        </div>
                    </div>
                </div>

                {/* Welcome Text */}
                <h2>Welcome to Chatty!</h2>
                <p>Select a conversation from the sidebar to start chatting</p>
            </div>

        </div>
    )
}

export default NoChatSelected