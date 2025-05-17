import React, {useState } from 'react'

// State managemnet 
import { useChatStore } from '../../store/useChatStore.js'

// Hooks
import { useViewportHeight } from '../../hooks/useViewportHeight.js'
import { useOsClass } from '../../hooks/useOsClass.js'

// Components
import Navbar from '../../components/Navbar/Navbar.jsx'
import ConversationList from '../../components/ConversationList/ConversationList.jsx'
import ChatContainer from '../../components/ChatContainer/ChatContainer.jsx'

// Pages
import '../../pages/HomePage/HomePage.css'



const HomePage = () => {
  useViewportHeight()
  useOsClass()

  const selectedUser = useChatStore(state => state.selectedUser);
  const clearSelectedUser = useChatStore(state => state.clearSelectedUser);

  const [searchTerm, setSearchTerm] = useState('')


  console.count("[HomePage render]");
  console.log("selectedUser:", selectedUser, " searchTerm:", searchTerm)




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
