import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Reads font from ThemeContext and applies it to the root div so it cascades
function ThemedRoot() {
  const { font } = useTheme();
  return (
    <div style={{ fontFamily: font.family, height: '100%' }}>
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ThemedRoot />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
