# TheLiveChatters — Live Websocket App

![TheLiveChatters](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)

A real-time chat application using WebSockets with roles and auth flow.

---

## Features

- **Authentication** – Secure user login and registration with JWT,Httpsonly cookies and user roles
- **Database** – Supabase for storing users, brands, assets, and subscription data.
- **Frontend** –  Responsive UI built with TypeScript, Vite  and TailwindCSS.
- **Backend API** –  Node.js + Express handles apis, authentication, and data management.
- **Versioning & Changelog** – Semantic versioning with a clear project evolution record.
- **Deployment Ready** – Easily deploy frontend (Vercel) and backend (Render) with Supabase integration.

---

## Tech Stack

- Runtime: Node.js + Express.js + Websocket .
- Language: TypeScript.
- Frontend: Vite + Tailwind CSS + React
- Database & Auth: Supabase (Database and Storage).
- HTTP Client: Axios/Fetch API.
- Hosting: Vercel (Frontend) + Render (Backend) + Supabase (Database).

---

## Quick Start

### Prerequisites

- Node.js 24.18+
- Supabase project (for Database, and Storage)
- Resend API key (for sending user reset password email)

### Installations

**Clone the repository**
```bash
git clone git@github.com:Mengenes/chatapp-react.git
Install Dependencies

cd  chatapp-react/frontend/chatapp-react && pnpm install
cd chatapp-react/backend && npm install

Environment setup

cp backend/.env.example backend/.env
Update .env with your configuration:

# Backend
Supabase URL and API key

Resend API key

# Frontend
Backend     Base Url Axios
Websocket   Base Url Axios 

# Run backend
cd backend && npm run dev

# Run frontend
cd frontend/chatapp-react && pnpm run dev

Production Build
 Frontend
pnpm run build
pnpm start
Visit: http://localhost:5173

 Backend
npm run build
npm start
Visit: http://localhost:5169

Repository Structure

/Chatapp-React
├── /frontend
│    └── /chatapp-react
│       ├── /src
│       │   ├── /assets            # Assets (Images,Pictures,Icons)
│       │   ├── /components        # UI Components (Navbar,Shadcnui,Home etc.)
│       │   ├── /pages             # App pages (Home,Auth,Profile and routes file)
│       │   ├── /config            # Custom Config Files (axiosApiUrl)
│       │   ├── /lib               # Config files (shadcn utils)
│       │   ├── /store             # State Management Store (Zustand mainly)
│       │   ├── /utils              # Protected Routes  Setup
│       │   ├── App.tsx            # Main routing setup
│       │   ├── index.css          # Main Tailwind/CSS file
│       │   └── main.tsx           # React entry point
│       ├── components.json        # Contains Tailwind and Style settings for the Shadcn
│       ├── socket.ts              # Base Axios  Url for Websocket Connection
│       ├── SocketManager.tsx      # useEffect hook for  user socket connection
│       ├── vite.config.ts         # Contains build and development settings for the Vite bundler
│       └── package.json           # Lists frontend project dependencies, scripts, and metadata
│   
│
├── /backend
│   ├── /src
│   │   ├── /routes            # Express  routes (auth,user)
│   │   ├── /configs           # Config Files (PostgreSQL)
│   │   ├── /handlers          # Api Handlers (auth,user)
│   │   ├── /middlewares       # Route Middlewares (JWT,Role,Login,Socket Validation and Rate Limitter)
│   │   ├── /socket            # Websocket Interactions, Setup and CRUD (Message CRUD,Admin CRUD)
│   │   ├── /types             # Global Typescript Settings (JWTUser)
│   │   ├── /config            # Environment and DB configs
│   │   └──  index.ts          # Main Express server entry 
│   └── package.json           # Lists backend project dependencies, scripts, and metadata for Node.js
│
└── README.md
Architecture Overview
Frontend
Built with TypeScript + Vite + Tailwind CSS

Connects to Supabase for Database, backend API for CRUD operation and Auth 

Backend
Built with Node.js + Express + Websocket

Handles authentication, user messages  and database writes via Supabase

Supabase  Tables
Table	           Purpose
users	           Stores user accounts
password_resets    Stores password reset token and timestamp
messages           Stores user messages with user id and timestamp


Example API Endpoints
Auth Routes
Endpoint	       Method	Description
/api/auth/register	POST	Register new user
/api/auth/login	    POST	Log in user
 

Example Request:

POST /api/auth/login	
{
 "username":"username",
 "password":"password"   
      }
Example Response:

POST /api/auth/login	
{
 "user":{
        "id":"userData.id",
        "email":"userData.email",
        "username":"userData.username",
        "role":"userData.role",
      }
      }



Environment Variables

 Backend

Variable	     Description
DATABASE_URL        Supabase Database URL
PORT	            Backend port (default: 3000)
RESEND_API_KEY      Resend Private API key
JWT_SECRET          JWT secret for token verify
NODE_ENV            For switching Cookie Options prod to dev
CLIENT_URL          Client/Frontend URL for CORS 

 Frontend

Variable	     Description

VITE_AXIOS_API_URL   Axios Base Route URL   
VITE_SOCKETIO_BASEURL Axios Base SocketIO URL
Versioning & Changelog

Keep a CHANGELOG.md file documenting updates.

Use Semantic Versioning (MAJOR.MINOR.PATCH):

Example:

1.1.0 → Added new features.
Contributing
We welcome contributions from developers who want to improve Admin-Dashboard!
Follow these steps to contribute effectively:

Fork the Repository
Click the Fork button on GitHub to create your copy.

Clone Your Fork

git clone git@github.com:<your-username>/chatapp-react.git
Create a Feature Branch

git checkout -b feat/your-feature-name
Set Up the Environment
Follow setup instructions in README.

Follow Code Style

npm run lint
Use Clear Commit Messages
feat: – new feature

fix: – bug fix

docs: – documentation update

refactor: – code restructuring


Description of changes

Issue references (e.g., Closes #12)

Screenshots or examples if applicable

Participate in Code Review
Be collaborative and responsive.

Code of Conduct
Be respectful, kind, and patient

Welcome feedback constructively

Avoid offensive or discriminatory language

Focus on collaboration

Credit contributors appropriately

Report concerns privately

Let’s work together to make Admin-Dashboard a project where everyone feels valued and supported. 💙

Deployment
Component	Platform	Notes
Frontend	Vercel/Netlify	Add env variables
Backend	Render/Railway	Add Supabase 
Database	Supabase    Storage + Database

License
This project is licensed under the MIT License — see the LICENSE file for details.
