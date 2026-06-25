import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },

    category: {
      type: String,
      enum: [
        "Hair",
        "Beard",
        "Spa",
        "Facial",
        "Color",
        "Kids",
        "Other",
      ],
      default: "Other",
    },

    image: {
      type: String,
      default: "",
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    hasOffer: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Service must belong to a shop"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that a specific shop cannot have duplicate service names
serviceSchema.index({ shopId: 1, name: 1 }, { unique: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;