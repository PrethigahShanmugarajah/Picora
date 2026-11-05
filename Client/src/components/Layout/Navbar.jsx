/* eslint-disable no-unused-vars */
// Client / src / components / Layout / Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/appContext";
import {
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SparkleIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { Logo } from "../../assets/assets";
import { InputField } from "../FormField/InputField";

const Navbar = ({
  searchQuery,
  onSearchChange,
  onUploadClick,
  onToggleSidebar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { user, logout } = useAppContext();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-3 sm:px-6 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* -------- Left Side - Mobile Hamburger -------- */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition cursor-pointer shrink-0"
          title="Toggle Menu"
          aria-label="Toggle Navigation Menu"
        >
          <MenuIcon className="size-5" />
        </button>

        <img src={Logo} alt="Picora" className="size-8" />
        <h1 className="hidden sm:inline text-base sm:text-xl font-heading font-semibold text-slate-800 tracking-tight">
          PICORA
        </h1>
      </div>

      {/* -------- Center Search Bar -------- */}
      <div className="flex-1 max-w-2xl relative">
        <div className="flex items-center bg-slate-100 focus-within:bg-cyan-50 transition-all rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent focus-within:border-cyan-500">
          <SearchIcon className="size-4 text-slate-500 shrink-0 mr-2 sm:mr-3" />

          {/* <input
            type="text"
            placeholder="Search photos, videos..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          /> */}

          <InputField
            name="search"
            type="text"
            placeholder="Search photos, videos..."
            size="xs"
            unstyled
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {searchQuery ? (
            <button
              onClick={() => onSearchChange("")}
              className="hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition p-0.5"
            >
              <XIcon className="size-3.5 sm:size-4 text-slate-800" />
            </button>
          ) : (
            <div className="hidden lg:flex bg-linear-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent shrink-0 items-center text-xs gap-2">
              AI-Powered Search
              <SparkleIcon className="size-3.5 animate-spin text-slate-600 shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* -------- Right Side - Upload & Profile -------- */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 sm:gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium px-3 py-2 sm:px-5 sm:py-2.5 rounded-full cursor-pointer"
          title="Upload Photos & Videos"
        >
          <UploadIcon className="size-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="size-8 sm:size-9 rounded-full! bg-linear-to-br from-cyan-500 to-blue-500 text-white font-medium text-xs flex items-center justify-center hover:opacity-95 transition cursor-pointer shrink-0"
          >
            {user?.name?.charAt(0) || "U"}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl border border-slate-200 z-50 transition-all duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-medium text-slate-800 text-sm truncate">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <LogOutIcon className="size-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
