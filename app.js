require("dotenv").config();
const express = require('express')
const app = express();

const PORT = process.env.port;

//controllers
const routes = require("./Controller/routes.controller")

// Middleware
app.use(express.json());

// Routes
app.use("/routes", routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });