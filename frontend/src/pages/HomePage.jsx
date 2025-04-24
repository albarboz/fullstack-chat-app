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
    document.documentElement.style.setProperty(
      '--vh',
       `${window.innerHeight * 0.01}px`
    );
  };
  
  ['resize','scroll','orientationchange'].forEach(evt =>
    window.addEventListener(evt, setViewportHeight)
  );
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
      <div className='navbar-container'>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className='content-area'>
        {selectedUser ? <ChatContainer searchTerm={searchTerm} /> : <ConversationList searchTerm={searchTerm} />}
      </div>


      {/* <button className="fixed-button">
      <Link to="/contacts/find">
      Find niggas
      </Link>
      </button> */}

    </div>
  )
}

export default HomePage
