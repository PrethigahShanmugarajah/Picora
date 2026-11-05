/* eslint-disable react-hooks/exhaustive-deps */
// Client / src / pages / Favorites.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPhotos } from "../services/fetch";
import { moveToTrash, toggleFavorite } from "../services/mutations";
import PageHeader from "../components/PageHeader";
import { StarIcon } from "lucide-react";
import { TailSpin } from "react-loader-spinner";
import PhotoGrid from "../components/Photos/PhotoGrid";
import PhotoLightbox from "../components/Photos/PhotoLightbox";

const Favorites = () => {
  const { searchQuery } = useOutletContext();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchFavorites = async () => {
    try {
      const data = await fetchPhotos({
        favorite: true,
        ...(searchQuery && { q: searchQuery }),
      });

      setPhotos(data.media || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [searchQuery]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const updateFavorite = async (id) => {
    try {
      await toggleFavorite(id);

      setPhotos((prev) => prev.filter((p) => p._id !== id));

      if (activePhoto && activePhoto._id === id) {
        setActivePhoto(null);
      }
    } catch {
      //
    }
  };

  const handleTrash = async (id) => {
    try {
      await moveToTrash(id);

      setPhotos((prev) => prev.filter((p) => p._id !== id));

      if (activePhoto && activePhoto._id === id) {
        setActivePhoto(null);
      }
    } catch {
      //
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        {/* <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            Favorites
            {photos.length > 0 && (
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Your starred photos and videos for quick access
          </p>
        </div> */}

        <PageHeader
          icon={StarIcon}
          title="Favorites"
          count={photos.length}
          description="Your starred photos and videos for quick access"
        />
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
      ) : photos.length === 0 ? (
        <div className="empty-state-card">
          <h3 className="text-lg font-medium text-slate-800">
            No favorites yet
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Click the star icon on any photo or video in your collection to add
            it to your favorites.
          </p>
        </div>
      ) : (
        <PhotoGrid
          photos={photos}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSelectPhoto={() => setActivePhoto(photos)}
          onToggleFavorite={updateFavorite}
        />
      )}

      <PhotoLightbox
        photos={photos}
        currentPhoto={activePhoto}
        onClose={() => setActivePhoto(null)}
        onToggleFavorite={updateFavorite}
        onTrashPhoto={handleTrash}
      />
    </div>
  );
};

export default Favorites;
