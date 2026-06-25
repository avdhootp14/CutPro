import mongoose from "mongoose";

const barberSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /*                          Shop Reference                                */
    /* ---------------------------------------------------------------------- */
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Barber must belong to a shop"],
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                          Basic Info                                     */
    /* ---------------------------------------------------------------------- */
    name: {
      type: String,
      required: [true, "Barber name is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },

    /* ---------------------------------------------------------------------- */
    /*                        Professional Info                                */
    /* ---------------------------------------------------------------------- */
    experience: {
      type: Number,
      default: 0,
    },
    specialization: [
      {
        type: String,
        trim: true,
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    workingHours: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "19:00" },
        isWorking: { type: Boolean, default: true },
      },
    ],

    /* ---------------------------------------------------------------------- */
    /*                             Status                                     */
    /* ---------------------------------------------------------------------- */
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Barber = mongoose.model("Barber", barberSchema);

export default Barber;
