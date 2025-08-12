import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isActive(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      } ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚗</span>
              </div>
              <span className="font-bold text-xl text-gray-900">CampusRide</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink> {/* ✅ Added Home link */}
            {!auth?.user ? (
              <>
                <NavLink to="/browse">Browse Rides</NavLink>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/login">Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/browse">Browse Rides</NavLink>
                <NavLink to="/post">Post Ride</NavLink>
                <NavLink to="/profile">Profile</NavLink>
              </>
            )}
          </div>

          {/* User Info (Desktop) */}
          {auth?.user && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                  <span className="text-primary-700 font-medium text-sm">
                    {auth.user.name?.charAt(0).toUpperCase()}
                  </span>
                </Link>
                <span className="text-sm text-gray-700">Hi, {auth.user.name}</span>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (you can add state to toggle this) */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink to="/" className="block px-3 py-2">Home</NavLink> {/* ✅ Added Home link */}
          {!auth?.user ? (
            <>
              <NavLink to="/browse" className="block px-3 py-2">Browse Rides</NavLink>
              <NavLink to="/register" className="block px-3 py-2">Register</NavLink>
              <NavLink to="/login" className="block px-3 py-2">Login</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/browse" className="block px-3 py-2">Browse Rides</NavLink>
              <NavLink to="/post" className="block px-3 py-2">Post Ride</NavLink>
              <NavLink to="/profile" className="block px-3 py-2">Profile</NavLink>
              <div className="px-3 py-2 text-sm text-gray-500">
                Hi, {auth.user.name}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
