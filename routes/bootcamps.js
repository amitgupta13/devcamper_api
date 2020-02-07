const router = require("express").Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

const { protect, authorize } = require("../middlewares/auth");

const Bootcamp = require("../models/Bootcamp");

const advancedResults = require("../middlewares/advancedResults");

const coursesRoutes = require("./courses");
const reviewsRouter = require("./reviews");

router.use("/:bootcampId/courses", coursesRoutes);
router.use("/:bootcampId/reviews", reviewsRouter);

router.route("/radius/:zipcode/:distance").get(protect, getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

module.exports = router;
