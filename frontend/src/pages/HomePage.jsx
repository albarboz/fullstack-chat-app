import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
// import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
import ConversationList from '../components/ConversationList.jsx'
import Navbar from '../components/Navbar.jsx'
import { useEffect } from 'react'

const HomePage = () => {
  const { selectedUser } = useChatStore()

  // APPLE SPECIFIC SECTION
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  window.addEventListener('resize', setViewportHeight);
  setViewportHeight();

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera

    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      document.body.classList.add('is-ios')
    } else if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
      document.body.classList.add('is-macos')
    }
  }, [])


  return (
    <div className='container homepage'>
      <Navbar />

      <div className='content-area'>
        {selectedUser ? <ChatContainer /> : <ConversationList />}
      </div>

      <button className="fixed-button">Click Me!</button>
    </div>
  )
}

export default HomePage
