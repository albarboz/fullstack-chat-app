# **Chat Application Documentation**

### **What it is**

A modern real-time chat application with user authentication, contact management, and instant messaging capabilities. This app allows users to find contacts, send/receive messages in real-time, manage their profiles, and customize their experience. 

## **Tech Stack**

**Frontend:**

* React with vite
* Tailwind css for styling
* Zustand for state management
* Socket.IO for real-time communication
* React Router for navigation

**Backend:**

* Node.js with Express
* MongoDB for data storage 
* JWT for authentication
* Socket.IO for real-time features
* Cloudinary for media storage

## **Project Structure**

**Frontend**

<img width="426" alt="Screenshot 2025-04-16 at 8 09 43 AM" src="https://github.com/user-attachments/assets/15b93130-163c-4865-9f35-f1aec32b1cd4" />

**Backend**

<img width="539" alt="Screenshot 2025-04-16 at 8 11 17 AM" src="https://github.com/user-attachments/assets/7f3340c0-1f6e-4ea2-8eb4-d519615f80b3" />



***

## **Key Features**

**Authentication**

* Signup and login with email/password
* JWT-based auth with secure cookies
* Protected routes requiring authentication

**Messaging**

* Real-time message delivery 
* Message history persistence
* Online status indicators 
* Typing indicators 

**Contacts**

* User search functionality 
* Contact requests system 
* Contact list management 
* Online status of contacts

**User Profile**

* Profile customization
* Settings management
* Theme preferences 


## **State Management**
The application uses Zustand stores to manage application state:
* **AuthStore:** User authentication and session
* **ChatStore:** Messages and active conversations
* **ContactStore:** Contact list and requests
* **ThemeStore:** UI theme preferences 


### **API Endpoints**

**Authentication**

* `POST /api/auth/signup:` Register new user

* `POST /api/auth/login:` Authenticate user

* `GET /api/auth/logout:` End user session

* `GET /api/auth/status:` Check auth status

**Messages**

* `GET /api/messages/:contactId:` Get message history

* `POST /api/messages/send:` Send new message

**Contacts**

* `GET /api/contacts:` get user contacts

* `POST /api/contacts/request:` send contact request

* `PUT /api/contacts/accept:` accept contact request

* `GET /api/contacts/requests:` get pending requests

* `GET /api/contacts/find:` Search for users

**User**

* `GET /api/users/profile:` get user profile

* `PUT /api/users/profile:` get user profile


### **Real-time Communication**

Socket.IO powers real time features:
* New messages appear instantly
* Online status updates in real-time
* Contact request notifications

***


### **Getting Started**
**Setup Requirements**
* Node.js (v14 or higher)
* MongoDB instance
* Cloudinary account (optional, for media)

**Development**
1. Clone the repository 
2. Install dependencies: 
* `npm install --prefix frontend`
* `npm install --prefix backend`

3. Set up environment variables (see .env.example)
4. Start development servers: 

`# Frontend`
`npm run dev --prefix frontend`

`# Backend`
`npm run dev --prefix backend`

**Production**

1. Build the application:
`npm run build`

2. Start the server: 
`npm start`

**Security Features**
* Password hashing with bcrypt
* JWT-based authentication
* CORS protection
* Input validation
* HTTP-only cookies

### **Data Models**
**User**
* Username
* Email
* Password (hashed)
* Profile information

**Message**
* Sender
* Receiver 
* Content
* Timestamp
* Read Status

**Contact**
* User reference
* Contact reference
* Status (pending/accepted)
* Created date 

### **User Flows**
User Flows

1. **New User:** Signup → Find contacts → Send requests → Start chatting
2. **Returning User:** Login → View messages → Respond to contacts → Manage profile

### **Responsive Design**
The application is fully responsive with optimized layouts for:
* Desktop
* Tablet
* Mobile devices
 

