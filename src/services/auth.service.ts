import api from './api';
import type { RegisterData, LoginData, UserData } from '../types/auth.types';

class AuthService {
  // Registro de usuario
  async register(data: RegisterData) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }

  // Inicio de sesión
  async login(data: LoginData) {
    const response = await api.post<UserData>('/auth/signin', data);
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('user');
  }

  // Obtener usuario actual del localStorage
  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null && !!user.accessToken;
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.includes(`ROLE_${role.toUpperCase()}`);
  }
}

export default new AuthService();
