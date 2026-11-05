import { useState } from "react";
import { createAlbum } from "../../services/mutations";
import { FolderPlusIcon, XIcon } from "lucide-react";
import { InputField } from "../FormField/InputField";
import { TextAreaField } from "../FormField/TextAreaField";
import { TailSpin } from "react-loader-spinner";

const CreateAlbumModal = ({
  isOpen,
  onClose,
  onAlbumCreated,
  initialPhotoIds = [],
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await createAlbum({
        title: title.trim(),
        description: description.trim(),
        photoIds: initialPhotoIds,
      });

      onAlbumCreated(res.album);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <FolderPlusIcon className="size-5 text-cyan-600 mx-3" />

            <h3 className="font-medium text-slate-700 text-base">New Album</h3>
          </div>

          <button className="p-1.5 cursor-pointer" onClick={handleClose}>
            <XIcon className="size-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            {/* <label className="block text-xs font-medium text-slate-700 tracking-wider mb-1.5">
              Album Title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Vacation 2026"
              autoFocus
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 transition"
            /> */}

            <InputField
              label="Album Title"
              name="title"
              type="text"
              placeholder="e.g. Summer Vacation 2026"
              size="xs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div>
            {/* <label className="block text-xs font-medium text-slate-700 tracking-wider mb-1.5">
              Description *
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short note about this album..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 transition resize-none"
            /> */}

            <TextAreaField
              label="Description"
              name="description"
              placeholder="Add a short note about this album..."
              rows={3}
              size="xs"
              value={description}
              onChange={(value) => setDescription(value)}
            />
          </div>

          {initialPhotoIds.length > 0 && (
            <p className="text-xs text-orange-700">
              {initialPhotoIds.length} photo
              {initialPhotoIds.length === 1 ? "" : "s"} will be added
              automatically
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/60 rounded-full font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition cursor-pointer"
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <TailSpin
                  height={20}
                  width={20}
                  color="#FFFFFF"
                  ariaLabel="loading"
                />
              ) : (
                "Create Album"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbumModal;
