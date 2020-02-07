const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "Please add some text"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

// Prevent user from submitting more than 1 review per bootcamp
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg of rating and save
reviewSchema.statics.getAverageRating = async function(bootcampId) {
  const [{ averageRating }] = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" }
      }
    }
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating
    });
  } catch (e) {
    console.log(e);
  }
};

//Call getAverageCost after save
reviewSchema.post("save", async function() {
  await this.constructor.getAverageRating(this.bootcamp);
});

reviewSchema.post("findOneAndUpdate", async function(doc) {
  await this.model.getAverageRating(doc.bootcamp);
});

//Call getAverageCost before remove save
reviewSchema.pre("remove", async function() {
  await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", reviewSchema);
