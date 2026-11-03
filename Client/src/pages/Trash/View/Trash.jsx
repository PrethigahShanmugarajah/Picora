// Client / src / pages / Trash / View / Trash.jsx
import { useEffect, useState } from "react";
import { DUMMY_MEDIA } from "../../../assets/assets";
import PageHeader from "../../../components/PageHeader";
import { MopIcon, PlayIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { TailSpin } from "react-loader-spinner";

const Trash = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    setTimeout(() => {
      // setPhotos([]);
      setPhotos(DUMMY_MEDIA);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleEmptyTrash = async () => {
    console.log("Handle Empty Trash");
  };

  const handleRestore = async (id) => {
    console.log(id);
  };

  const handleDeletePermanent = async (id) => {
    console.log(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        {/* <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            <Trash2Icon className="size-6 text-cyan-500" />
            Trash
            {photos.length > 0 && (
              <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Items in trash can be restored or permanently removed
          </p>
        </div> */}

        <PageHeader
          icon={Trash2Icon}
          title="Trash"
          count={photos.length}
          description="Items in trash can be restored or permanently removed"
        />

        {photos.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-full transition cursor-pointer"
          >
            <MopIcon className="size-4 mr-2" />
            <span>Clear Trash</span>
          </button>
        )}
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
        <div className="text-center py-20 px-4 xl:mt-40 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto">
          <h3 className="text-lg font-medium text-slate-800">Trash is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Deleted photos and videos will be safely stored here before
            permanent removal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {photos.map((photo) => {
            const isVideo =
              photo.mediaType === "video" ||
              photo.format === "mp4" ||
              photo.format === "mov" ||
              photo.format === "webm" ||
              photo.url?.endsWith(".mp4");

            return (
              <div
                key={photo._id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    className="size-full object-cover"
                  />

                  {isVideo && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] font-medium pointer-events-none">
                      <PlayIcon className="size-2.5 fill-white" />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 flex items-center justify-between bg-white border-t border-slate-100">
                  <span>{photo.title}</span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleRestore(photo._id)}
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"
                      title="Restore to library"
                    >
                      <RotateCcwIcon className="size-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeletePermanent(photo._id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition cursor-pointer"
                      title="Delete permanently"
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
    </div>
  );
};

export default Trash;
