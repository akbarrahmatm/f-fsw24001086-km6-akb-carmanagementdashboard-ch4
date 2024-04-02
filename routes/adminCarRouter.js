const router = require("express").Router();
const upload = require("../services/multer");

const adminCarController = require("../controllers/adminCarController");

router.route("/list").get(adminCarController.listCar);

router
  .route("/add")
  .get(adminCarController.createCarPage)
  .post(upload.single("file"), adminCarController.createCar);

router.route("/delete/:id").post(adminCarController.deleteCar);

router.route("/edit/:id").get(adminCarController.editCarPage);

router
  .route("/update/:id")
  .post(upload.single("file"), adminCarController.editCar);

module.exports = router;
