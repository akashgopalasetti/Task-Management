import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';

export default function ManagerTaskBoard() {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [form, setForm] = useState({ title: '', description: '', duration: '', assignedTo: '' });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });

      const groups = {};
      res.data.forEach(task => {
        const empId = task.assignedTo?._id;
        const empEmail = task.assignedTo?.email || 'Unknown';
        if (!empId) return;

        if (!groups[empId]) {
          groups[empId] = { id: empId, email: empEmail, total: 0, completed: 0, stopped: 0, progressSum: 0 };
        }
        groups[empId].total += 1;
        if (task.status === 'stopped') groups[empId].stopped += 1;
        if (task.progress === 100) groups[empId].completed += 1;
        groups[empId].progressSum += task.progress || 0;
      });

      setGroupedTasks(groups);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:5000/api/tasks', form, {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      setForm({ title: '', description: '', duration: '', assignedTo: '' });
      fetchTasks();
    } catch (error) {
      console.error('❌ Error creating task:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="employee-dashboard">
      <h2>Manager Task Overview</h2>

      {/* Assign Task Form */}
      <div className="task-create-form">
        <h3>Assign New Task</h3>
        <div className="task-form-layout">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Duration (in days)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <input
            type="email"
            placeholder="Assign to (Employee Email)"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            rows={4}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button onClick={handleCreate} className="task-button create">Assign Task</button>
      </div>

      {/* Task Summary Table */}
      <table className="task-table">
        <thead>
          <tr>
            <th>Employee Email</th>
            <th>Total Tasks</th>
            <th>Completed</th>
            <th>Stopped</th>
            <th>Avg. Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedTasks).map(data => {
            const avgProgress = data.total > 0 ? Math.round(data.progressSum / data.total) : 0;

            return (
              <tr key={data.id}>
                <td>{data.email}</td>
                <td>{data.total}</td>
                <td>{data.completed}</td>
                <td>{data.stopped}</td>
                <td>{avgProgress}%</td>
                <td>
                  <button onClick={() => navigate(`/tasks/${data.id}`)} className="details-btn">
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}