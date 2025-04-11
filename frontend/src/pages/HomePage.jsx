import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
// import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
// import Sidebar from "../components/Sidebar.jsx";
import ConversationList from '../components/ConversationList.jsx'

const HomePage = () => {
  const { selectedUser } = useChatStore()

  return (
    <div>

      {/* <Sidebar /> */}

      <ConversationList />
      {selectedUser ? <ChatContainer /> : <div>Select a conversation to view messages</div>}
    </div>
  )
}

export default HomePage
