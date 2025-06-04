import { useState, useRef, useEffect } from "react";

export default function Navbar({ user, onLogout, onProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between bg-blue-700 text-white px-8 py-4 shadow-lg z-30">
      <div className="font-bold text-xl flex items-center gap-2">
        Welcome, <span className="capitalize">{user?.name || "User"}</span>!
      </div>
      <div className="flex items-center gap-8">
        {/* Tabs or Links */}
        <div className="flex gap-4 font-medium">
          <a href="#budgets" className="hover:underline">Budgets</a>
          <a href="#expenses" className="hover:underline">Expenses</a>
        </div>
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold focus:outline-none border-2 border-blue-400 hover:border-blue-200 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Profile menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="5" fill="#60A5FA"/>
              <circle cx="12" cy="17" r="7" fill="#BFDBFE"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-2 z-50">
              <button
                onClick={() => { setMenuOpen(false); onProfile(); }}
                className="block w-full text-left px-4 py-2 text-blue-800 hover:bg-blue-50"
              >
                Profile
              </button>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}