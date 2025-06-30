// --- Archivo: src/App.jsx ---
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import CursosPage from './pages/CursosPage.jsx';
import DocentesPage from './pages/DocentesPage.jsx';
import PredictivosPage from './pages/PredictivosPage.jsx';
import AlumnosPage from './pages/AlumnosPage.jsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="alumnos" element={<AlumnosPage />} />
              <Route path="cursos" element={<CursosPage />} />
              <Route path="docentes" element={<DocentesPage />} />
              <Route path="predictivos" element={<PredictivosPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
}
export default App;