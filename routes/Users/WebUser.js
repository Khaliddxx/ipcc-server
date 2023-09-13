const express = require("express");
const WebUser = require("../../model/WebUser");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../../middleware/http-error");

// Get all web users
router.get("/", async (req, res) => {
  const users = await WebUser.find();
  res.send(users);
});

// Signup
router.post("/signup", async (req, res, next) => {
  console.log(req.body.data);
  let { username, fullName, email, gender, country, phone, password } =
    req.body.data;

  if (email) email = email.toLowerCase();
  if (username) username = username.toLowerCase();

  let existingUsers = [];
  console.log("1");
  try {
    existingUsers.push(
      await WebUser.findOne({
        email: email,
      })
    );

    existingUsers.push(
      await WebUser.findOne({
        username: username,
      })
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  existingUsers = existingUsers.filter((item) => item !== null);
  console.log(username);
  console.log(existingUsers);
  if (existingUsers.length > 0) {
    // console.log(existingUsers)
    const error = new HttpError(
      "Email or username already exist already, please try again.",
      422
    );
    return next(error);
  }
  console.log("2");

  let createdUser;
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  console.log("3");

  try {
    createdUser = new WebUser({
      username,
      fullName,
      email,
      gender,
      password: hashedPassword,
      country,
      phone,
      validation: false,
      editor: false,
      admin: false,
    });
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again.", 500);
    return next(error);
  }

  console.log("4");

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id }, "ia_6541265_ajbsc7qwe_ds", {
      expiresIn: "1d",
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating user failed, please try again.", 500);
    return next(error);
  }
  console.log("5");
  let user = {
    id: createdUser.id,
    username: createdUser.username,
    name: createdUser.fullName,
    validation: createdUser.validation,
    email: createdUser.email,
    editor: createdUser.editor,
    admin: createdUser.admin,
  };

  res.status(201).json({ user: user, token: token });
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body.data;
  username = username.toLowerCase();
  let existingUser;
  console.log(req.body);
  console.log(username);
  try {
    existingUser = await WebUser.findOne({
      username: username,
    });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  console.log(existingUser);

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  try {
    let isValidPassword = await bcrypt.compare(password, existingUser.password);

    if (!isValidPassword) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }

    if (!existingUser.validation) {
      const error = new HttpError(
        "Pending approval, could not log you in. Please contact vpia@iads-web.org",
        401
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again.", 500);
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser._id }, "ia_65412654_ajbsc7qwe_ds", {
      expiresIn: "1d",
    });
    console.log(token);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please try again.1",
      500
    );
    console.log(err);
    return next(error);
  }
  let user = {
    id: existingUser.id,
    username: existingUser.username,
    name: existingUser.fullName,
    validation: existingUser.validation,
    email: existingUser.email,
    editor: existingUser.editor,
    admin: existingUser.admin,
  };
  res.status(201).json({ user: user, token: token });
});

// Verify
router.post("/updateVerification/:id/:bool", async (req, res, next) => {
  const id = req.params.id;
  const bool = req.params.bool;
  console.log(id);
  console.log(bool);

  let existingUser;
  try {
    existingUser = await WebUser.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Updating user failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("User does not exist", 401);
    return next(error);
  }

  try {
    if (bool == "true") {
      existingUser.validation = true;
    } else if (bool == "false") {
      existingUser.validation = false;
    } else {
      console.log(bool);
      const error = new HttpError(
        "Could not update user, please try again.",
        500
      );
      return next(error);
    }
    console.log(existingUser);
    await existingUser.save();
  } catch (err) {
    console.log("error");
    const error = new HttpError(
      "Could not update user, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }
  console.log("existingUser");

  res.status(201).json({ user: existingUser });
});

// Delete
router.post("/deleteUser/:id", async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);

  try {
    await WebUser.findByIdAndDelete(id);
  } catch (err) {
    const error = new HttpError(
      "Deleting user failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201);
});

// Editting
router.post("/updateEditting/:id/:bool", async (req, res, next) => {
  const id = req.params.id;
  const bool = req.params.bool;
  console.log(id);
  console.log(bool);

  let existingUser;
  try {
    existingUser = await WebUser.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Updating user failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("User does not exist", 401);
    return next(error);
  }

  try {
    if (bool == "true") {
      existingUser.editor = true;
    } else if (bool == "false") {
      existingUser.editor = false;
    } else {
      console.log(bool);
      const error = new HttpError(
        "Could not update user, please try again.",
        500
      );
      return next(error);
    }
    console.log(existingUser);
    await existingUser.save();
  } catch (err) {
    console.log("error");
    const error = new HttpError(
      "Could not update user, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }
  console.log("existingUser");

  res.status(201).json({ user: existingUser });
});

module.exports = router;
