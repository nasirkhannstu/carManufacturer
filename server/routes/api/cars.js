const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Cars
router.get("/", async (req, res) => {
  const resPerPage = 9;
  const search = req.query.search || "";
  const page = req.query.page || 1;
  const carsCollection = await loadCarCollection();

  var cars = [];
  if (search != "") {
    cars = await carsCollection
      .find({ manufacturer: search })
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ _id: -1 })
      .toArray();
    var numCars = await carsCollection.countDocuments({ manufacturer: search });
  } else {
    cars = await carsCollection
      .find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ _id: -1 })
      .toArray();
    var numCars = await carsCollection.countDocuments();
  }

  res.status(201).json({
    cars,
    currentPage: page,
    pages: Math.ceil(numCars / resPerPage),
    searchVal: search,
    numOfResults: numCars,
  });
});

// Upload CSV String
router.post("/csvstring", async (req, res) => {
  let cars = req.body;
  const carsCollection = await loadCarCollection();
  await carsCollection.insertMany(cars);

  res.status(200).send("success");
});

// Post Cars
router.post("/", async (req, res) => {
  if (
    req.body.manufacturer == "" ||
    req.body.model == "" ||
    req.body.year == "" ||
    req.body.country == ""
  ) {
    res.status(400).send("Fill Out the form correctly");
  }
  const cars = await loadCarCollection();
  const addCar = await cars.insertOne({
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    year: req.body.year,
    country: req.body.country,
    createdAt: new Date(),
  });

  return res.status(201).json(addCar);
});

// Update Cars
router.put("/", async (req, res) => {
  if (
    req.body.manufacturer == "" ||
    req.body.model == "" ||
    req.body.year == "" ||
    req.body.country == ""
  ) {
    res.status(400).send("Fill Out the form correctly");
  }
  const carsCollection = await loadCarCollection();
  console.log(req.body);
  let car = await carsCollection.updateOne(
    {
      _id: req.body.id,
    },
    {
      $set: {
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        country: req.body.country,
      },
    }
  );
  return res.status(201).json(car);
});

// Delete Cars
router.delete("/:id", async (req, res) => {
  const cars = await loadCarCollection();
  await cars.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

  return res.status(200).send();
});

async function loadCarCollection() {
  try {
    const client = await mongodb.MongoClient.connect(
      "mongodb+srv://plutoNet:plutoNet@cluster0.mz0v6.mongodb.net/carStore",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    return client.db("carStore").collection("cars");
  } catch (err) {
    console.log(err);
    return "Error";
  }
}

module.exports = router;
