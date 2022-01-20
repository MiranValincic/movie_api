const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(methodOverride());

let movies = [
  {
    title: "Captain America: The first Avenger",
    year: "2011",
  },
  {
    title: "Iron Man",
    year: "2008",
  },
  {
    title: "Iron Man 2",
    year: "2010",
  },
  {
    title: "Thor",
    year: "2011",
  },
  {
    title: "The Avengers",
    year: "2012",
  },
  {
    title: "Iron Man 3",
    year: "2013",
  },
  {
    title: "Thor: The Dark World",
    year: "2013",
  },
  {
    title: "Captain America: The Winter Soldier",
    year: "2014",
  },
  {
    title: "Guardians of the Galaxy",
    year: "2014",
  },
  {
    title: "Guardians of the Galaxy 2",
    year: "2017",
  },
  {
    title: "The Avengers: Age of Ultron",
    year: "2015",
  },
  {
    title: "Ant-Man",
    year: "2015",
  },
  {
    title: "Captain America: Civil War",
    year: "2016",
  },
  {
    title: "Spiderman: Homecoming",
    year: "2017",
  },
  {
    title: "Doctor Strange",
    year: "2016",
  },
  {
    title: "Black Panther",
    year: "2018",
  },
  {
    title: "Thor: Ragnarok",
    year: "2017",
  },
  {
    title: "Ant-Man and the Wasp ",
    year: "2018",
  },
  {
    title: "Black Widow",
    year: "2021",
  },
  {
    title: "Avengers: Infinity War",
    year: "2018",
  },
  {
    title: "Avengers: Endgame",
    year: "2019",
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to my Movie app!");
});

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

// Get specific movie by name
app.get("/movies/:title", (req, res) => {
  res.status(200).json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

// Get genre
app.get("/genres/:genre", (req, res) => {
  res.status(200).send("Successful get request");
});

// Return data about director.
app.get("/directors/:name", (req, res) => {
  res.status(200).json(
    movies.find((movie) => {
      return movie.director.name === req.params.name;
    })
  );
});

// Create new user
app.post("/users/create", (req, res) => {
  res.send("Successfully created user!");
});

// Update specific user information
app.put("/:userId", (req, res) => {
  res.send("Successfully updated user information!");
});

// Delete user
app.delete("/users/:userId", (req, res) => {
  res.send("Successfully deleted user!");
});

// Add movie to favourites
app.post("/users/:userId/movies/:movieId/add-to-favourites", (req, res) => {
  res.send("Successfully added movie to favourites!");
});

// Delete movie from favourites
app.delete(
  "/users/:userId/movies/:movieId/delete-from-favourites/",
  (req, res) => {
    res.send("Successfully deleted movie from favourites!");
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
