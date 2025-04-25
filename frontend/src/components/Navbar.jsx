import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js'
import { ArrowLeft, LogOut, User, Settings, Menu, MessageCircleMore, Search } from 'lucide-react';
import ContactRequestBadge from './ContactRequestBadge';
import ChatHeader from './ChatHeader.jsx';

const Navbar = ({ showBack = false, onBack, searchTerm, setSearchTerm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null)
  const menuButtonRef = useRef(null)

  const { logout, authUser } = useAuthStore()

  const toggleModal = () => { setIsModalOpen(prev => !prev) }

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

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = '/login';
  };

  return (
    <nav>
      <div className="container">
        <div className="navbar-left">
          {showBack ? (
            <div className="menu-container">
              <button className="back-button" onClick={onBack}>
                <ArrowLeft size={30} />
              </button>
            
            </div>


          ) : (
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
                    <li><a href="/"><MessageCircleMore />Chats</a></li>
                    <li><a href="/settings"><Settings />Settings</a></li>
                    <li><a href="/profile"><User />Profile</a></li>
                    <li><a href="/logout" onClick={handleLogout}><LogOut />Logout</a></li>
                    <li><ContactRequestBadge /></li>
                  </ul>
                </div>
              )}
            </div>

          )}

          {!showBack ? (
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="search-bar"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          ) : (

            <ChatHeader />

          )}
        </div>
      </div>
    </nav>

  )
}

export default Navbar