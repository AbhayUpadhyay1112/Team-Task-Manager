const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);


// TEST DB CONNECTION
pool.connect()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log(err));


// HOME ROUTE
app.get("/", (req, res) => {
  res.send("API running...");
});


// SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});