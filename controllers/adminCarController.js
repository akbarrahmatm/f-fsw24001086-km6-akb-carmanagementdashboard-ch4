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
      title: "List Car",
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
    res.render("cars/create", {
      title: "Add New Car",
    });
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

const editCarPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return new Error(`Car with ID '${id}' is not found`);
    }

    res.render("cars/edit", {
      title: "Update Car Information",
      car,
    });
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

// Action Function
const createCar = async (req, res, next) => {
  try {
    const file = await req.file;
    const { name, rentPerDay, capacity } = req.body;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      await Car.create({
        name,
        rentPerDay,
        capacity,
        image: img.url,
      });
    } else {
      await Car.create({
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

const editCar = async (req, res, next) => {
  try {
    const id = await req.params.id;

    console.log(id);

    const { name, rentPerDay, capacity } = req.body;

    const file = req.file || "";

    console.log(file);

    let updateCar;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      updateCar = await Car.update(
        {
          name,
          rentPerDay,
          capacity,
          image: img.url,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      updateCar = await Car.update(
        {
          name,
          rentPerDay,
          capacity,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    req.flash("message", "Diedit");
    req.flash("alertType", "primary");
    res.redirect("/admin/cars/list");
  } catch (err) {}
};

module.exports = {
  listCar,
  createCarPage,
  editCarPage,
  createCar,
  deleteCar,
  editCar,
};
