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

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
