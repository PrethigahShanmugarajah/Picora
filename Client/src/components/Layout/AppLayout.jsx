/* eslint-disable no-unused-vars */
// Client / src / components / Layout / AppLayout.jsx
import { useAppContext } from "../../context/appContext";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import CreateAlbumModal from "../Albums/CreateAlbumModal";

const AppLayout = () => {
  const { navigate, location } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(location.pathname);
  const [createAlbumState, setCreateAlbumState] = useState({
    isOpen: false,
    photoIds: [],
  });

  // useEffect(() => {
  //   setIsMobileSidebarOpen(false);
  // }, [location.pathname]);

  if (location.pathname !== previousPathname) {
    setPreviousPathname(location.pathname);
    setIsMobileSidebarOpen(false);
  }

  const handleUploadSuccess = () => {
    window.dispatchEvent(new CustomEvent("media-uploaded"));
  };

  const handleAlbumCreated = (album) => {
    setCreateAlbumState({ isOpen: false, photoIds: [] });
    navigate(`/albums/${album._id}`);
  };

  const openCreateAlbum = (photoIds = []) => {
    setCreateAlbumState({ isOpen: true, photoIds });
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={() => setIsUploadOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <Sidebar
          onCreateAlbumClick={() => openCreateAlbum()}
          onUploadClick={() => setIsUploadOpen(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 md:p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>

      <CreateAlbumModal
        isOpen={createAlbumState.isOpen}
        onClose={() => setCreateAlbumState({ isOpen: false, photoIds: [] })}
        onAlbumCreated={handleAlbumCreated}
        initialPhotoIds={createAlbumState.photoIds}
      />
    </div>
  );
};

export default AppLayout;
