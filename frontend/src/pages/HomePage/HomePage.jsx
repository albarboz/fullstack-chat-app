import React, { useEffect, useState } from 'react'
import { useChatStore } from '../../store/useChatStore.js'
// import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar.jsx'
import ConversationList from '../../components/ConversationList/ConversationList.jsx'
import ChatContainer from '../../components/ChatContainer/ChatContainer.jsx'
import '../../pages/HomePage/HomePage.css'
import { useOsClass } from '../../hooks/useOsClass.js'
import { useViewportHeight } from '../../hooks/useViewportHeight.js'



const HomePage = () => {
  // summon responsive viewport var + OS body class
  useViewportHeight()
  useOsClass()

  const selectedUser = useChatStore(state => state.selectedUser);
  const clearSelectedUser = useChatStore(state => state.clearSelectedUser);

  const [searchTerm, setSearchTerm] = useState('')


  console.count("[HomePage render]");
  { console.log("selectedUser:", selectedUser, " searchTerm:", searchTerm) }




  return (
    <div className='container homepage'>

      <div className='navbar-container'>
        <Navbar
          showBack={!!selectedUser}
          onBack={clearSelectedUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <section className='content-area'>
        {selectedUser
          ? <ChatContainer searchTerm={searchTerm} />
          : <ConversationList searchTerm={searchTerm} />
        }
      </section>

      {/* <button className="fixed-button">
      <Link to="/contacts/find">
      Find niggas
      </Link>
      </button> */}

    </div>
  )
}

export default HomePage
