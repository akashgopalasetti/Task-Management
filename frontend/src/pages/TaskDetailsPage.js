import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TaskDetailsPage.css';

export default function TaskDetailsPage() {
  const { employeeId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });

      const filteredTasks = res.data.filter(task => task.assignedTo?._id === employeeId);
      setTasks(filteredTasks);
      if (filteredTasks.length > 0) {
        setEmployee(filteredTasks[0].assignedTo);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleStop = async (taskId) => {
    await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: 'stopped' }, {
      headers: { Authorization: `Bearer ${localStorage.token}` },
    });
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${localStorage.token}` },
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [employeeId]);

  return (
    <div className="task-details-page">
      <h2>Tasks for {employee?.name || employee?.email || 'Employee'}</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned to this employee.</p>
      ) : (
        tasks.map(task => (
          <div key={task._id} className="task-card">
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Duration:</strong> {task.duration}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Progress:</strong> {task.progress || 0}%</p>
            {task.status !== 'stopped' ? (
              <button className="stop-button" onClick={() => handleStop(task._id)}>Stop</button>
            ) : (
              <button className="delete-button" onClick={() => handleDelete(task._id)}>Delete</button>
            )}
          </div>
        ))
      )}
      <button className="back-button" onClick={() => navigate('/manager')}>⬅ Back</button>
    </div>
  );
}
