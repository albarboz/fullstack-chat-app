import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
import Sidebar from "../components/Sidebar.jsx";

const HomePage = () => {
  const { selectedUser } = useChatStore()

  return (
    <div className='bg-base-300 p-0 md:p-4'>
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[100dvh] md:h-[calc(100dvh-8rem)] md:p-4 overflow-hidden'>
        <div className='flex h-full rounded-lg overflow-hidden'>
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  </div>
  )
}

export default HomePage
