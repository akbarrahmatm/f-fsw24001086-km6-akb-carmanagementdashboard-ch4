const router = require("express").Router();

const adminCarController = require("../controllers/adminCarController");

router.route("/list").get(adminCarController.listCar);

module.exports = router;
