import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del escenario de carga (Load Testing Pattern)
export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp-up rápido para demostración: subir gradualmente a 10 usuarios virtuales
    { duration: '15s', target: 10 }, // Stress: mantener la carga constante en 10 VUs
    { duration: '5s', target: 0 },  // Ramp-down: bajar gradualmente a 0 VUs
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // El porcentaje de errores debe ser menor al 1%
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones debe responder en menos de 500ms
  },
};

export default function () {
  // Nota: Para simulación local, apuntamos a una URL pública de prueba o localhost.
  // En un entorno de producción, cambiar por el endpoint real de login.
  const url = 'https://httpbin.org/post';
  
  // Payload simulado de credenciales
  const payload = JSON.stringify({
    email: 'testuser@qa.com',
    password: 'SuperSecurePassword123!',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Realizar la petición POST
  const response = http.post(url, payload, params);

  // Validaciones en tiempo real (Checks)
  check(response, {
    'código de estado es 200': (r) => r.status === 200,
    'tiempo de respuesta menor a 500ms': (r) => r.timings.duration < 500,
  });

  // Tiempo de espera realista entre interacciones (1 segundo)
  sleep(1);
}
