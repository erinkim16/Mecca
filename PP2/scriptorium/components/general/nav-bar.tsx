import { useState } from "react";

function NavBar() {
    // State to manage menu visibility on small screens
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav id="navbar" className="flex items-center justify-between bg-gray-800 p-4 shadow-md relative z-10">
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-2">
                    <img src="https://nextjs.org/static/images/learn/next.svg" alt="Logo" className="h-8 w-auto" />
                    <span className="text-white font-bold text-xl">MySite</span>
                </a>
            </div>

            {/* Desktop navigation links */}
            <div id="nav-links" className="hidden md:flex items-center space-x-6">
                <a href="/about" className="text-gray-200 hover:text-white transition duration-300">About</a>
                <a href="/blog" className="text-gray-200 hover:text-white transition duration-300">Blog</a>
                <a href="/contact" className="text-gray-200 hover:text-white transition duration-300">Contact</a>
            </div>

            {/* Profile Picture - Now visible on all screen sizes */}
            <div className="flex items-center space-x-4">
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
                    <a href="/about" className="block text-gray-200 hover:text-white text-xl transition duration-300">About</a>
                    <a href="/blog" className="block text-gray-200 hover:text-white text-xl transition duration-300">Blog</a>
                    <a href="/contact" className="block text-gray-200 hover:text-white text-xl transition duration-300">Contact</a>
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
