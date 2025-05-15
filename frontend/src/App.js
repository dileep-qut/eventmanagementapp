import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Event from './pages/Event';
import Home from './pages/Home';
import MyTickets from './pages/My-tickets';


import { useState,useEffect } from 'react';
import MyEventsPage from './pages/My-events';

function App() {

  const [token, setToken] = useState(null);
      useEffect(() => {
          const checkToken = () => {
            const token = localStorage.getItem('jwt');
            setToken(token);
          };
        
          
          checkToken();
        
         
          window.addEventListener('storage', checkToken);
        
          return () => {
            window.removeEventListener('storage', checkToken);
          };
        }, []);
         

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/mytickets" element={<MyTickets />} />
        <Route path="/myevents" element={<MyEventsPage />} />
        <Route path="/events/:eventId" element={<Event />} />


      </Routes>
    </Router>
  );
}

export default App;
