// Client / src / pages / Albums.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { fetchAlbums } from "../services/fetch";
import { deleteAlbum } from "../services/mutations";
import PageHeader from "../components/PageHeader";
import { FolderHeartIcon, ImageIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { TailSpin } from "react-loader-spinner";
import ConfirmPopup from "../components/ConfirmPopup";

const Albums = () => {
  const { openCreateAlbum } = useOutletContext() || {};

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { navigate } = useAppContext();

  const loadAlbums = async () => {
    try {
      const data = await fetchAlbums();
      setAlbums(data.albums || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleDeleteAlbum = (e, album) => {
    e.stopPropagation();
    setAlbumToDelete(album);
  };

  const handleConfirmDelete = async () => {
    if (!albumToDelete) {
      return;
    }

    setDeleting(true);

    try {
      await deleteAlbum(albumToDelete._id);
      setAlbums((prev) => prev.filter((a) => a._id !== albumToDelete._id));
      setAlbumToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        {/* <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            <FolderHeartIcon className="size-6 text-red-600" /> Albums
            {albums.length > 0 && (
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {albums.length}
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Group your photos into beautiful stories
          </p>
        </div> */}

        <PageHeader
          icon={FolderHeartIcon}
          title="Albums"
          count={albums.length}
          description="Group your photos into beautiful stories"
        />

        <button
          onClick={() => openCreateAlbum?.()}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-full transition cursor-pointer"
        >
          <PlusIcon className="size-4" />
          <span>New Album</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <TailSpin
            height={40}
            width={40}
            color="#0891B2"
            ariaLabel="loading"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {/* -------- Create Album -------- */}
          <div
            onClick={() => openCreateAlbum?.()}
            className="aspect-4/3 rounded-2xl border border-slate-300 hover:border-cyan-300 bg-white/70 p-4 flex flex-col items-center justify-center cursor-pointer transition-all"
          >
            <div className="size-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <PlusIcon className="size-6" />
            </div>

            <span className="text-sm text-slate-700 group-hover:text-cyan-600">
              New Album
            </span>
          </div>

          {/* -------- Album Cards -------- */}
          {albums.map((album) => {
            const firstPhoto =
              album.photos && album.photos.length > 0 ? album.photos[0] : null;

            const coverUrl =
              firstPhoto && typeof firstPhoto === "object"
                ? firstPhoto.thumbnailUrl || firstPhoto.url
                : null;

            const photoCount = album.photos ? album.photos.length : 0;

            return (
              <div
                key={album._id}
                onClick={() => navigate(`/albums/${album._id}`)}
                className="group aspect-4/3 relative rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-300 transition-all duration-200 overflow-hidden cursor-pointer select-none flex flex-col"
              >
                {/* -------- Cover Image -------- */}
                <div className="aspect-4/3 w-full bg-slate-100 relative overflow-hidden">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={album.title}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center text-slate-300 bg-linear-to-br from-slate-100 to-slate-200/70">
                      <ImageIcon className="size-10 mb-1" />

                      <span className="text-[11px] font-medium text-slate-400">
                        No photos yet
                      </span>
                    </div>
                  )}
                </div>

                {/* -------- Content Footer -------- */}
                <div className="px-4 pb-3 py-2 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <h4 className="text-slate-800 text-sm truncate group-hover:text-cyan-600 transition font-medium">
                      {album.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {photoCount} {photoCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  {/* -------- Action Buttons -------- */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => handleDeleteAlbum(e, album)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                      title="Delete Album"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {albumToDelete && (
        <ConfirmPopup
          onClose={() => setAlbumToDelete(null)}
          onConfirm={handleConfirmDelete}
          loading={deleting}
          item={albumToDelete.title}
          title="Delete Album?"
          description={
            <>
              Are you sure you want to delete the album{" "}
              <strong>{albumToDelete.title}</strong>? Photos inside won't be
              deleted.
            </>
          }
          confirmText="Delete"
          closeText="Cancel"
        />
      )}
    </div>
  );
};

export default Albums;
