# Chat Application Project Structure

## Overview
This is a full-stack chat application with a clear separation between frontend and backend services. The project follows modern best practices and is organized in a way that promotes maintainability and scalability.

## Project Structure

```
chat-app/
├── frontend/                 # React-based frontend application
│   ├── src/
│   │   ├── assets/          # Static assets (images, fonts, etc.)
│   │   ├── components/      # Reusable UI components
│   │   ├── constants/       # Application constants and configuration
│   │   ├── lib/            # Utility functions and shared logic
│   │   ├── pages/          # Page components and routing
│   │   ├── store/          # State management (Redux/Context)
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Public static files
│   ├── index.html          # HTML entry point
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Node.js/Express backend service
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models and schemas
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware functions
│   │   ├── lib/           # Utility functions and shared logic
│   │   └── index.js       # Server entry point
│   └── package.json        # Backend dependencies
│
└── package.json            # Root package.json for workspace management
```

## Key Components

### Frontend (`/frontend`)
- Built with React and Vite
- Organized by feature and functionality
- Clear separation of concerns between components, pages, and business logic
- State management through dedicated store directory
- Asset management in dedicated directories

### Backend (`/backend`)
- Node.js/Express server
- MVC-like architecture
- Clear separation of routes, controllers, and models
- Middleware for cross-cutting concerns
- Environment configuration through .env

## Development Guidelines

### Frontend Development
1. Place reusable components in `/components`
2. Page-level components go in `/pages`
3. Shared utilities and helpers in `/lib`
4. Constants and configuration in `/constants`
5. State management logic in `/store`

### Backend Development
1. Route definitions in `/routes`
2. Business logic in `/controllers`
3. Data models in `/models`
4. Shared utilities in `/lib`
5. Custom middleware in `/middleware`

## Best Practices
1. Keep components small and focused
2. Use consistent naming conventions
3. Maintain clear separation of concerns
4. Document complex logic and APIs
5. Follow the established directory structure

## Getting Started
1. Install dependencies:
   ```bash
   # Root level
   npm install
   
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

2. Start development servers:
   ```bash
   # Frontend (from frontend directory)
   npm run dev
   
   # Backend (from backend directory)
   npm run dev
   ```

## Notes for LLM Processing
- This structure is designed to be easily parseable by LLMs
- Clear hierarchical organization aids in context understanding
- Consistent naming patterns help in code generation
- Modular structure allows for focused code modifications
- Clear separation of concerns enables targeted assistance 