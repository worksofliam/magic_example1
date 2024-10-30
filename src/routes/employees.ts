import express from "express";
import db from "../db";

const root = express.Router();

// APIs will be defined here.

root.get("/", (req, res) => {
  res.send("Hello World!");
});

export default root;