const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users 
      (name, email, password, role)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [name, email, hashedPassword, role || "member"]
    );

    res.json(newUser.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json("Signup failed");
  }
});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json("User not found");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json("Invalid password");
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: user.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json("Login failed");
  }
});

module.exports = router;