/* eslint-disable react-hooks/set-state-in-effect */
// Client / src / components / Albums / AddPhotosModal.jsx
import { useEffect, useState } from "react";
import { fetchPhotos } from "../../services/fetch";
import { addPhotosToAlbum } from "../../services/mutations";
import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import { TailSpin } from "react-loader-spinner";

const AddPhotosModal = ({
  isOpen,
  albumId,
  existingPhotoIds,
  onClose,
  onPhotosAdded,
}) => {
  const [availablePhotos, setAvailablePhotos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchLibrary = async () => {
        setLoading(true);

        try {
          const res = await fetchPhotos();
          const existingSet = new Set(existingPhotoIds);
          const notInAlbum = (res.media || []).filter(
            (p) => !existingSet.has(p._id),
          );

          setAvailablePhotos(notInAlbum);
        } finally {
          setLoading(false);
        }
      };

      fetchLibrary();
      setSelectedIds([]);
    }
  }, [isOpen, existingPhotoIds]);

  if (!isOpen) {
    return null;
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleAdd = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await addPhotosToAlbum(albumId, selectedIds);

      onPhotosAdded(res.album);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* -------- Header -------- */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-medium text-slate-800 text-base">
              Add Photos to Album
            </h3>
          </div>

          <button
            // onClick={onClose}
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <TailSpin
                height={40}
                width={40}
                color="#0891B2"
                ariaLabel="loading"
              />
            </div>
          ) : availablePhotos.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <p className="font-medium text-sm text-slate-600">
                No additional photos available
              </p>

              <p className="text-xs">
                All your photos are already in this album, or upload more photos
                first.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availablePhotos.map((photo) => {
                const isSelected = selectedIds.includes(photo._id);
                const isVideo =
                  photo.mediaType === "video" ||
                  photo.format === "mp4" ||
                  photo.format === "mov" ||
                  photo.format === "webm" ||
                  photo.url?.endsWith(".mp4");

                return (
                  <div
                    key={photo._id}
                    onClick={() => toggleSelect(photo._id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                      isSelected
                        ? "border-cyan-600"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.title}
                      className="size-full object-cover"
                    />

                    {isVideo && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] font-medium pointer-events-none">
                        <PlayIcon className="size-2.5 fill-white" />
                        <span>Video</span>
                      </div>
                    )}

                    <div
                      className={`absolute top-2 right-2 size-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-cyan-600 text-white scale-100"
                          : "bg-black/40 text-transparent group-hover:text-white group-hover:bg-black/60"
                      }`}
                    >
                      <CheckIcon className="size-3.5 stroke-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <span>{selectedIds.length} item(s) selected</span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/60 rounded-full font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleAdd}
              disabled={submitting || selectedIds.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition cursor-pointer"
            >
              {submitting ? (
                <TailSpin
                  height={18}
                  width={18}
                  color="#FFFFFF"
                  ariaLabel="submitting"
                />
              ) : (
                `Add Selected (${selectedIds.length})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhotosModal;
