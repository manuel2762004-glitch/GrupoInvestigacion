import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del escenario de carga (Load Testing Pattern)
export const options = {
  stages: [
    { duration: '10s', target: 100 }, // Ramp-up rápido para demostración: subir gradualmente a 10 usuarios virtuales
    { duration: '15s', target: 100 }, // Stress: mantener la carga constante en 10 VUs
    { duration: '5s', target: 0 },  // Ramp-down: bajar gradualmente a 0 VUs
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // El porcentaje de errores debe ser menor al 1%
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones debe responder en menos de 500ms
  },
};

export default function () {
  // Apuntamos a la página principal del proyecto real desplegado
  const url = 'https://grupo-investigacion-punh.vercel.app/';

  // Realizar la petición GET (es más seguro para pruebas de carga que el Login, 
  // ya que Supabase Auth bloquearía la IP por rate-limit si le enviamos muchas peticiones)
  const response = http.get(url);

  // Validaciones en tiempo real (Checks)
  check(response, {
    'código de estado es 200': (r) => r.status === 200,
    'tiempo de respuesta menor a 500ms': (r) => r.timings.duration < 500,
  });

  // Tiempo de espera realista entre interacciones (1 segundo)
  sleep(1);
}
