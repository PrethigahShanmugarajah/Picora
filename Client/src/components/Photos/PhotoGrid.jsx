// Client / src / components / Photos / PhotoGrid.jsx
import { useMemo } from "react";
import { CheckCircle2Icon } from "lucide-react";
import PhotoCard from "./PhotoCard";

const PhotoGrid = ({
  photos,
  selectedIds,
  onToggleSelect,
  onToggleFavorite,
  onSelectPhoto,
  onRemoveFromAlbum,
}) => {
  const grouped = useMemo(() => {
    const groups = {};
    const today = new Date().toDateString();
    // const yesterday = new Date(Date.now() - 86400000).toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();

    photos.forEach((photo) => {
      const dateObj = new Date(photo.createdAt);
      const dateStr = dateObj.toDateString();

      let label = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (dateStr === today) {
        label = "Today";
      } else if (dateStr === yesterday) {
        label = "Yesterday";
      }

      if (!groups[label]) {
        groups[label] = [];
      }

      groups[label].push(photo);
    });

    return groups;
  }, [photos]);

  const selectGroup = (groupPhotos) => {
    const allSelected = groupPhotos.every((p) => selectedIds.includes(p._id));

    groupPhotos.forEach((p) => {
      if (allSelected && selectedIds.includes(p._id)) {
        onToggleSelect(p._id);
      } else if (!allSelected && !selectedIds.includes(p._id)) {
        onToggleSelect(p._id);
      }
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {Object.entries(grouped).map(([dateLabel, groupPhotos]) => {
        // const isGroupAllSelected =
        //   groupPhotos.label > 0 &&
        //   groupPhotos.every((p) => selectedIds.includes(p._id));

        const isGroupAllSelected =
          groupPhotos.length > 0 &&
          groupPhotos.every((p) => selectedIds.includes(p._id));

        return (
          <div className="space-y-3" key={dateLabel}>
            {/* -------- Date -------- */}
            <div className="flex items-center gap-2 backdrop-blur-xs py-2 z-20">
              <button
                onClick={() => selectGroup(groupPhotos)}
                className={`group/btn flex items-center gap-2 text-sm font-medium tracking-tight transition cursor-pointer ${
                  isGroupAllSelected
                    ? "text-cyan-600"
                    : "text-slate-800 hover:text-cyan-600"
                }`}
                title="Select all in this day"
              >
                <span className="size-5 rounded-full border border-slate-300 group-hover/btn:border-cyan-500 flex items-center justify-center text-xs">
                  <CheckCircle2Icon
                    className={`size-4 transition ${
                      isGroupAllSelected
                        ? "text-cyan-600 fill-cyan-100"
                        : "text-transparent group-hover/btn:text-slate-300"
                    }`}
                  />
                </span>

                <span>{dateLabel}</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">
                ({groupPhotos.length})
              </span>
            </div>

            {/* -------- Media -------- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {groupPhotos.map((photo) => (
                <PhotoCard
                  key={photo._id}
                  photo={photo}
                  isSelected={selectedIds.includes(photo._id)}
                  onToggleSelect={() => onToggleSelect(photo._id)}
                  onToggleFavorite={() => onToggleFavorite(photo._id)}
                  onClick={() => onSelectPhoto(photo)}
                  onRemoveFromAlbum={
                    onRemoveFromAlbum
                      ? () => onRemoveFromAlbum(photo._id)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGrid;
