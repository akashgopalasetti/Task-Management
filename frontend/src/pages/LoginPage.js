import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.user.role);
    res.data.user.role === 'manager' ? navigate('/manager') : navigate('/employee');
  };

return (
  <div className="login-container">
    <form onSubmit={handleLogin} className="login-form">
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  </div>
);

}