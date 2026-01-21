import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar';
import Projects from './pages/Projects';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './components/footer';
import GorillaCharms from './pages/GorillaCharms';
import Booklet from './pages/Booklet';
import MessageBoard from './pages/MessageBoard';
import Live2DModel from './components/Live2DViewer';
import Game from './pages/Game';
import RuleBasedGame from './pages/RuleBasedGame';
import WeekendReport from './pages/BostonWeekendAgent';
import HireMe from './pages/HireMe';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';

import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const [count, setCount] = useState(0)

  return (
    <HelmetProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/gorillacharms" element={<GorillaCharms />} />
        <Route path="/booklet" element={<Booklet />} />
        <Route path="/messageboard" element={<MessageBoard />} />
        <Route path="/game" element={<Game />} />
        <Route path="/onsen-game" element={<RuleBasedGame />} />
        <Route path="/weekend_report" element={<WeekendReport />} />
        <Route path="/hire-me" element={<HireMe />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
      </Routes>
      <Live2DModel />
      <Footer />
    </HelmetProvider>
  );
}

export default App
