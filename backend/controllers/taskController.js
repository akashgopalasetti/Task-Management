// const Task = require('../models/Task');
// const User = require('../models/User'); // Required to look up user by email

// // Create a new task and assign to user via email
// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, duration, assignedTo } = req.body;

//     // Lookup employee by email
//     const user = await User.findOne({ email: assignedTo });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Create task with user ID
//     const task = await Task.create({
//       title,
//       description,
//       duration,
//       assignedTo: user._id,
//     });

//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get tasks (all for manager, filtered for employee)
// exports.getTasks = async (req, res) => {
//   try {
//     const { role, id } = req.user;
//     const query = role === 'manager' ? {} : { assignedTo: id };

//     const tasks = await Task.find(query).populate('assignedTo', 'name email');
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update task
// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Delete task
// exports.deleteTask = async (req, res) => {
//   try {
//     await Task.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (err) {
//     console.error('Delete error:', err);
//     res.status(500).json({ error: 'Failed to delete task' });
//   }
// };
const Task = require('../models/Task');
const User = require('../models/User');

// ✅ Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, duration, assignedTo } = req.body;

    const user = await User.findOne({ email: assignedTo });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = await Task.create({
      title,
      description,
      duration,
      assignedTo: user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Tasks (Manager gets all, Employee gets their own)
exports.getTasks = async (req, res) => {
  try {
    const { role, id } = req.user;
    const query = role === 'manager' ? {} : { assignedTo: id };

    const tasks = await Task.find(query).populate({
      path: 'assignedTo',
      select: 'name email',
      options: { strictPopulate: false }, // to handle missing references gracefully
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
