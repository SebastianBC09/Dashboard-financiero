/**
 * Extrae el endpoint de una URL
 * @param url - URL completa
 * @returns Nombre del endpoint
 */
export function getEndpointFromUrl(url: string): string {
  let cleanUrl = url;

  // Remover el protocolo y dominio si existe
  if (url.includes('://')) {
    cleanUrl = url.split('://')[1].split('/').slice(1).join('/');
  }

  // Remover barras iniciales y finales
  cleanUrl = cleanUrl.replace(/^\/+|\/+$/g, '');

  // Remover 'api' del inicio si existe
  if (cleanUrl.startsWith('api/')) {
    cleanUrl = cleanUrl.substring(4);
  }

  return cleanUrl;
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
