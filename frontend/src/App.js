// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import ManagerDashboard from './pages/ManagerDashboard';
// import EmployeeDashboard from './pages/EmployeeDashboard';
// import Layout from './components/Layout';

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/manager" element={<ManagerDashboard />} />
//           <Route path="/employee" element={<EmployeeDashboard />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TaskDetailsPage from './pages/TaskDetailsPage';
import Layout from './components/Layout';
import EmployeeTaskList from './pages/EmployeeTaskList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/tasks/:employeeId" element={<TaskDetailsPage />} />
          <Route path="/employee/tasks" element={<EmployeeTaskList />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;