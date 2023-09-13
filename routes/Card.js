const express = require("express");
const WebUser = require("../model/WebUser");
const Card = require("../model/Card");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../middleware/http-error");
const checkAuth = require("../middleware/check-auth");

// Get all web users

//getByType
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

router.post("/create", async (req, res, next) => {
  console.log(req.body);
  let { title, description, image, link, date, type } = req.body;

  let existingCard;
  try {
    existingCard = await Card.findOne({
      title: title,
      link: link,
      date: date,
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
  //
  if (existingCard) {
    // console.log(existingUsers)
    const error = new HttpError("Card already exists, please try again.", 422);
    return next(error);
  }
  console.log("2");

  try {
    createdCard = new Card({
      title,
      description,
      image,
      link,
      date,
      type,
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
    await Card.findByIdAndDelete(id);
  } catch (err) {
    const error = new HttpError(
      "Deleting post failed, please try again later.",
      500
    );
  }

  res.status(201);
});

module.exports = router;
