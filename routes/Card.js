const express = require("express");
const Card = require("../model/Card");
const router = express.Router();
const HttpError = require("../middleware/http-error");

// Get Cards by Type
router.get("/:type", async (req, res, next) => {
  let cards;
  const type = req.params.type;
  try {
    cards = await Card.find({ type: type });
  } catch (err) {
    const error = new HttpError(
      "Fetching cards failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }
  res.json({
    cards: cards,
  });
});

// Get all cards
router.get("/", async (req, res, next) => {
  let cards;
  try {
    cards = await Card.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching cards failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }
  res.json({
    cards: cards,
  });
});

// Create
router.post("/create", async (req, res, next) => {
  console.log(req.body);
  let {
    image,
    name,
    Specialty,
    AgeGroup,
    HostingHospital,
    OriginHospital,
    VisitDate,
    LeaveDate,
    visibility,
    type,
    status,
  } = req.body;

  let existingCard;
  try {
    existingCard = await Card.findOne({
      name: name,
      Specialty: Specialty,
      VisitDate: VisitDate,
      type: type,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating card failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingCard) {
    const error = new HttpError("Card already exists, please try again.", 422);
    return next(error);
  }
  console.log("2");

  try {
    createdCard = new Card({
      image,
      name,
      Specialty,
      AgeGroup,
      HostingHospital,
      OriginHospital,
      VisitDate,
      LeaveDate,
      visibility,
      type,
      status,
    });
    await createdCard.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating card failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ card: createdCard });
});

router.post("/delete/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      // If the document with the given ID doesn't exist, you can return an error response
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(201).json({ message: "Card deleted successfully" });
  } catch (err) {
    const error = new HttpError(
      "Deleting post failed, please try again later.",
      500
    );
    return next(error); // Pass the error to the error handling middleware
  }
});

router.post("/edit/:id", async (req, res, next) => {
  const id = req.params.id;

  // Destructure the data from the request body
  const { HostingHospital, OriginHospital, VisitDate, LeaveDate, status } =
    req.body;

  try {
    // Find the card by ID and update its properties
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      {
        HostingHospital,
        OriginHospital,
        VisitDate,
        LeaveDate,
        status,
      },
      { new: true } // Return the updated document
    );

    if (!updatedCard) {
      // If the document with the given ID doesn't exist, you can return an error response
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card updated successfully", updatedCard });
  } catch (err) {
    const error = new HttpError(
      "Updating card failed, please try again later.",
      500
    );
    return next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;
