// frontend/src/components/ContactRequestBadge.jsx
import { useEffect } from 'react';
import { useContactStore } from '../store/useContactStore.js';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const ContactRequestBadge = () => {
  const { contactRequests, fetchContactRequests } = useContactStore();

  useEffect(() => {

    fetchContactRequests();

    const interval = setInterval(() => {
      fetchContactRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchContactRequests]);

  return (
    <Link to="/contacts/requests">
      <UserPlus />
      Friends
      {contactRequests.length > 0 && (
        <>
          ({contactRequests.length})
        </>
      )}
    </Link>
  );
};

export default ContactRequestBadge;