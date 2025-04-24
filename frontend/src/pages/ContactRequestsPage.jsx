// frontend/src/pages/ContactRequestsPage.jsx
import { useEffect } from 'react';
import { useContactStore } from '../store/useContactStore.js';
import { Check, X } from 'lucide-react';

const ContactRequestsPage = () => {
  const { contactRequests, fetchContactRequests, acceptContactRequest, rejectContactRequest } = useContactStore();
  
  useEffect(() => {
    fetchContactRequests();
  }, [fetchContactRequests]);
  
  if (contactRequests.length === 0) {
    return (
      <div>
        <div>
          <h2>No Contact Requests</h2>
          <p>You don't have any pending contact requests.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Contact Requests</h1>
      
      <div>
        {contactRequests.map((request) => (
          <div key={request.requestId}>
            <div>
              <img
                src={request.user.profilePic || '/avatar.png'}
                alt={request.user.fullName}
              />
              <div>
                <h3>{request.user.fullName}</h3>
                <p>{request.user.email}</p>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => acceptContactRequest(request.requestId)}
              >
                <Check className="size-4" />
                Accept
              </button>
              
              <button
                onClick={() => rejectContactRequest(request.requestId)}
              >
                <X className="size-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactRequestsPage;