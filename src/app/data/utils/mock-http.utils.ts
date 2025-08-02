// Single Responsibility: Solo maneja utilidades relacionadas con HTTP mock

/**
 * Extrae el endpoint de una URL
 * @param url - URL completa
 * @returns Nombre del endpoint
 */
export function getEndpointFromUrl(url: string): string {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
}

/**
 * Genera un token mock para simulación
 * @returns Token mock generado
 */
export function generateMockToken(): string {
  return 'mock-jwt-token-' + Math.random().toString(36).substring(2);
}

/**
 * Genera un delay aleatorio para simular latencia de red
 * @returns Delay en milisegundos (200-1200ms)
 */
export function getRandomDelay(): number {
  return Math.random() * 1000 + 200;
}
