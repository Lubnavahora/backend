const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Student = require("../models/Student");

// ✅ GET: Fetch all courses (with enrolled students)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("students", "name email age"); // Populate student details
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
});

// ✅ POST: Add a new course
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const course = new Course({ title, description });
    await course.save();

    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to add course", error: error.message });
  }
});

// ✅ POST: Enroll a student in a course
router.post("/:id/enroll", async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);
    const student = await Student.findById(studentId);

    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if student is already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    // Enroll the student
    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: "Student enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to enroll student", error: error.message });
  }
});

// ✅ DELETE: Remove a course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
});

module.exports = router;
