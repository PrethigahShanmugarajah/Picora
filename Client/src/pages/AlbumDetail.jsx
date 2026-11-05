import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useCallback, useEffect, useState } from "react";
import { fetchAlbum } from "../services/fetch";
import {
  deleteAlbum,
  removePhotoFromAlbum,
  toggleFavorite,
} from "../services/mutations";
import { TailSpin } from "react-loader-spinner";
import { ArrowLeft, Calendar, Plus, Trash2 } from "lucide-react";
import PhotoGrid from "../components/Photos/PhotoGrid";
import PhotoLightbox from "../components/Photos/PhotoLightbox";
import AddPhotosModal from "../components/Albums/AddPhotosModal";
import ConfirmPopup from "../components/ConfirmPopup";

const AlbumDetail = () => {
  const { id } = useParams();

  const { navigate } = useAppContext();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadAlbum = useCallback(async () => {
    try {
      const data = await fetchAlbum(id);
      setAlbum(data.album);
    } catch {
      navigate("/albums");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    const timeout = setTimeout(loadAlbum, 0);

    return () => clearTimeout(timeout);
  }, [loadAlbum]);

  const handleRemoveFromAlbum = async (photoId) => {
    if (!album) {
      return;
    }

    try {
      await removePhotoFromAlbum(album._id, photoId);

      setAlbum((prev) =>
        prev
          ? { ...prev, photos: prev.photos.filter((p) => p._id !== photoId) }
          : prev,
      );

      setSelectedIds((prev) => prev.filter((i) => i !== photoId));

      if (activePhoto?._id === photoId) {
        setActivePhoto(null);
      }
    } catch {
      //
    }
  };

  const updateFavorite = async (photoId) => {
    try {
      const res = await toggleFavorite(photoId);
      const updated = res.media;

      setAlbum((prev) =>
        prev
          ? {
              ...prev,
              photos: prev.photos.map((p) =>
                p._id !== photoId
                  ? { ...p, isFavorite: updated.isFavorite }
                  : p,
              ),
            }
          : prev,
      );
    } catch {
      //
    }
  };

  const handleDeleteAlbum = () => {
    if (!album) {
      return;
    }

    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteAlbum(album._id);
      navigate("/albums");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <TailSpin height={40} width={40} color="#0891B2" ariaLabel="loading" />
      </div>
    );
  }

  if (!album) {
    return null;
  }

  const existingPhotoIds = album.photos ? album.photos.map((p) => p._id) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* -------- Navigation Back -------- */}
      <button
        onClick={() => navigate("/albums")}
        className="flex items-center gap-2 hover:bg-slate-100 rounded-full p-2 px-4 text-slate-600 hover:text-slate-900 transition cursor-pointer"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to Albums</span>
      </button>

      {/* -------- Album Header -------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* -------- Left Side -------- */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {album.title}
            </h1>
          </div>

          {album.description && (
            <p className="text-sm text-slate-600 max-w-xl">
              {album.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span>
              {album.photos?.length || 0}
              {album.photos?.length === 1 ? "photo" : "photos"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Created {new Date(album.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* -------- Right Side -------- */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddPhotosModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Photos</span>
          </button>

          <button
            onClick={handleDeleteAlbum}
            className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition cursor-pointer"
            title="Delete Album"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* -------- Photos Inside Album -------- */}
      {album.photos && album.photos.length > 0 ? (
        <PhotoGrid
          photos={album.photos}
          selectedIds={selectedIds}
          onToggleSelect={(photoId) =>
            setSelectedIds((prev) =>
              prev.includes(photoId)
                ? prev.filter((i) => i !== photoId)
                : [...prev, photoId],
            )
          }
          onToggleFavorite={updateFavorite}
          onSelectPhoto={(photo) => setActivePhoto(photo)}
          onRemoveFromAlbum={handleRemoveFromAlbum}
        />
      ) : (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
          <h3>Album is empty</h3>
          <p>Add photos from your existing library to populate this album.</p>

          <button
            onClick={() => setIsAddPhotosModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-full transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Photos to Album</span>
          </button>
        </div>
      )}

      {/* -------- Lightbox for preview -------- */}
      <PhotoLightbox
        photos={album.photos || []}
        currentPhoto={activePhoto}
        onClose={() => setActivePhoto(null)}
        onToggleFavorite={updateFavorite}
        onTrashPhoto={(photoId) => handleRemoveFromAlbum(photoId)}
      />

      {/* -------- Add Photos Modal -------- */}
      <AddPhotosModal
        isOpen={isAddPhotosModalOpen}
        albumId={album._id}
        existingPhotoIds={existingPhotoIds}
        onClose={() => setIsAddPhotosModalOpen(false)}
        onPhotosAdded={(updatedAlbum) => {
          setAlbum(updatedAlbum);
        }}
      />

      {isDeletePopupOpen && (
        <ConfirmPopup
          title="Delete Album"
          description={
            <>
              Are you sure you want to delete the album{" "}
              <strong>{album.title}</strong>? Photos inside will remain safe in
              your library.
            </>
          }
          confirmText="Delete"
          closeText="Cancel"
          loading={deleteLoading}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AlbumDetail;
