import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ConversationList from '../components/ConversationList.jsx'
import ChatContainer from '../components/ChatContainer.jsx'

const HomePage = () => {
  const { selectedUser } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')


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
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className='content-area'>
        {selectedUser ? <ChatContainer searchTerm={searchTerm} /> : <ConversationList searchTerm={searchTerm} />}
      </div>

      <div className="container">
        {/* Existing content */}
        <div>
          <Link to="/contacts/find">
          </Link>
        </div>
      </div>
      <button className="fixed-button">
      <Link to="/contacts/find">
      Find niggas
      </Link>
      </button>

    </div>
  )
}

export default HomePage
