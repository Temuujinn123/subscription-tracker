// components/Header.tsx
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-700 dark:text-indigo-400"
        >
          SubTrack
        </Link>

        <div className="flex items-center space-x-4">
          {/* <ThemeToggle /> */}

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Hello, {user.name}
              </span>
              <button
                onClick={logout}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
