/* eslint-disable react-hooks/set-state-in-effect */
// Client / src / components / Layout / AppLayout.jsx
import { useAppContext } from "../../context/appContext";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreateAlbumModal from "../Albums/CreateAlbumModal";
import UploadModal from "../Photos/UploadModal";

const AppLayout = () => {
  const { navigate, location, token, loading } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [createAlbumState, setCreateAlbumState] = useState({
    isOpen: false,
    photoIds: [],
  });

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={40} width={40} color="#0891B2" ariaLabel="loading" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
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
          <Outlet
            context={{
              searchQuery,
              onOpenUpload: () => setIsUploadOpen(true),
              openCreateAlbum,
            }}
          />
        </main>
      </div>

      <CreateAlbumModal
        isOpen={createAlbumState.isOpen}
        onClose={() => setCreateAlbumState({ isOpen: false, photoIds: [] })}
        onAlbumCreated={handleAlbumCreated}
        initialPhotoIds={createAlbumState.photoIds}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default AppLayout;
