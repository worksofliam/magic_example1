import express from "express";
import db from "../db";

const root = express.Router();

root.get("/", async (req, res) => {
  const sql = `
    select 
      deptno as "id",
      deptname as "name",
      location as "location",
      mgrno as "manager"
    from department
  `;

  const departments = await db.query(sql);

  res.json({
    length: departments.length,
    departments
  });
});

export default root;