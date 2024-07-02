import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import Home from './pages/Home';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import ResetPassword from './pages/ResetPassword';
import VerifyResetCode from './pages/VerifyResetCode';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
          <Route path="/verify-reset-code/:email" element={<VerifyResetCode />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
