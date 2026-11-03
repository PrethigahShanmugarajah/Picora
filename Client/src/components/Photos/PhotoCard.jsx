// Client / src / components / Photos / PhotoCard.jsx
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { CheckIcon, PlayIcon, StarIcon, XIcon } from "lucide-react";

const PhotoCard = ({
  photo,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
  onClick,
  onRemoveFromAlbum,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const isVideo =
    photo.mediaType === "video" ||
    photo.format === "mp4" ||
    photo.format === "mov" ||
    photo.format === "webm" ||
    photo.url?.endsWith(".mp4");

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer select-none bg-slate-100 border border-slate-200/70 hover:border-cyan-300 transition-transform duration-200 ease-out"
    >
      <div className="aspect-4/3 w-full relative overflow-hidden bg-slate-100">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-200/80 flex items-center justify-center">
            <TailSpin
              height={28}
              width={28}
              color="#0891B2"
              ariaLabel="loading"
            />
          </div>
        )}

        <img
          src={photo.thumbnailUrl || photo.url}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`size-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {isVideo && (
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded-full text-[10px] font-medium pointer-events-none group-hover:opacity-0 transition-opacity">
            <PlayIcon
              className="size-2.5
             fill-white"
            />

            <span>Video</span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(e);
          }}
          className={`absolute top-2.5 left-2.5 size-6 rounded-full! flex items-center justify-center transition-all cursor-pointer z-10 ${
            isSelected
              ? "bg-cyan-600 text-white scale-105"
              : "bg-white/80 backdrop-blur-xs text-transparent group-hover:text-slate-400 group-hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100"
          }`}
        >
          <CheckIcon className={`size-3.5 ${isSelected ? "stroke-3" : ""}`} />
        </button>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onRemoveFromAlbum && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromAlbum(e);
              }}
              className="p-1.5 rounded-full transition-all cursor-pointer bg-white/80 backdrop-blur-xs text-slate-600 hover:text-red-600! hover:bg-white opacity-0 group-hover:opacity-100"
              title="Remove from album"
            >
              <XIcon className="size-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className={
              photo.isFavorite
                ? "p-1.5 rounded-full transition-all cursor-pointer bg-white text-cyan-500 scale-100 opacity-100"
                : "p-1.5 rounded-full! transition-all cursor-pointer bg-white/80 backdrop-blur-xs text-slate-600 hover:text-cyan-500 hover:bg-white opacity-0 group-hover:opacity-100"
            }
            title={
              photo.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <StarIcon
              className={`size-3.5 ${photo.isFavorite ? "fill-cyan-400 stroke-cyan-500" : ""}`}
            />
          </button>
        </div>

        <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {photo.title}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
