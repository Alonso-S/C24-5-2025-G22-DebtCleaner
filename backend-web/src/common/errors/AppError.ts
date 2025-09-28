/**
 * Clase personalizada para errores de la aplicación
 * Extiende la clase Error nativa y añade un código de estado HTTP
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    
    // Esto es necesario debido a cómo funciona la herencia en TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}