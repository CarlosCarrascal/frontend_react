import api from './api';
import type { RegisterData, LoginData, UserData } from '../types/auth.types';

class AuthService {
  async register(data: RegisterData) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }

  async login(data: LoginData) {
    const response = await api.post<UserData>('/auth/signin', data);
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null && !!user.accessToken;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.includes(`ROLE_${role.toUpperCase()}`);
  }
}

export default new AuthService();
