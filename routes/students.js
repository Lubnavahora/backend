const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ GET: Fetch all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST: Add new student
router.post("/", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = new Student({ name, email, age });
    await student.save();

    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
