// load .env variables if it exists
try {
  process.loadEnvFile();
} catch(error) {}


// standard express import
const express = require("express");
const app = express();

// import the Path CommonJS module from Node
const path = require("node:path");

// let code know we're using ejs as template engine as well as location of views folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// setup path to static assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// import routers
const indexRouter = require("./routes/indexRouter");


app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);


// open web server
const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on port ${PORT}`);
});
