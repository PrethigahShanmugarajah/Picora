import {
  CheckSquareIcon,
  FolderPlusIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

const BulkSelectionBar = ({
  count,
  onClear,
  onFavorite,
  onAddToAlbum,
  onTrash,
}) => {
  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-5 py-3 flex items-center gap-4 text-slate-800 transition-all duration-200 select-none">
      <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
        <button
          onClick={onClear}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"
          title="Clear Selection"
        >
          <XIcon className="size-3.5" />
        </button>

        <span className="text-sm font-medium text-cyan-600 flex items-center gap-1.5">
          <CheckSquareIcon className="size-3.5" /> {count} selected
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onFavorite}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer"
        >
          <StarIcon className="size-3.5 text-slate-500" />
          <span className="hidden sm:inline">Favorite</span>
        </button>

        <button
          onClick={onAddToAlbum}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer"
        >
          <FolderPlusIcon className="size-3.5 text-slate-500" />
          <span className="hidden sm:inline">Add to album</span>
        </button>

        <button
          onClick={onTrash}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-rose-50 text-xs font-medium text-rose-600 transition cursor-pointer"
        >
          <Trash2Icon className="size-3.5" />
          <span className="hidden sm:inline">Move to trash</span>
        </button>
      </div>
    </div>
  );
};

export default BulkSelectionBar;
