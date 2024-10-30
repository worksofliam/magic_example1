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

root.get("/:id", async (req, res) => {
  const sql = `
    select 
      deptno as "id",
      deptname as "name",
      location as "location",
      mgrno as "manager"
    from department
    where deptno = ?
  `;

  const department = await db.query(sql, [req.params.id]);

  if (department.length === 1) {
    res.json({department: department[0]});
  } else {
    res.status(404).json({ error: "Department not found" });
  }
});

root.patch("/:id", async (req, res) => {
  const body = req.body;
  const deptId = req.params.id;
  const inputDepartment = body.department;
  const mappedColumns: {[id: string]: string} = {
    name: "deptname",
    location: "location",
    manager: "mgrno"
  }

  // Basic validation
  if (!inputDepartment || !deptId) {
    res.status(400).json({ error: "Department object and ID is required" });
    return;
  }

  let columnsToUpdate: {[column: string]: string} = {};

  for (const key in inputDepartment) {
    if (mappedColumns[key]) {
      columnsToUpdate[mappedColumns[key]] = inputDepartment[key];
    }
  }

  const sql = `
    update department
    set ${Object.keys(columnsToUpdate).map(column => `${column} = ?`).join(", ")}
    where deptno = ?
  `;

  // Update the table
  await db.query(sql, [...Object.values(columnsToUpdate), deptId]);

  // Get the updated department
  const updatedDepartment = await db.query(`
    select 
      deptno as "id",
      deptname as "name",
      location as "location",
      mgrno as "manager"
    from department
    where deptno = ?
  `, [deptId]);

  if (updatedDepartment.length === 1) {
    res.json({department: updatedDepartment[0]});
  } else {
    res.status(404).json({ error: "Department not found" });
  }
});

export default root;