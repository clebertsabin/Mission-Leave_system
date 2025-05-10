import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage';
import MissionsPage from './pages/MissionsPage';
import LeavesPage from './pages/LeavesPage';
import Navigation from './components/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated && <Navigation />}
          <main className={isAuthenticated ? 'pt-16' : ''}>
            <Routes>
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/profile"
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/help"
                element={isAuthenticated ? <HelpPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/missions"
                element={isAuthenticated ? <MissionsPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/leaves"
                element={isAuthenticated ? <LeavesPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
