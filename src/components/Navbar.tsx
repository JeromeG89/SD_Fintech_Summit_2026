"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<"workshops" | "hackathon" | null>(null);
  const [hoverDelay, setHoverDelay] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control hamburger menu

  const handleMouseEnter = (dropdown: "workshops" | "hackathon") => {
    if (hoverDelay) clearTimeout(hoverDelay);
    setIsDropdownOpen(dropdown);
  };

  const handleMouseLeave = () => {
    const delay = setTimeout(() => setIsDropdownOpen(null), 200);
    setHoverDelay(Number(delay));
  };

  const menuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null); // Ref for the <nav> container

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        navRef.current &&
        !menuRef.current.contains(event.target as Node) && // Check for clicks outside of the menu
        !navRef.current.contains(event.target as Node) // Check for clicks outside of the nav container
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navRef} className="bg-indigo-950 shadow-md w-full">
      {/* Wrapper to display Mobile dropdown */}
      <div className="w-full">
        {/* Main Nav Bar Wrapper */}
        <div className="w-full h-16 flex items-center justify-between px-4 lg:px-12">
          {/* Logo Wrapper */}
          <Link href="/" passHref>
            <div className="flex items-center cursor-pointer">
              {/* FTS Logo */}
              <Image
                className="mr-1" // Reduced margin-right
                alt="logo"
                src="/navbar-logo.png"
                width={110} // Adjust dimensions if necessary
                height={60}
              />
              {/* Divider Line */}
              <div className="w-px h-10 bg-white mx-1" /> {/* Reduced margin-left and margin-right */}
              {/* Summit Logo */}
              <Image
                className="ml-1" // Reduced margin-left
                alt="logo"
                src="/HomeLogoFull.png"
                width={110} // Adjust dimensions if necessary
                height={60}
              />
            </div>
          </Link>

          {/* Wide Screen Nav Bar Buttons */}

          {/* Hackathon Dropdown */}
          <div className="hidden lg:block relative flex items-center" onMouseEnter={() => handleMouseEnter("hackathon")} onMouseLeave={handleMouseLeave}>
            <button className="text-white font-bold text-lg flex items-center hover:text-gray-200" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>
              HACKATHON
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ml-2 transform ${isDropdownOpen === "workshops" ? "rotate-180" : "rotate-0"} transition-transform duration-200`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen === "hackathon" && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-blue-400 text-white rounded-lg shadow-lg z-50">
                <Link href="/#problem-statement" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>Problem Statement</Link>
                <Link href="/#bounty" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>Bounty</Link>
                <Link href="/#prizes" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>Prizes</Link>
                <Link href="/#timeline" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>Timeline</Link>
                <Link href="/#joining" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>How to Join</Link>
              </div>
            )}
          </div>

          {/* Workshops Dropdown */}
          <div className="hidden lg:block relative flex items-center" onMouseEnter={() => handleMouseEnter("workshops")} onMouseLeave={handleMouseLeave}>
            <button className="text-white font-bold text-lg flex items-center hover:text-gray-200" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>
              WORKSHOPS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ml-2 transform ${isDropdownOpen === "workshops" ? "rotate-180" : "rotate-0"} transition-transform duration-200`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen === "workshops" && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-blue-400 text-white rounded-lg shadow-lg z-50">
                <Link href="/workshops/day1" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>13 Jan 2025</Link>
                <Link href="/workshops/day2" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>14 Jan 2025</Link>
                <Link href="/workshops/day3" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>15 Jan 2025</Link>
                <Link href="/workshops/day4" className="block px-4 py-2 hover:bg-nav-backround rounded-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>16 Jan 2025</Link>
              </div>
            )}
          </div>

          <Link href="/sponsors" className="hidden lg:block text-white font-bold text-lg hover:text-gray-200" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>
            SPONSORS
          </Link>

          <Link href="/about" className="hidden lg:block text-white font-bold text-lg hover:text-gray-200" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>
            ABOUT
          </Link>

          <Link href="/faq" className="hidden lg:block text-white font-bold text-lg hover:text-gray-200" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>
            FAQ
          </Link>

          <Link 
            href="https://forms.gle/HcVEtSDBVZikaqHY9"
            target="_blank"
            className="hidden lg:block text-white font-bold text-lg px-4 py-2 border border-white rounded-full hover:bg-white hover:text-nav-backround transition-colors duration-200"
            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}
          >
            REGISTRATION
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="block lg:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
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
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden block py-4 bg-nav-backround text-white z-50 w-full"
            ref={menuRef}>
            <Link href="/" 
            onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:text-gray-200">
              HOME
            </Link>
            <div className="relative flex flex-col items-start w-full">
              <button
                className="flex items-center w-full px-4 py-2"
                onClick={() => setIsDropdownOpen(isDropdownOpen === "hackathon" ? null : "hackathon")} // Toggle dropdown on button click
                onMouseEnter={() => handleMouseEnter("hackathon")} // Open on hover
              >
                HACKATHON
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 ml-2 transform ${isDropdownOpen === "workshops" ? "rotate-180" : "rotate-0"
                    } transition-transform duration-200`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Workshops Dropdown menu */}
              <div
                onMouseLeave={handleMouseLeave} // Close when mouse leaves the dropdown
                className={`w-full bg-blue-400 ${isDropdownOpen === "hackathon" ? "block" : "hidden"}`} // Control visibility
              >
                <div className=" text-white z-50 w-full">
                  <Link
                    href="/#problem-statement"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    Problem Statement
                  </Link>
                  <Link
                    href="/#bounty"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    Bounty
                  </Link>
                  <Link
                    href="/#prizes"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    Prizes
                  </Link>
                  <Link
                    href="/#timeline"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    Timeline
                  </Link>
                  <Link
                    href="/#joining"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    How to Join
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col items-start w-full">
              <button
                className="flex items-center w-full px-4 py-2"
                onClick={() => setIsDropdownOpen(isDropdownOpen === "workshops" ? null : "workshops")} // Toggle dropdown on button click
                onMouseEnter={() => handleMouseEnter("workshops")} // Open on hover
              >
                WORKSHOPS
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 ml-2 transform ${isDropdownOpen === "workshops" ? "rotate-180" : "rotate-0"
                    } transition-transform duration-200`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Workshops Dropdown menu */}
              <div
                onMouseLeave={handleMouseLeave} // Close when mouse leaves the dropdown
                className={`w-full bg-blue-400 ${isDropdownOpen === "workshops" ? "block" : "hidden"}`} // Control visibility
              >
                <div className=" text-white z-50 w-full">
                  <Link
                    href="/workshops/day1"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    13 Jan 2025
                  </Link>
                  <Link
                    href="/workshops/day2"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    14 Jan 2025
                  </Link>
                  <Link
                    href="/workshops/day3"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    15 Jan 2025
                  </Link>
                  <Link
                    href="/workshops/day4"
                    onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-nav-backround hover:text-gray-200"
                  >
                    16 Jan 2025
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/sponsors" 
            onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:text-gray-200">
              SPONSORS
            </Link>

            <Link href="/about" 
            onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:text-gray-200">
              ABOUT
            </Link>

            <Link href="/faq" 
            onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:text-gray-200 mb-2">
              FAQ
            </Link>

            <Link 
              href="https://docs.google.com/forms/d/e/1FAIpQLSd39bxGCe-lOdfiNURKSpNqzjzzRg-yy-OI87hCOLHimiofSg/closedform"
              className="text-white font-bold text-lg px-4 py-2 border border-white rounded-full hover:bg-white hover:text-nav-backround transition-colors duration-200 ml-2"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}
            >
              REGISTRATION
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;