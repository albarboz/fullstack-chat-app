// frontend/src/pages/ContactRequestsPage.jsx
import { useEffect } from 'react';
import { useContactStore } from '../store/useContactStore.js';
import { Check, X } from 'lucide-react';

const ContactRequestsPage = () => {
  const { contactRequests, getContactRequests, acceptContactRequest, rejectContactRequest } = useContactStore();
  
  useEffect(() => {
    getContactRequests();
  }, [getContactRequests]);
  
  if (contactRequests.length === 0) {
    return (
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Contact Requests</h2>
          <p className="text-gray-500">You don't have any pending contact requests.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Contact Requests</h1>
      
      <div className="space-y-4">
        {contactRequests.map((request) => (
          <div key={request.requestId} className="bg-base-200 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={request.user.profilePic || '/avatar.png'}
                alt={request.user.fullName}
                className="size-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{request.user.fullName}</h3>
                <p className="text-sm text-gray-500">{request.user.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => acceptContactRequest(request.requestId)}
                className="btn btn-sm btn-success gap-1"
              >
                <Check className="size-4" />
                Accept
              </button>
              
              <button
                onClick={() => rejectContactRequest(request.requestId)}
                className="btn btn-sm btn-error gap-1"
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