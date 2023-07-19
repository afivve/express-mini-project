import express from "express";
import cors from "cors";

import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();

import Route from "./src/routes/index.js";

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

app.use(Route);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});
