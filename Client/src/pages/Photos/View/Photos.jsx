// Client / src / pages / Photos / View / Photos.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { DUMMY_MEDIA } from "../../../assets/assets";
import PageHeader from "../../../components/PageHeader";
import { FilmIcon, ImageIcon, Upload } from "lucide-react";
import { TailSpin } from "react-loader-spinner";
import PhotoGrid from "../../../components/Photos/PhotoGrid";
import PhotoLightbox from "../../../components/Photos/PhotoLightbox";
import BulkSelectionBar from "../../../components/Photos/BulkSelectionBar";

const Photos = () => {
  const { searchQuery, onOpenUpload, openCreateAlbum } = useOutletContext();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchPhotos = async () => {
    setTimeout(() => {
      setPhotos(DUMMY_MEDIA);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchPhotos();
  }, [searchQuery, filterType]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleFavorite = async (id) => {
    console.log(id);
  };

  const handleTrash = async (id) => {
    console.log(id);
  };

  const handleBulkFavorite = async () => {
    console.log(selectedIds);
  };

  const handleBulkTrash = async () => {
    console.log(selectedIds);
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
          onToggleFavorite={toggleFavorite}
          onSelectPhoto={(photo) => setActivePhoto(photo)}
        />
      )}

      <PhotoLightbox
        photos={photos}
        currentPhoto={activePhoto}
        onClose={() => setActivePhoto(null)}
        onToggleFavorite={toggleFavorite}
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
