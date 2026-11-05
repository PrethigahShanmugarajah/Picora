// Client / src / components / Photos / UploadModal.jsx
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadMedia } from "../../services/mutations";
import { Film, X } from "lucide-react";
import { TailSpin } from "react-loader-spinner";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) {
    return null;
  }

  const handleFiles = (files) => {
    if (!files) {
      return;
    }

    const validFiles = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid image or video files.");
      return;
    }

    const newSelected = [...selectedFiles, ...validFiles];
    setSelectedFiles(newSelected);

    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
      name: file.name,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    if (previews[index]) {
      URL.revokeObjectURL(previews[index].url);
    }

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploading(true);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("media", file);
    });

    try {
      const res = await uploadMedia(formData);

      onUploadSuccess(res.media);
      handleClose();
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setPreviews([]);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* -------- Header -------- */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-800">
              Upload to My Library
            </h2>

            <p className="text-xs text-slate-500">
              Upload and organize your photos & videos
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* -------- Content -------- */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* -------- Drag and Drop Box -------- */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border rounded-xl p-8 py-16 flex flex-col items-center justify-center text-center cursor-pointer border-dashed transition-all ${
              isDragging
                ? "border-cyan-500 bg-cyan-50/60"
                : "border-slate-200 hover:border-cyan-400 hover:bg-slate-50/60"
            }`}
          >
            <h3 className="font-medium text-slate-800 text-sm capitalize">
              Drag & drop <span className="text-cyan-600">photos & videos</span>{" "}
              here, or Browse
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Support PNG, JPG, WEBP, GIF, MP4, MOV, WEBM(up to 100MB each)
            </p>

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              multiple
              accept="image/*, video/*"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* -------- Preview Grid -------- */}
          {previews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600 font-medium">
                  Selected ({previews.length})
                </span>

                <button
                  onClick={() => {
                    previews.forEach((p) => URL.revokeObjectURL(p.url));
                    setSelectedFiles([]);
                    setPreviews([]);
                  }}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                {previews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    {preview.isVideo ? (
                      <div className="size-full relative bg-slate-900 flex items-center justify-center">
                        <video
                          src={preview.url}
                          className="size-full object-cover"
                          muted
                          playsInline
                        />

                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs rounded text-[10px] text-white flex items-center gap-1">
                          <Film className="size-3 text-blue-400" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={preview.url}
                        alt=""
                        className="size-full object-cover"
                      />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full! opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* -------- Footer -------- */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/60 rounded-full font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition cursor-pointer"
            >
              {uploading ? (
                <TailSpin
                  height={20}
                  width={20}
                  color="#FFFFFF"
                  ariaLabel="loading"
                />
              ) : (
                <span>
                  Upload
                  {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
