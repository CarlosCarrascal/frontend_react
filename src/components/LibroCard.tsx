import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Libro } from '../types/libro.types';
import libroService from '../services/libro.service';

interface LibroCardProps {
  libro: Libro;
  onEdit?: (libro: Libro) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const LibroCard: React.FC<LibroCardProps> = ({ libro, onEdit, onDelete, showActions = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const imageUrl = libroService.getImageUrl(libro.portada);

  const handleVerDetalles = () => {
    if (!isAuthenticated) {
      // Guardar la URL a la que quería ir para redirigir después del login
      sessionStorage.setItem('redirectAfterLogin', `/libro/${libro.id_libro}`);
      navigate('/login');
    } else {
      navigate(`/libro/${libro.id_libro}`);
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="relative h-64 bg-slate-100 overflow-hidden group cursor-pointer" onClick={handleVerDetalles}>
        {libro.portada ? (
          <img
            src={imageUrl}
            alt={libro.titulo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600/1e293b/ffffff?text=Sin+Portada';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <svg className="w-20 h-20 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {isAuthenticated ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">Leer libro</span>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">Ver detalles</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
          {libro.titulo}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">{libro.autor?.nombre || 'Autor desconocido'}</span>
          </div>
          
          <div className="flex items-center text-slate-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{libro.anio}</span>
          </div>

          {libro.autor?.pais && (
            <div className="flex items-center text-slate-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{libro.autor.pais}</span>
            </div>
          )}
        </div>

        {showActions && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-3 border-t border-slate-200">
            {onEdit && (
              <button
                onClick={() => onEdit(libro)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(libro.id_libro)}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibroCard;

