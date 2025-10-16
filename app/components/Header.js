import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo / Brand NAME */}
        <Link href="/">
          <div className="text-2xl font-bold text-blue-600 cursor-pointer">
            SchoolApp
          </div>
        </Link>

        {/* NAVBAR Links */}
        <nav className="flex gap-6">
          <Link href="/">
            <span className="text-gray-700  hover:text-blue-600 cursor-pointer font-medium">
              Home
            </span>
          </Link>
          <Link href="/addSchool">
            <span className="text-gray-700  hover:text-blue-600 cursor-pointer font-medium">
              Add School
            </span>
          </Link>
          <Link href="/showSchools">
            <span className="text-gray-700  hover:text-blue-600 cursor-pointer font-medium">
              View Schools
            </span>
          </Link>
        </nav>

      </div>
    </header>
  );
}
