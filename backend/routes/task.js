const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const auth = require("../middleware/authMiddleware");


// ================= GET TASKS =================

router.get("/", auth, async (req, res) => {

  try {

    const tasks = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(tasks.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json("Server Error");
  }
});


// ================= CREATE TASK =================

router.post("/", auth, async (req, res) => {

  try {

    const {
      title,
      description,
      status,
      assigned_to,
      project_id,
      priority,
      due_date,
    } = req.body;

    const newTask = await pool.query(
      `INSERT INTO tasks
      (title, description, status, assigned_to, project_id, priority, due_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        title,
        description,
        status,
        assigned_to,
        project_id,
        priority || "Medium",
        due_date || null,
      ]
    );

    res.json(newTask.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json("Task creation failed");
  }
});


// ================= UPDATE TASK =================

router.put("/:id", auth, async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      status,
      priority,
      due_date,
    } = req.body;

    await pool.query(
      `UPDATE tasks
       SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       status = COALESCE($3, status),
       priority = COALESCE($4, priority),
       due_date = COALESCE($5, due_date)
       WHERE id = $6`,
      [
        title,
        description,
        status,
        priority,
        due_date,
        id,
      ]
    );

    res.json("Task updated");

  } catch (err) {

  console.log("CREATE TASK ERROR:");
  console.log(err);

  res.status(500).json(err.message);
}
});


// ================= DELETE TASK =================

router.delete("/:id", auth, async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id]
    );

    res.json("Task deleted");

  } catch (err) {

    console.log(err);

    res.status(500).json("Delete failed");
  }
});


module.exports = router;