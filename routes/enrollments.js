const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Student = require("../models/Student");

// ✅ GET: List all enrollments with student and course details
router.get("/", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email") // Get student details
      .populate("course", "title description"); // Get course details

    res.json(enrollments);
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ POST: Enroll a student in a course
router.post("/:courseId/enroll/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Student already enrolled in this course" });
    }

    // ✅ Create a new enrollment entry
    const enrollment = new Enrollment({ student: studentId, course: courseId });
    await enrollment.save();

    // ✅ Send response
    res.status(201).json({ message: "Student enrolled successfully", enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ DELETE: Remove a student from a course
router.delete("/:courseId/remove/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Find and delete the enrollment
    const enrollment = await Enrollment.findOneAndDelete({ student: studentId, course: courseId });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json({ message: "Student removed from course successfully" });
  } catch (error) {
    console.error("Remove enrollment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
