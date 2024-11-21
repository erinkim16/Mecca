import { useState } from "react";

// SRC: From Alessia Ruberto's Prep 9

function NavBar() {
    // State to manage menu visibility on small screens
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    return (
        <nav id="navbar" className="flex items-center justify-between bg-gray-700 p-4">
            <div className="logo">
                <a href="/">
                    <img src="https://nextjs.org/static/images/learn/next.svg" alt="Next.js logo" className="h-8 w-auto" />
                </a>
            </div>
            {/* Desktop navigation links */}
            <div id="nav-links" className="hidden md:flex items-center space-x-4">
                <a href="/about" className="text-white">About</a>
                <a href="/blog" className="text-white">Blog</a>
            </div>
            {/* Hamburger menu icon for small screens */}
            <button
                id="hamburger-menu"
                className="md:hidden flex items-center text-white focus:outline-none"
                onClick={toggleMenu}
            >
                {/* Icon for the hamburger menu */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            {/* Mobile navigation links */}
            {isMenuOpen && (
                <div id="nav-links-sm" className="md:hidden absolute top-14 right-4 bg-gray-700 rounded-lg shadow-lg p-4 space-y-2">
                    <a href="/about" className="block text-white">About</a>
                    <a href="/blog" className="block text-white">Blog</a>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
