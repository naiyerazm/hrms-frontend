"use client";

import { useState } from "react";
import { logout } from "@/lib/session";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-md w-full h-16 flex justify-between items-center px-6 fixed top-0 left-0 z-20">
      {/* Logo / Title */}
      <div className="text-lg font-bold text-gray-800">
        HRMS Dashboard
      </div>

      {/* Account Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-gray-800 font-medium hover:text-gray-900 transition"
        >
          <span>My Account</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}