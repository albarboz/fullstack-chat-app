import React from 'react'
import { useState, useRef, useEffect } from 'react';
// import { useAuthStore } from '../store/useAuthStore.js'
import { LogOut, User, Settings, Menu, MessageCircleMore, Search } from 'lucide-react';


const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null)
  const menuButtonRef = useRef(null)



  // const { logout, authUser } = useAuthStore()
  const toggleModal = () => {
    setIsModalOpen(prev => !prev)
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)

  }, [isModalOpen])


  return (
    <header>
      <div className="container">
        <div className="navbar-left">
          {/* Wrap the menu button and modal in a container */}
          <div className="menu-container">
            <button
              className={`menu-button ${isModalOpen ? 'active' : ''}`}
              onClick={toggleModal}
              ref={menuButtonRef}
            >
              <Menu size={24} />
            </button>
            {isModalOpen && (
              <div className="modal-content" ref={modalRef}>
                <ul className="modal-menu">
                  <li><a href="/" className='navbar-chat'><MessageCircleMore />Chats</a></li>
                  <li><a href="/settings"><Settings />Settings</a></li>
                  <li><a href="/profile"><User />Profile</a></li>
                  <li><a href="/logout"><LogOut />Logout</a></li>
                </ul>
              </div>
            )}
          </div>
          {/* Search bar remains next to the menu */}
          <div className='search-container'>
            <Search size={18} className='search-icon' />
            <input type="text" className="search-bar" placeholder="Search..." />
          </div>
        </div>
      </div>
    </header>

  )
}

export default Navbar