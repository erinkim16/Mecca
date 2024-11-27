import React from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();

  // Navigation handlers
  const handleSignup = () => {
    router.push("/signup-page"); // Replace with your actual signup route
  };

  const handleLogin = () => {
    router.push("/login-page"); // Replace with your actual login route
  };

  const handleContinueAsGuest = () => {
    router.push("/execution"); // Replace with your guest entry point
  };

  return (
    <div className="welcome-page min-h-screen flex flex-col items-center justify-center bg-ui">
      <div className="text-center space-y-6 max-w-2xl p-6 rounded-lg shadow-lg bg-white/80 backdrop-blur-md">
        <div className="flex flex-col items-center space-y-3">
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-coding-icon-download-in-svg-png-gif-file-formats--dev-development-programming-beautiful-flat-icons-pack-miscellaneous-459944.png"
            alt="Scriptorium Logo"
            className="h-16 w-16"
          />
          <h1 className="text-4xl font-bold">Welcome To Scriptorium</h1>
        </div>
        {/* <p className="text-lg">
          Discover, create, and share code templates to streamline your
          development journey.
        </p> */}

        {/* Light beige text box */}
        <div className="explanation flex-grow bg-gray-100 p-2 rounded text-md text-gray-700 mb-2">
          <p>
            Discover, create, and share code to streamline your development
            journey.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignup}
            className="w-full py-3 px-6 rounded-lg bg-primary hover:bg-primaryDark text-white font-semibold transition duration-300"
          >
            Sign Up
          </button>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-6 rounded-lg bg-primary hover:bg-primaryDark text-white font-semibold transition duration-300"
          >
            Log In
          </button>
          <button
            onClick={handleContinueAsGuest}
            className="w-full py-3 px-6 rounded-lg bg-secondary hover:bg-secondaryDark text-white font-semibold transition duration-300"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
