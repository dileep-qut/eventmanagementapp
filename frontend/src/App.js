import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Event from './pages/Event';
import Home from './pages/Home';
import MyTickets from './pages/My-tickets';
import PaymentSuccessPage from './pages/payment-success'
import PaymentFailurePage from './pages/payment-failure';


import { useState,useEffect } from 'react';

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
        <Route path="/success" element={<PaymentSuccessPage />} />
        <Route path="/cancel" element={<PaymentFailurePage />} />



        <Route path="/events/:eventId" element={<Event />} />


      </Routes>
    </Router>
  );
}

export default App;
