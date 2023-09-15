require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const webUserRoutes = require("./routes/Users/WebUser");
const cardRoutes = require("./routes/Card");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,*"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use("/api", routes);
app.use("/api/user", webUserRoutes);
app.use("/api/card", cardRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  console.log(error);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    // fs.unlink(req.file.path, (err)=>{
    //   console.log(err);
    // });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server Startedd on port ${3001}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
