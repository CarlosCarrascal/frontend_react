// Validaciones para formularios

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'El email es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El email no es válido';
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) {
    return 'El nombre de usuario es requerido';
  }
  if (username.length < 3) {
    return 'El nombre de usuario debe tener al menos 3 caracteres';
  }
  if (username.length > 20) {
    return 'El nombre de usuario no puede tener más de 20 caracteres';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'La contraseña es requerida';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  if (password.length > 40) {
    return 'La contraseña no puede tener más de 40 caracteres';
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Debe confirmar la contraseña';
  }
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};
