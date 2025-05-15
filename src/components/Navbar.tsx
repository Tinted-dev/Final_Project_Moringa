import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trash2, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, isAdmin, isCompany, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Trash2 size={24} className="text-primary-500 mr-2" />
              <span className="text-xl font-bold text-primary-800">EcoWaste</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/companies" 
              className={`text-sm font-medium ${
                location.pathname === '/companies' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              Find Companies
            </Link>
            
            {isAuthenticated ? (
              <>
                {isCompany && (
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium ${
                      location.pathname === '/dashboard' 
                        ? 'text-primary-500 border-b-2 border-primary-500' 
                        : 'text-gray-600 hover:text-primary-500'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-sm font-medium ${
                      location.pathname.startsWith('/admin') 
                        ? 'text-primary-500 border-b-2 border-primary-500' 
                        : 'text-gray-600 hover:text-primary-500'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-primary-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-medium ${
                    location.pathname === '/login' 
                      ? 'text-primary-500 border-b-2 border-primary-500' 
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-medium px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  Register Company
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-primary-500 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg absolute w-full z-50">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/' 
                  ? 'text-primary-500 bg-primary-50' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/companies" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/companies' 
                  ? 'text-primary-500 bg-primary-50' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
              }`}
              onClick={closeMenu}
            >
              Find Companies
            </Link>
            
            {isAuthenticated ? (
              <>
                {isCompany && (
                  <Link 
                    to="/dashboard" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === '/dashboard' 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
                    }`}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname.startsWith('/admin') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
                    }`}
                    onClick={closeMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/login' 
                      ? 'text-primary-500 bg-primary-50' 
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
                  }`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-600"
                  onClick={closeMenu}
                >
                  Register Company
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;