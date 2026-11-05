/* eslint-disable react-hooks/set-state-in-effect */
// Client / src / components / Layout / Sidebar.jsx
import { useEffect, useState } from "react";
import { fetchStats } from "../../services/fetch";
import {
  FolderHeartIcon,
  HardDriveIcon,
  ImageIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Logo } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = ({
  onCreateAlbumClick,
  onUploadClick,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    loadStats();

    const interval = setInterval(loadStats, 15000);

    return () => clearInterval(interval);
  }, []);

  const storageUsed = stats?.totalBytes
    ? (stats.totalBytes / (1024 * 1024)).toFixed(1)
    : "0.0";

  const storagePercent = stats?.totalBytes
    ? Math.min(
        100,
        Math.max(3, Math.round((stats.totalBytes / (100 * 1024 * 1024)) * 100)),
      )
    : 2;

  const navLinks = [
    { to: "/", label: "Photos & Videos", icon: ImageIcon },
    { to: "/favorites", label: "Favorites", icon: StarIcon },
    { to: "/albums", label: "Albums", icon: FolderHeartIcon },
    { to: "/trash", label: "Trash", icon: Trash2Icon },
  ];

  const handleUploadClick = () => {
    onCloseMobile?.();
    onUploadClick?.();
  };

  const handleCreateAlbumClick = () => {
    onCloseMobile?.();
    onCreateAlbumClick?.();
  };

  return (
    <>
      {/* -------- Mobile Backdrop -------- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 p-4 flex flex-col sm:justify-between gap-6 select-none md:static md:w-64 md:h-full md:bg-slate-50/70 md:translate-x-0 transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl md:shadow-none"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* -------- Header -------- */}
        <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <img src={Logo} alt="Picora" className="size-7" />

            <span className="font-heading font-semibold text-slate-800 tracking-tight text-base">
              PICORA
            </span>
          </div>

          <button
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer"
            onClick={onCloseMobile}
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* -------- Main Navigation -------- */}
        <div className="space-y-6">
          <div className="space-y-2">
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-full border border-slate-200 text-sm transition cursor-pointer"
            >
              <PlusIcon className="size-4" />

              <span>Upload Photos</span>
            </button>

            <button
              onClick={handleCreateAlbumClick}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-full border border-slate-200 text-sm transition cursor-pointer"
            >
              <FolderHeartIcon className="size-4" />
              <span>Create Album</span>
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => onCloseMobile?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm transition-all ${
                      isActive
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* -------- Storage Widget -------- */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-700">
              <HardDriveIcon className="size-4 text-cyan-500" />
              Storage
            </span>

            <span className="font-medium text-slate-900">{storageUsed} MB</span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>
              {stats?.mediaCount ?? stats?.photoCount ?? 0} media saved
            </span>

            {stats?.videoCount ? <span>{stats.videoCount}</span> : null}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
