/* eslint-disable react-hooks/exhaustive-deps */
// Client / src / pages / Photos.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPhotos } from "../services/fetch";
import { moveToTrash, toggleFavorite } from "../services/mutations";
import PageHeader from "../components/PageHeader";
import { FilmIcon, ImageIcon, Upload } from "lucide-react";
import { TailSpin } from "react-loader-spinner";
import PhotoGrid from "../components/Photos/PhotoGrid";
import PhotoLightbox from "../components/Photos/PhotoLightbox";
import BulkSelectionBar from "../components/Photos/BulkSelectionBar";

const Photos = () => {
  const { searchQuery, onOpenUpload, openCreateAlbum } = useOutletContext();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [activePhoto, setActivePhoto] = useState(null);

  const loadPhotos = async () => {
    try {
      // const params = new URLSearchParams();

      // if (searchQuery) {
      //   params.append("q", searchQuery);
      // }

      // if (filterType !== "all") {
      //   params.append("type", filterType);
      // }

      const data = await fetchPhotos({
        ...(searchQuery && { q: searchQuery }),
        ...(filterType !== "all" && { type: filterType }),
      });

      setPhotos(data.media || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [searchQuery, filterType]);

  useEffect(() => {
    const handleRefresh = () => loadPhotos();
    window.addEventListener("media-uploaded", handleRefresh);

    return () => {
      window.removeEventListener("media-uploaded", handleRefresh);
    };
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const updateFavorite = async (id) => {
    try {
      const res = await toggleFavorite(id);
      const updated = res.media;

      setPhotos((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isFavorite: updated.isFavorite } : p,
        ),
      );

      if (activePhoto && activePhoto._id === id) {
        setActivePhoto({ ...activePhoto, isFavorite: updated.isFavorite });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTrash = async (id) => {
    try {
      await moveToTrash(id);

      setPhotos((prev) => prev.filter((p) => p._id !== id));

      setSelectedIds((prev) => prev.filter((i) => i !== id));

      if (activePhoto && activePhoto._id === id) {
        setActivePhoto(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkFavorite = async () => {
    try {
      for (const id of selectedIds) {
        await toggleFavorite(id);
      }

      await loadPhotos();
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBulkTrash = async () => {
    try {
      for (const id of selectedIds) {
        await moveToTrash(id);
      }

      await loadPhotos();
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* -------- Header Information -------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        {/* -------- Left -------- */}
        {/* <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            Photos & Videos{" "}
            {photos.length > 0 && (
              <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            All your preserved photos and videos, automatically organized by
            date
          </p>
        </div> */}

        <PageHeader
          icon={ImageIcon}
          title="Photos & Videos"
          count={photos.length}
          description="All your preserved photos and videos, automatically organized by date"
        />

        {/* -------- Right -------- */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-medium text-slate-600">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                filterType === "all"
                  ? "bg-white text-slate-900 font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilterType("image")}
              className={`flex items-center px-3 py-1 rounded-full transition cursor-pointer ${
                filterType === "image"
                  ? "bg-white text-slate-900 font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              <ImageIcon className="size-3" />
              <span>Photos</span>
            </button>

            <button
              onClick={() => setFilterType("video")}
              className={`flex items-center px-3 py-1 rounded-full transition cursor-pointer ${
                filterType === "video"
                  ? "bg-white text-slate-900 font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              <FilmIcon className="size-3" />
              <span>Videos</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------- Media Content -------- */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <TailSpin
            height={40}
            width={40}
            color="#0891B2"
            ariaLabel="loading"
          />
        </div>
      ) : photos.length === 0 ? (
        <div className="empty-state-card">
          <h3 className="text-lg font-medium text-slate-800">
            {searchQuery ? "No Matching Media" : "Your media library is empty"}
          </h3>

          <p>
            {searchQuery
              ? `No media found for '${searchQuery}'. Try a different keyword.`
              : "Upload high quality photos and videos from your computer."}
          </p>

          <button
            onClick={onOpenUpload}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-full transition cursor-pointer"
          >
            <Upload className="size-4" />

            <span>Upload Media Now</span>
          </button>
        </div>
      ) : (
        <PhotoGrid
          photos={photos}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleFavorite={updateFavorite}
          onSelectPhoto={(photo) => setActivePhoto(photo)}
        />
      )}

      <PhotoLightbox
        photos={photos}
        currentPhoto={activePhoto}
        onClose={() => setActivePhoto(null)}
        onToggleFavorite={updateFavorite}
        onTrashPhoto={handleTrash}
        onAddToAlbum={(photo) => {
          openCreateAlbum?.(photo._id);
        }}
      />

      <BulkSelectionBar
        count={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onFavorite={handleBulkFavorite}
        onAddToAlbum={() => openCreateAlbum?.(selectedIds)}
        onTrash={handleBulkTrash}
      />
    </div>
  );
};

export default Photos;
