import React, { useState } from 'react';

function NavBar() {
    // State to manage menu visibility on small screens
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // TODO: on render, check if admin, then show admin page
    // TODO: get current user and update pfp

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav id="navbar" className="flex items-center justify-between bg-gray-800 p-4 shadow-md relative z-10">
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <a href="/execution" className="flex items-center space-x-2">
                    <img src="https://nextjs.org/static/images/learn/next.svg" alt="Logo" className="h-8 w-auto" />
                    <span className="text-white font-bold text-xl">Scriptorium</span>
                </a>
            </div>

            {/* Desktop navigation links */}
            <div id="nav-links" className="hidden md:flex items-center space-x-6">
                <a href="/template-search" className="text-gray-200 hover:text-white transition duration-300">Code Templates</a>
                <a href="/blogs" className="text-gray-200 hover:text-white transition duration-300">Blogs</a> 
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-3 py-2">
                        Create
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
                            <a href="/execution" className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300">Code</a>
                            <a href="/blog-create" className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300">Blog</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Picture - Now visible on all screen sizes */}
            <div className="hidden md:block flex items-center space-x-4">
                <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-gray-500"
                />
            </div>

            {/* Hamburger menu icon for small screens */}
            <button
                id="hamburger-menu"
                className="md:hidden flex items-center text-white focus:outline-none"
                onClick={toggleMenu}
            >
                {/* Icon for the hamburger menu */}
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            {/* Mobile navigation links */}
            {isMenuOpen && (
                <div
                    id="nav-links-sm"
                    className="md:hidden fixed top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center space-y-6"
                >
                    {/* Mobile versions of the desktop links */}
                    <a href="/template-search" className="block text-gray-200 hover:text-white text-xl transition duration-300">Code Templates</a>
                    <a href="/blogs" className="block text-gray-200 hover:text-white text-xl transition duration-300">Blogs</a>
                    <a href="/execution" className="block text-gray-200 hover:text-white text-xl transition duration-300">Code</a>
                    <a href="/blog-create" className="block text-gray-200 hover:text-white text-xl transition duration-300">Create Blog</a>
                    
                    {/* Profile Picture */}
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="h-20 w-20 rounded-full border-2 border-gray-500"
                    />
                    
                    {/* Close Menu Button */}
                    <button
                        className="text-gray-200 hover:text-white text-xl transition duration-300"
                        onClick={toggleMenu}
                    >
                        Close Menu
                    </button>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
