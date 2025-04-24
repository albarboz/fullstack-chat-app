// frontend/src/pages/FindContactsPage.jsx
import { useState } from 'react';
import { axiosInstance } from '../lib/axios.js';
import { useContactStore } from '../store/useContactStore.js';
import { Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const FindContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { sendContactRequest } = useContactStore();
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // New endpoint needed in backend for searching users
      const res = await axiosInstance.get(`/users/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (error) {
      toast.error('Failed to search for users');
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div>
      <h1>Find New Contacts</h1>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? (
            <span></span>
          ) : (
            <>
              <Search className="size-4" />
              Search
            </>
          )}
        </button>
      </form>
      
      {searchResults.length > 0 ? (
        <div>
          {searchResults.map((user) => (
            <div key={user._id}>
              <div>
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.fullName}
                />
                <div>
                  <h3>{user.fullName}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => sendContactRequest(user._id)}
                
              >
                <UserPlus className="size-4" />
                Add Contact
              </button>
            </div>
          ))}
        </div>
      ) : (
        searchQuery && !isSearching && (
          <div>
            <p>No users found matching "{searchQuery}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default FindContactsPage;