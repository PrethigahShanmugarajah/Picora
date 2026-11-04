// Server / models/ Media.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    fileId: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

    format: {
      type: String,
      default: "jpg",
    },

    mediaType: {
      type: String,
      default: "image",
      enum: ["image", "video"],
      index: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    width: {
      type: Number,
      default: 0,
    },

    height: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },

    isTrash: {
      type: Boolean,
      default: false,
      index: true,
    },

    objects: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
