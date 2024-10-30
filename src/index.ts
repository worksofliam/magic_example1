import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import * as OpenApiValidator from 'express-openapi-validator';

import db, { connectionString } from "./db";
import root from "./routes/root";
import employees from "./routes/employees";
import departments from "./routes/departments";

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: 'src/spec/spec.yaml',
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  }),
);

app.use(root);
app.use('/employees', employees);
app.use('/departments', departments);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

db.connect(connectionString).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
});