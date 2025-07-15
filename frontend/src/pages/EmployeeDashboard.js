import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [progressUpdates, setProgressUpdates] = useState({});

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.progress === 100;
    if (filter === 'stopped') return task.status === 'stopped';
    if (filter === 'ongoing') return task.progress < 100 && task.status !== 'stopped';
    return true;
  });

  const handleProgressChange = (id, value) => {
    setProgressUpdates({ ...progressUpdates, [id]: value });
  };

  const updateProgress = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`,
        { progress: progressUpdates[id] },
        { headers: { Authorization: `Bearer ${localStorage.token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const getDaysLeft = (task) => {
    if (!task.createdAt || !task.duration) return Infinity;
    const created = new Date(task.createdAt);
    const due = new Date(created.getTime() + task.duration * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  // Summary data
  const total = tasks.length;
  const ongoing = tasks.filter(t => t.progress < 100 && t.status !== 'stopped').length;
  const completed = tasks.filter(t => t.progress === 100).length;
  const stopped = tasks.filter(t => t.status === 'stopped').length;

  return (
    <div className="employee-dashboard">
      <h2>Employee Dashboard</h2>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card total">🧮 Total Tasks: {total}</div>
        <div className="card ongoing">⏳ Ongoing: {ongoing}</div>
        <div className="card completed">✅ Completed: {completed}</div>
        <div className="card stopped">❌ Stopped: {stopped}</div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {['all', 'ongoing', 'completed', 'stopped'].map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? <p>No tasks available.</p> : filteredTasks.map(task => {
          const daysLeft = getDaysLeft(task);
          return (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: <span className={`status ${task.status}`}>{task.status}</span></p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${task.progress}%` }}></div>
              </div>
              <p>Progress: {task.progress}%</p>
              {daysLeft <= 1 && task.progress < 100 && (
                <div className="urgent">⏰ Urgent: This task is almost due!</div>
              )}
              {task.progress < 100 && task.status !== 'stopped' && (
                <div className="update-section">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Update progress"
                    value={progressUpdates[task._id] || ''}
                    onChange={(e) => handleProgressChange(task._id, e.target.value)}
                  />
                  <button onClick={() => updateProgress(task._id)}>Update</button>
                </div>
              )}
              <button onClick={() => navigate(`/employee/task/${task._id}`)} className="details-btn">Details</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
