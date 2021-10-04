const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();
require("./db");

const articleRouter = require("./routes/article/index");
const authRouter = require("./auth");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.use("/api/articles", articleRouter);
app.use("/api/auth", authRouter);

module.exports = app;
