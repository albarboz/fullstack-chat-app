import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
// import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
import ConversationList from '../components/ConversationList.jsx'
import Navbar from '../components/Navbar.jsx'

const HomePage = () => {
  const { selectedUser } = useChatStore()



  return (
    <div className='container homepage'>

      {/* <Sidebar /> */}
      <Navbar />
      <div className='content-area'>
      {selectedUser ? <ChatContainer /> : <ConversationList />}
      </div>

       {/* Floating Button */}
       <button className="fixed-button">Click Me!</button>
    </div>
  )
}

export default HomePage
