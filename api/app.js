require("dotenv").config();
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let tokenAuthenticator = require("./app/plugins/tokenAuthenticator");
let mainRouter = require("./app/routes/index");
let db = require("./app/plugins/modelLoader");
let epilogue = require("epilogue");
let epilogueLoader = require('./app/plugins/epilogueLoader');

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
db.seq
  .authenticate()
  .then(function(err) {
    console.log("Connection to DB has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database:", err);
  });

if (app.get("env") == "production") {
  console.log("Logger common");
  app.use(
    logger("common", {
      skip: function(req, res) {
        return res.statusCode < 400;
      },
      stream: __dirname + "/../morgan.log"
    })
  );
} else {
  console.log("Logger dev");
  app.use(logger("dev"));
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
    return;
  } else {
    req.setTimeout(120 * 1000);
    next();
  }
});

epilogue.initialize({
  app: app,
  sequelize: db.seq
});
app.use(tokenAuthenticator(db));

epilogueLoader(epilogue, db);
app.use("/", mainRouter(db));

module.exports = app;
