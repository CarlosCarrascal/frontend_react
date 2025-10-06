# Frontend React JWT - Biblioteca

Frontend React con TypeScript para el sistema de biblioteca con autenticación JWT.

## 🚀 Configuración

### Backend en Producción
- **URL**: https://backend-node-khgr.onrender.com
- **API Base**: https://backend-node-khgr.onrender.com/api

## 📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔐 Autenticación

El sistema usa JWT con los siguientes roles:
- `USER` - Usuario básico
- `ADMIN` - Administrador

### Endpoints principales:
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signup` - Registrarse
- `GET /api/libros` - Obtener libros
- `GET /api/autores` - Obtener autores

## 🛠️ Tecnologías

- **React 19** con TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **Context API** - Estado global

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── services/      # Servicios API
├── context/       # Context providers
├── types/         # Tipos TypeScript
└── utils/         # Utilidades
```

## 📝 Notas

- Configurado para conectarse directamente al backend en producción
- Los tokens JWT se almacenan en localStorage
- La aplicación maneja automáticamente la expiración de tokens
- CORS está configurado en el backend para permitir el frontend