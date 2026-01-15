import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from '../components/Navbar.tsx'
import Login from '../components/Login.tsx'
import SignUp from '../components/SignUp.tsx'
import Home from '../components/Home.tsx'
import Search from '../components/Search.tsx'
import Movie from '../components/Movie.tsx'
import Watchlist from '../components/Watchlist.tsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movie/:id" element={<Movie />} /> {/* ':' means this part of the url is dynamic*/}
      <Route path="/watchlist" element={<Watchlist />} />
    </Routes>
  );
}

export default App
