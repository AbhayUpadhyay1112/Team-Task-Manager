const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE PROJECT
router.post("/", auth, async (req, res) => {

  try {

    const { title, description } = req.body;

    const project = await pool.query(
      `INSERT INTO projects
      (title, description, created_by)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [title, description, req.user.id]
    );

    res.json(project.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json("Project creation failed");
  }
});


// GET ALL PROJECTS
router.get("/", auth, async (req, res) => {

  try {

    const projects = await pool.query(
      "SELECT * FROM projects"
    );

    res.json(projects.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json("Fetching projects failed");
  }
});

module.exports = router;