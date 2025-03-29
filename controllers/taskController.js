const Task = require('../models/taskModel');

// @desc    Get all tasks for user
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

// @desc    Create a task
exports.createTask = async (req, res) => {
  const { title, description, deadline } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = new Task({
    user: req.user.id,
    title,
    description,
    deadline,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Update a task
exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user.id) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// @desc    Delete a task
exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user.id) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await task.remove();
  res.json({ message: 'Task removed' });
};
