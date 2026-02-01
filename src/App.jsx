import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import YearView from './components/YearView/YearView';
import MonthView from './components/MonthView/MonthView';
import WeekView from './components/WeekView/WeekView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <Signup />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <YearView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/month/:monthId"
          element={
            <ProtectedRoute>
              <MonthView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/week/:monthId/:weekId"
          element={
            <ProtectedRoute>
              <WeekView />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
