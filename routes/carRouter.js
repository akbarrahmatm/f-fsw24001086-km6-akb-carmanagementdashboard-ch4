const router = require("express").Router();

const carController = require("../controllers/carController");

router.route("/").get(carController.getAllCar);

module.exports = router;
