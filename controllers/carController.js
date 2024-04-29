const { Op, where } = require("sequelize");
const { Car } = require("../models");

const getAllCar = async (req, res, next) => {
  try {
    const { search, carType, page, limit } = req.query;

    const condition = {};

    // Filter by carName
    if (search) condition.name = { [Op.iLike]: `%${search}%` };

    // Filter by type
    if (
      carType &&
      (carType === "small" || carType === "medium" || carType === "large")
    ) {
      if (carType === "small") {
        condition.capacity = { [Op.lte]: 2 };
      } else if (carType === "medium") {
        condition.capacity = { [Op.lte]: 6, [Op.gt]: 2 };
      } else if (carType === "large") {
        condition.capacity = { [Op.gt]: 6 };
      } else {
        condition.capacity = {};
      }
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Car.count({
      where: condition,
    });

    const cars = await Car.findAll({
      where: condition,
      limit: pageSize,
      offset: offset,
    });

    if (cars === 0) {
      res.status(404).json({
        status: "Failed",
        message: "Cars data is not found",
        requestAt: req.requestTime,
      });
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Cars data is successfully retrieved",
      requestAt: req.requestTime,
      data: { cars },
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      requestAt: req.requestTime,
    });
  }
};

const createCar = async (req, res, next) => {
  const { name, image, rentPerDay, capacity } = req.body;

  try {
    const newCar = await Car.create({
      name,
      image,
      rentPerDay,
      capacity,
    });

    res.status(200).json({
      status: "Success",
      message: "Car successfully created",
      requestAt: req.requestTime,
      data: newCar,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      requestAt: req.requestTime,
    });
  }
};

const getCarById = async (req, res, next) => {
  try {
    const id = await req.params.id;

    const car = await Car.findOne({
      where: { id: id },
    });

    if (!car) throw new Error(`Car with ID '${id}' is not exist`);

    res.status(200).json({
      status: "Success",
      message: `Car with id '${id}' is successfully retrieved`,
      requestAt: req.requestTime,
      data: car,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      requestAt: req.requestTime,
    });
  }
};

const updateCar = async (req, res, next) => {
  try {
    const id = await req.params.id;
    const { name, image, rentPerDay, capacity } = req.body;

    // Data exist validation
    const car = await Car.findOne({
      where: { id: id },
    });

    if (!car) throw new Error(`Car with ID '${id}' is not exist`);

    // Update data
    await Car.update(
      {
        name,
        image,
        rentPerDay,
        capacity,
      },
      {
        where: { id: id },
      }
    );

    const updatedCar = await Car.findOne({
      where: { id: id },
    });

    res.status(200).json({
      status: "Success",
      message: "Car successfully updated",
      requestAt: req.requestTime,
      data: { updatedCar },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      requestAt: req.requestTime,
    });
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const id = await req.params.id;

    await Car.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Car with id '${id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      requestAt: req.requestTime,
    });
  }
};

module.exports = {
  getAllCar,
  createCar,
  getCarById,
  updateCar,
  deleteCar,
};
