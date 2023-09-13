require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const routes = require("./routes/routes");
const webUserRoutes = require("./routes/Users/WebUser");
const orgMemberRoutes = require("./routes/OrganizationalMember");
const PersonalMemberRoutes = require("./routes/PersonalMember");
const cardRoutes = require("./routes/Card");
const PublicationRoute = require("./routes/Committees/SCORE/PublicationsRoute");

const app = express();
//

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

app.use("/api", routes);
app.use("/api/WebUsers", webUserRoutes);
app.use("/api/orgmember", orgMemberRoutes);
app.use("/api/personalmember", PersonalMemberRoutes);
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
      console.log("Server Startedd");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URI, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//     });
//     console.log("connected to DB");
//     app.use(bodyParser.json());
//     app.use(express.json());

//     app.use((req, res, next) => {
//       res.setHeader("Access-Control-Allow-Origin", "*");
//       res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization,*"
//       );
//       res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//       next();
//     });

//     app.use(express.json());
//     app.use("/api", routes);
//     app.use("/api/WebUsers", webUserRoutes);

//     app.use("/api", PublicationRoute);
//   } catch (err) {
//     console.log(err);
//   }
// };

// mongoose.connection.once("open", () => {
//   console.log("connected to mongodb");
//   app.listen(3001, () => console.log("server running"));
// });

// connectDB();
