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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Find New Contacts</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email"
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary" disabled={isSearching}>
          {isSearching ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <Search className="size-4" />
              Search
            </>
          )}
        </button>
      </form>
      
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((user) => (
            <div key={user._id} className="bg-base-200 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.fullName}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => sendContactRequest(user._id)}
                className="btn btn-sm btn-primary gap-1"
              >
                <UserPlus className="size-4" />
                Add Contact
              </button>
            </div>
          ))}
        </div>
      ) : (
        searchQuery && !isSearching && (
          <div className="text-center p-8">
            <p className="text-gray-500">No users found matching "{searchQuery}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default FindContactsPage;