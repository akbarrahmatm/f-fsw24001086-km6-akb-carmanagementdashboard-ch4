const { Car } = require("../models");
const { Op } = require("sequelize");
const imagekit = require("../services/imagekit");

// Page Function
const listCar = async (req, res, next) => {
  const carType = (await req.query.carType) || "";
  const search = (await req.query.search) || "";

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
      message: req.flash("message", ""),
      alertType: req.flash("alertType", ""),
    });
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

const createCarPage = async (req, res, next) => {
  try {
    res.render("cars/create");
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

const editCarPage = async (req, res, next) => {};

// Action Function
const createCar = async (req, res, next) => {
  try {
    const file = await req.file;
    const { name, rentPerDay, capacity } = req.body;
    let newCar;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      newCar = await Car.create({
        name,
        rentPerDay,
        capacity,
        image: img.url,
      });
    } else {
      newCar = await Car.create({
        name,
        rentPerDay,
        capacity,
      });
    }

    req.flash("message", "Disimpan");
    req.flash("alertType", "success");
    res.redirect("/admin/cars/list");
  } catch (err) {
    res.render("error", {
      message: err.message,
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

    req.flash("message", "Dihapus");
    req.flash("alertType", "dark");
    res.redirect("/admin/cars/list");
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

module.exports = {
  listCar,
  createCarPage,
  createCar,
  deleteCar,
};
