// frontend/src/components/ContactRequestBadge.jsx
import { useEffect } from 'react';
import { useContactStore } from '../store/useContactStore.js';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const ContactRequestBadge = () => {
  const { contactRequests, getContactRequests } = useContactStore();
  
  useEffect(() => {
    getContactRequests();
    // Set up an interval to check for new requests (optional)
    const interval = setInterval(() => {
      getContactRequests();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [getContactRequests]);
  
  return (
    <Link to="/contacts/requests" className="relative">
      <UserPlus className="size-5" />
      {contactRequests.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {contactRequests.length}
        </span>
      )}
    </Link>
  );
};

export default ContactRequestBadge;