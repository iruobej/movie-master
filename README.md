# Movie Master

Movie Master is a full-stack movie discovery and AI-powered chat application built with React, TypeScript, and Netlify Functions.  
Users can search movies via the TMDB API, manage a personal watchlist, and chat with an AI assistant (“MovieBot”) for movie recommendations and questions.

---

## Features

- Movie search powered by TMDB
- Watchlist saved per user
- MovieBot AI chat
  - Powered by Google Gemini via Netlify serverless functions
  - User chat history persisted in localStorage
- Authentication-aware UI
- Responsive layout
- Sidebar navigation with hamburger menu

---

## Tech Stack

**Frontend**
- React
- TypeScript
- React Router
- CSS

**Backend / APIs**
- TMDB API
- Google Gemini API
- Netlify Functions

**Deployment**
- Netlify

## What I learned
- Securing API keys using serverless functions
- Handling asynchronous AI responses safely
- Debugging API version and model issues
- Managing persistent user chat state