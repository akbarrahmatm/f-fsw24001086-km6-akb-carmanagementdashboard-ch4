const { Car } = require("../models");

const getAllCar = async (req, res, next) => {
  try {
    const cars = await Car.findAll();

    res.status(200).json({
      status: "Success",
      requestAt: req.requestTime,
      totalData: cars.length,
      data: { cars },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

module.exports = {
  getAllCar,
};
