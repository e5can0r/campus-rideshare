import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import BrowseRides from './pages/BrowseRides';
import PostRide from './pages/PostRide';
import NavBar from './components/NavBar';
import RideDetails from './pages/RideDetails';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Profile from './pages/Profile';
import Home from './pages/Home'; // Add this import
//import './App.css';

function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  return auth?.user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Show Home page at root */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<BrowseRides />} />
        <Route path="/post" element={<PostRide />} />
        <Route path="/ride-details" element={<RideDetails />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
