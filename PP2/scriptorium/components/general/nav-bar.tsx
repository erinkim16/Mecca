// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import LogoutButton from "@/components/profile/logout";
// import ThemeToggle from "./theme-toggle";

// // erin's version (ugly but has template search dropdown)

// // export default NavBar;
// function NavBar() {
//   // State to manage menu visibility on small screens
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [userPfp, setUserPfp] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isPfpOpen, setIsPfpOpen] = useState(false);
//   const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const togglePfpDropdown = () => {
//     setIsPfpOpen(!isPfpOpen);
//   };

//   const toggleTemplatesDropdown = () => {
//     setIsTemplatesOpen(!isTemplatesOpen);
//   };

//   const fetchUserData = async () => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       return;
//     }

//     const userId = localStorage.getItem("userId");

//     try {
//       const response = await axios.get(`/api/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.role === "ADMIN") {
//         setIsAdmin(true);
//       }

//       setUserPfp(response.data.avatar);
//       return;
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   const handleRender = () => {
//     fetchUserData();
//   };

//   // Run on render
//   useEffect(() => {
//     handleRender();
//   }, []);

//   return (
//     <nav
//       id="navbar"
//       className="flex items-center justify-between bg-gray-800 p-4 shadow-md relative z-10"
//     >
//       <div className="flex items-center space-x-4">
//         {/* Logo */}
//         <a href="/execution" className="flex items-center space-x-2">
//           <img
//             src="https://cdn.iconscout.com/icon/free/png-256/free-coding-icon-download-in-svg-png-gif-file-formats--dev-development-programming-beautiful-flat-icons-pack-miscellaneous-459944.png"
//             alt="Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-white font-bold text-xl">Scriptorium</span>
//         </a>
//       </div>

//       {/* Desktop navigation links */}
//       <div id="nav-links" className="hidden md:flex items-center space-x-6">
//         <ThemeToggle></ThemeToggle>
//         {/* Templates Dropdown */}
//         <div className="relative">
//           {/* <button
//             onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
//             className="text-gray-200 hover:text-white transition duration-300"
//           >
//             Templates
//           </button> */}
//           <a
//             className="text-gray-200 hover:text-white transition duration-300"
//             onClick={toggleTemplatesDropdown}
//           >
//             Templates
//           </a>
//           {isTemplatesOpen && (
//             <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
//               <a
//                 href="/user-template"
//                 className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
//               >
//                 My Templates
//               </a>
//               <a
//                 href="/template-search"
//                 className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
//               >
//                 All Templates
//               </a>
//             </div>
//           )}
//         </div>

//         <a
//           href="/blogs"
//           className="text-gray-200 hover:text-white transition duration-300"
//         >
//           Blogs
//         </a>
//         {isAdmin && (
//           <a
//             href="/admin"
//             className="text-gray-200 hover:text-white transition duration-300"
//           >
//             Admin
//           </a>
//         )}

//         <div className="relative">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="px-3 py-2"
//           >
//             Create
//           </button>
//           {isMenuOpen && (
//             <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
//               <a
//                 href="/execution"
//                 className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
//               >
//                 Code
//               </a>
//               <a
//                 href="/blogs/blog-editor"
//                 className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
//               >
//                 Blog
//               </a>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="relative hidden md:block flex items-center space-x-4">
//         <img
//           src={`/avatars/${userPfp}.png`}
//           alt="Profile"
//           className="h-12 w-12 rounded-full cursor-pointer"
//           onClick={togglePfpDropdown}
//         />

//         {/* Profile Dropdown Menu */}
//         {isPfpOpen && (
//           <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
//             <a
//               href="/profilepage"
//               className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
//             >
//               View Profile
//             </a>
//             <a
//               href="/profile"
//               className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
//             >
//               Edit Profile
//             </a>
//             <LogoutButton></LogoutButton>
//           </div>
//         )}
//       </div>

//       {/* Hamburger menu icon for small screens */}
//       <button
//         id="hamburger-menu"
//         className="md:hidden flex items-center text-white focus:outline-none"
//         onClick={toggleMenu}
//       >
//         <svg
//           className="w-8 h-8"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M4 6h16M4 12h16M4 18h16"
//           ></path>
//         </svg>
//       </button>

//       {/* Mobile navigation links */}
//       {isMenuOpen && (
//         <div
//           id="nav-links-sm"
//           className="md:hidden fixed top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center space-y-6"
//         >
//           <ThemeToggle></ThemeToggle>
//           {/* Mobile versions of the desktop links */}
//           <div className="flex flex-col items-center space-y-6">
//             <a
//               href="/my-templates"
//               className="block text-gray-200 hover:text-white text-xl transition duration-300"
//             >
//               My Templates
//             </a>
//             <a
//               href="/all-templates"
//               className="block text-gray-200 hover:text-white text-xl transition duration-300"
//             >
//               All Templates
//             </a>
//           </div>
//           <a
//             href="/blogs"
//             className="block text-gray-200 hover:text-white text-xl transition duration-300"
//           >
//             Blogs
//           </a>
//           {isAdmin && (
//             <a
//               href="/admin"
//               className="block text-gray-200 hover:text-white text-xl transition duration-300"
//             >
//               Admin
//             </a>
//           )}
//           <a
//             href="/execution"
//             className="block text-gray-200 hover:text-white text-xl transition duration-300"
//           >
//             Code
//           </a>
//           <a
//             href="/blog-create"
//             className="block text-gray-200 hover:text-white text-xl transition duration-300"
//           >
//             Create Blog
//           </a>

//           {/* Profile Picture */}
//           <img
//             src={`/avatars/${userPfp}.png`}
//             alt="Profile"
//             className="h-20 w-20 rounded-full border-2 border-gray-500"
//           />

//           {/* Close Menu Button */}
//           <button
//             className="text-gray-200 hover:text-white text-xl transition duration-300"
//             onClick={toggleMenu}
//           >
//             Close Menu
//           </button>

//           <LogoutButton />
//         </div>
//       )}
//     </nav>
//   );
// }

// export default NavBar;
import React, { useState, useEffect } from "react";
import axios from "axios";
import ThemeToggle from "./theme-toggle";
import LogoutButton from "../profile/logout";

function NavBar() {
  // State to manage menu visibility on small screens
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userPfp, setUserPfp] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPfpOpen, setIsPfpOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); // State for Admin dropdown

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePfpDropdown = () => {
    setIsPfpOpen(!isPfpOpen);
  };

  const toggleTemplatesDropdown = () => {
    setIsTemplatesOpen(!isTemplatesOpen);
  };

  const toggleAdminDropdown = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.get(`/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.role === "ADMIN") {
        setIsAdmin(true);
      }

      setUserPfp(response.data.avatar);
      return;
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleRender = () => {
    fetchUserData();
  };

  // Run on render
  useEffect(() => {
    handleRender();
  }, []);

  return (
    <nav
      id="navbar"
      className="flex items-center justify-between bg-gray-800 p-4 shadow-md relative z-10"
    >
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <a href="/execution" className="flex items-center space-x-2">
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-coding-icon-download-in-svg-png-gif-file-formats--dev-development-programming-beautiful-flat-icons-pack-miscellaneous-459944.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          <span className="text-white font-bold text-xl">Scriptorium</span>
        </a>
      </div>

      {/* Desktop navigation links */}
      <div id="nav-links" className="hidden md:flex items-center space-x-6">
        <ThemeToggle />
        {/* Templates Dropdown */}
        <div className="relative">
          <a
            className="text-gray-200 hover:text-white transition duration-300"
            onClick={toggleTemplatesDropdown}
          >
            Templates
          </a>
          {isTemplatesOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
              <a
                href="/user-template"
                className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
              >
                My Templates
              </a>
              <a
                href="/template-search"
                className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
              >
                All Templates
              </a>
            </div>
          )}
        </div>

        <a
          href="/blogs"
          className="text-gray-200 hover:text-white transition duration-300"
        >
          Blogs
        </a>
        {/* Admin Dropdown */}
        {isAdmin && (
          <div className="relative">
            <a
              className="text-gray-200 hover:text-white transition duration-300"
              onClick={toggleAdminDropdown}
            >
              Admin
            </a>
            {isAdminOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
                <a
                  href="/admin/blogs"
                  className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
                >
                  Blogs
                </a>
                <a
                  href="/admin/comments"
                  className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
                >
                  Comments
                </a>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-2"
          >
            Create
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
              <a
                href="/execution"
                className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
              >
                Code
              </a>
              <a
                href="/blogs/blog-editor"
                className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
              >
                Blog
              </a>
            </div>
          )}
        </div>

        {/* Conditionally render Login/Signup buttons if user is not logged in
        {!userPfp && (
          <div className="flex space-x-4">
            <a
              href="/login"
              className="text-gray-200 hover:text-white transition duration-300"
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-gray-200 hover:text-white transition duration-300"
            >
              Sign Up
            </a>
          </div>
        )} */}
      </div>

      <div className="relative hidden md:block flex items-center space-x-4">
        {userPfp ? (
          <>
            <img
              src={`/avatars/${userPfp}.png`}
              alt="Profile"
              className="h-12 w-12 rounded-full cursor-pointer"
              onClick={togglePfpDropdown}
            />

            {/* Profile Dropdown Menu */}
            {isPfpOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-md">
                <a
                  href="/profilepage"
                  className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
                >
                  View Profile
                </a>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:text-white transition duration-300"
                >
                  Edit Profile
                </a>
                <LogoutButton />
              </div>
            )}
          </>
        ) : (
          <div className="flex space-x-4">
            <a
              href="/login-page"
              className="text-gray-200 hover:text-white transition duration-300"
            >
              Login
            </a>
            <a
              href="/signup-page"
              className="text-gray-200 hover:text-white transition duration-300"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>

      {/* Hamburger menu icon for small screens */}
      <button
        id="hamburger-menu"
        className="md:hidden flex items-center text-white focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {/* Mobile navigation links */}
      {isMenuOpen && (
        <div
          id="nav-links-sm"
          className="md:hidden fixed top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center space-y-6"
        >
          <ThemeToggle />
          <div className="flex flex-col items-center space-y-6">
            <a
              href="/my-templates"
              className="block text-gray-200 hover:text-white text-xl transition duration-300"
            >
              My Templates
            </a>
            <a
              href="/all-templates"
              className="block text-gray-200 hover:text-white text-xl transition duration-300"
            >
              All Templates
            </a>
          </div>
          <a
            href="/blogs"
            className="block text-gray-200 hover:text-white text-xl transition duration-300"
          >
            Blogs
          </a>
          {isAdmin && (
            <a
              href="/admin"
              className="block text-gray-200 hover:text-white text-xl transition duration-300"
            >
              Admin
            </a>
          )}
          <a
            href="/execution"
            className="block text-gray-200 hover:text-white text-xl transition duration-300"
          >
            Code
          </a>
          <a
            href="/blog-create"
            className="block text-gray-200 hover:text-white text-xl transition duration-300"
          >
            Create Blog
          </a>

          {/* Profile Picture */}
          {userPfp && (
            <img
              src={`/avatars/${userPfp}.png`}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-gray-500"
            />
          )}

          {/* Login/SignUp buttons */}
          {!userPfp && (
            <div className="flex flex-col items-center space-y-4">
              <a
                href="/login-page"
                className="block text-gray-200 hover:text-white text-xl transition duration-300"
              >
                Login
              </a>
              <a
                href="/signup-page"
                className="block text-gray-200 hover:text-white text-xl transition duration-300"
              >
                Sign Up
              </a>
            </div>
          )}

          {/* Close Menu Button */}
          <button
            className="text-gray-200 hover:text-white text-xl transition duration-300"
            onClick={toggleMenu}
          >
            Close Menu
          </button>

          <LogoutButton />
        </div>
      )}
    </nav>
  );
}

export default NavBar;
