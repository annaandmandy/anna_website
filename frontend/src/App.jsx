import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar';
import Interests from './pages/Interests';
import Projects from './pages/Projects';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './components/footer';
import GorillaCharms from './pages/GorillaCharms';
import Booklet from './pages/Booklet';
import MessageBoard from './pages/MessageBoard';

import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/gorillacharms" element={<GorillaCharms />} />
        <Route path="/booklet" element={<Booklet />} />
        <Route path="/messageboard" element={<MessageBoard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
