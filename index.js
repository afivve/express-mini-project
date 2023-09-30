const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const Route = require("./src/routes/index.js");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use(Route);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});

module.exports = app;
