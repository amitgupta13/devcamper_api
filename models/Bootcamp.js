const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const bootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 chars"]
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a Description"],
      maxlength: [500, "Description cannot be more than 50 chars"]
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS"
      ]
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"]
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ]
    },
    address: {
      type: String,
      required: [true, "Please add an address"]
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"]
        // required: true
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
        // required: true
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other"
      ]
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"]
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg"
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bootcampSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode and create location field
bootcampSchema.pre("save", async function(next) {
  const [
    {
      longitude,
      latitude,
      formattedAddress,
      streetName,
      city,
      stateCode,
      zipcode,
      countryCode
    }
  ] = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [longitude, latitude],
    formattedAddress,
    street: streetName,
    city,
    state: stateCode,
    zipcode,
    country: countryCode
  };

  //Do not save address in db
  this.address = undefined;
  next();
});

bootcampSchema.pre("remove", async function(next) {
  console.log(`Courses deleted of bootcamp ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals
bootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false
});

module.exports = mongoose.model("Bootcamp", bootcampSchema);
