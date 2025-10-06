import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">Biblioteca</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/home"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Inicio
            </Link>

            <Link
              to="/biblioteca"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Biblioteca
            </Link>

            {isAuthenticated && hasRole('ADMIN') && (
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1">
                  Administrar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Panel Admin
                  </Link>
                  <Link
                    to="/admin/libros"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Gestionar Libros
                  </Link>
                  <Link
                    to="/admin/autores"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Gestionar Autores
                  </Link>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <>

                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Inicio
            </Link>

            <Link
              to="/biblioteca"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Biblioteca
            </Link>

            {isAuthenticated && hasRole('ADMIN') && (
              <>
                <div className="border-t border-slate-200 my-2"></div>
                <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
                  Administración
                </p>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Panel Admin
                </Link>
                
                <Link
                  to="/admin/libros"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Gestionar Libros
                </Link>

                <Link
                  to="/admin/autores"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Gestionar Autores
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <div className="pt-3 mt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user?.username}</p>
                      <p className="text-xs text-slate-600">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-center"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;