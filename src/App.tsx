import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from '../components/Navbar.tsx'
import Login from '../pages/Login.tsx'
import SignUp from '../pages/SignUp.tsx'
import Home from '../pages/Home.tsx'
import Search from '../pages/Search.tsx'
import Movie from '../pages/Movie.tsx'
import Watchlist from '../pages/Watchlist.tsx'
import MovieBot from '../pages/MovieBot.tsx'
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
      <Route path="/moviebot" element={<MovieBot />} />
    </Routes>
  );
}

export default App
