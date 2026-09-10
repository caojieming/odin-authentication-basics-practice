// load .env variables if it exists
try {
  process.loadEnvFile();
} catch(error) {}


const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const pool = new Pool({
  // add your configuration
  // host: process.env.HOST, 
  // user: process.env.USER,
  // database: process.env.DATABASE,
  // password: process.env.PASSWORD,
  // port: Number(process.env.DBPORT)
  connectionString: process.env.LOCAL_DB_URL
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


// this is ew, but this is just meant to be practice
app.get("/", (req, res) => res.render("index"));

app.get("/sign-up", (req, res) => res.render("sign-up-form"));
app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
});


app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});