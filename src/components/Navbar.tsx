"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCompass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../utils/Logout";

function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  return (
    <div className="sticky z-10 top-0 bg-white border-b border-gray-300">
      <div className="flex items-center justify-between h-[10vh] px-4">
        <div className="flex items-center gap-4">
          <span onClick={() => router.push("/")}>
            <FontAwesomeIcon
              icon={faCompass}
              className="text-red-500 text-3xl sm:text-4xl cursor-pointer"
            />
          </span>
          <p
            onClick={() => router.push("/")}
            className="text-xl font-semibold cursor-pointer"
          >
            Explore
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-4"
        >
          <input
            placeholder="Search Destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[20vw] px-4 py-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 border rounded-lg hover:bg-red-600 transition-colors duration-200">
            <FontAwesomeIcon icon={faSearch} />
            <span className="font-bold">Search</span>
          </button>
        </form>

        <div className="hidden md:flex items-center gap-6">
          <p
            onClick={() => router.push("/createPage")}
            className="text-lg cursor-pointer"
          >
            Airbnb Your Home
          </p>
          {token ? (
            <p
              onClick={logout}
              className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => router.push("/authPage")}
              className="font-bold cursor-pointer"
            >
              Register
            </p>
          )}
        </div>

        <div className="md:hidden">
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBars}
            className="text-2xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <input
              placeholder="Search Destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-red-500 w-fit text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search
            </button>
          </form>
          <p
            onClick={() => {
              router.push("/createPage");
              setMenuOpen(false);
            }}
            className="text-lg font-medium cursor-pointer"
          >
            Airbnb Your Home
          </p>
          {token ? (
            <p
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="bg-red-600 w-fit text-white px-4 py-2 rounded-lg font-bold cursor-pointer"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => {
                router.push("/authPage");
                setMenuOpen(false);
              }}
              className="font-bold cursor-pointer"
            >
              Register
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
