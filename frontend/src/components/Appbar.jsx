import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Appbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      // Perform logout request
      await axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true });
      
      // Redirect to login page or home page after successful logout
      navigate('/login'); // Change '/login' to your desired route
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-zinc-800 p-4">
      <div className="container w-11/12 mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Movie</h1>
        <div className="relative">
          <button
            onClick={handleDropdownToggle}
            className="focus:outline-none"
          >
            <img
              className="w-10 h-10 rounded-full"
              src="https://via.placeholder.com/150"
              alt="User Avatar"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <Link to="/setting">
                <a className="block px-4 py-2 border-b-2 text-gray-800 hover:bg-gray-100">
                  Settings
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
