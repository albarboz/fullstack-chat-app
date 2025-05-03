import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js'
import { ArrowLeft, LogOut, User, Settings, Menu, MessageCircleMore, Search, UserPlus } from 'lucide-react';
import NavChatHeader from '../NavChatHeader/NavChatHeader.jsx'
import '../../components/Navbar/Navbar.css'
import { useContactStore } from '../../store/useContactStore.js';

const Navbar = ({ showBack = false, onBack, searchTerm, setSearchTerm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null)
  const menuButtonRef = useRef(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { contactRequests, fetchContactRequests } = useContactStore();



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


  useEffect(() => {
    fetchContactRequests();
    const interval = setInterval(() => {
      fetchContactRequests();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchContactRequests]);

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
                <ArrowLeft size={35} />
              </button>

            </div>


          ) : (
            <div className="menu-container">
              <button
                className={`menu-button ${isModalOpen ? 'active' : ''}`}
                onClick={toggleModal}
                ref={menuButtonRef}
              >
                <Menu size={22} />
              </button>
              {isModalOpen && (
                <div className="modal-content" ref={modalRef}>
                  <ul className="modal-menu">
                    <li><a href="/"><MessageCircleMore className='modal-icons' />Chats</a></li>
                    <div className='mod'></div>
                    <li><a href="/settings"><Settings className='modal-icons' />Settings</a></li>
                    <div className='mod'></div>
                    <li><a href="/profile"><User className='modal-icons' />Profile</a></li>
                    <li><a href="/logout" onClick={handleLogout}><LogOut className='modal-icons' />Logout</a></li>
                    <li><a href="/contacts/requests">
                      <UserPlus className='modal-icons' />
                      Requests
                      {contactRequests.length > 0 && (
                        <>
                          ({contactRequests.length})
                        </>
                      )}
                    </a>
                    </li>
                  </ul>
                  <footer>
                    Al-Chat Web Version 1.0
                  </footer>
                </div>
              )}
            </div>

          )}

          {!showBack ? (
            <div className="search-container">
              <Search size={20} className={`search-icon ${isSearchFocused ? 'focused' : ''}`} />
              <input
                type="text"
                className={`search-bar ${isSearchFocused ? 'focused' : ''}`} placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          ) : (

            <NavChatHeader />

          )}
        </div>
      </div>
    </nav>

  )
}

export default Navbar