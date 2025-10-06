import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Biblioteca from './pages/Biblioteca';
import LibroDetalle from './pages/LibroDetalle';
import Autores from './pages/Autores';
import Admin from './pages/Admin';
import User from './pages/User';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Ruta pública por defecto */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas públicas */}
            <Route path="/home" element={<Home />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            
            {/* Ruta de detalle de libro - requiere autenticación */}
            <Route
              path="/libro/:id"
              element={
                <ProtectedRoute>
                  <LibroDetalle />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de administración - solo ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/libros"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <User />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/autores"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Autores />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta 404 - Página no encontrada */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
                    <a
                      href="/home"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
                    >
                      Volver al inicio
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;