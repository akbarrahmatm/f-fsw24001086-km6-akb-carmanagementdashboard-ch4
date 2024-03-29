const router = require("express").Router();

const carController = require("../controllers/carController");

router.route("/").get(carController.getAllCar).post(carController.createCar);

router.route("/:id").get(carController.getCarById);

module.exports = router;
