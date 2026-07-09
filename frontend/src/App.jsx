import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Verify from './pages/Verify'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Sell from './pages/Sell'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sell" element={<Sell />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App