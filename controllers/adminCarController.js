const { Car } = require("../models");
const { Op } = require("sequelize");

const listCar = async (req, res, next) => {
  const carType = (await req.query.carType) || "";
  const search = (await req.query.search) || "";

  console.log(search);
  try {
    let cars;

    if (carType === "small") {
      cars = await Car.findAll({
        where: {
          capacity: {
            [Op.lte]: 2,
          },
        },
      });
    } else if (carType === "medium") {
      cars = await Car.findAll({
        where: {
          capacity: {
            [Op.lte]: 6,
          },
        },
      });
    } else if (carType === "large") {
      cars = await Car.findAll({
        where: {
          capacity: {
            [Op.gt]: 6,
          },
        },
      });
    } else {
      cars = await Car.findAll();
    }

    // Search Car Validation
    if (search !== "") {
      cars = await Car.findAll({
        where: {
          name: {
            [Op.substring]: search,
          },
        },
      });
    }

    res.render("cars/list", {
      cars,
      carType,
      search,
    });
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

module.exports = {
  listCar,
};
