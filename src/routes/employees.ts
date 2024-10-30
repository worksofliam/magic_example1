import express from "express";
import db from "../db";

const root = express.Router();

// APIs will be defined here.

root.get("/", async (req, res) => {
  const sql = `
    select 
      empno as "id",
      firstnme as "first",
      lastname as "last",
      job as "job",
      workdept as "workdept",
      salary as "salary"
    from employee
  `;

  const resultSet = await db.query(sql);

  res.json(resultSet);
});

export default root;