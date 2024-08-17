import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Appbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-zinc-800 p-4">
      <div className="container w-11/12 mx-auto flex justify-between items-center">
        <Link to={'/movies'} className="flex flex-col justify-center cursor-pointer">
            <h1 className="text-3xl font-bold text-white">
                Movie
            </h1>
        </Link>
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
              <a
                href="/setting"
                className="block px-4 py-2 border-b-2 text-gray-800 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Log out
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
