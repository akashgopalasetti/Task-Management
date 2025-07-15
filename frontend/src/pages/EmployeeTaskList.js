// src/pages/EmployeeTaskDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css'; // reuse same CSS

export default function EmployeeTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.token}` },
        });
        const taskData = res.data.find(t => t._id === id);
        setTask(taskData);
      } catch (err) {
        console.error('Failed to fetch task:', err);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) return <p>Loading...</p>;

  const dueDate = new Date(new Date(task.createdAt).getTime() + task.duration * 24 * 60 * 60 * 1000);
  const formattedDueDate = dueDate.toLocaleDateString();

  return (
    <div className="employee-dashboard">
      <button onClick={() => navigate(-1)} className="details-btn">⬅ Back</button>
      <div className="task-card">
        <h2>{task.title}</h2>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Progress:</strong> {task.progress}%</p>
        <p><strong>Due Date:</strong> {formattedDueDate}</p>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${task.progress}%` }}></div>
        </div>

        {task.status === 'stopped' && (
          <div className="urgent">⚠️ This task has been stopped.</div>
        )}
        {task.progress === 100 && (
          <div style={{ color: 'green', fontWeight: 'bold' }}>🎉 Task Completed</div>
        )}
      </div>
    </div>
  );
}
