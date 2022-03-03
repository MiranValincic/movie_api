const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const { check, validationResult } = require("express-validator");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const Models = require("./models.js");
const methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const Users = Models.User;
const Movies = Models.Movie;

// mongoose.connect("mongodb://localhost:27017/test", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(methodOverride());

let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);
require("./passport");

app.get("/", (req, res) => {
  res.send("Welcome to my movie API");
});

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.get(
  "/movies",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  }
);

// Get specific movie by name
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get genre
app.get(
  "/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Return data about director.
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Create new user
app.post(
  "/users",
  [
    check("Name", "Name is required").isLength({ min: 5 }),
    check(
      "Name",
      "Name contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
    check("Password", "Password is required").not().isEmpty(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Name: req.body.Name })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Name + " already exists");
        } else {
          Users.create({
            Name: req.body.Name,
            Born: req.body.Born,
            Email: req.body.Email,
            Password: hashedPassword,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Update specific user information
app.put(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
  [
    check("Name", "Name is required").isLength({ min: 5 }),
    check(
      "Name",
      "Name contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
    check("Password", "Password is required").not().isEmpty(),
  ],
  (req, res) => {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $set: {
          Name: req.body.Name,
          Born: req.body.Born,
          Email: req.body.Email,
          Password: req.body.Password,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete user
app.delete(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Name: req.params.Name })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Name + " was not found");
        } else {
          res.status(200).send(req.params.Name + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Add movie to favourites
app.post(
  "/users/:Name/favorites/:MovieId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $push: { FavoriteMovies: req.params.MovieId },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete movie from favourites
app.delete(
  "/users/:Name/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
