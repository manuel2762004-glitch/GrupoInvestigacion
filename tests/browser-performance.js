import { browser } from 'k6/browser';
import { check } from 'k6';

// Configuración de k6: 1 VU y 1 iteración para la prueba inicial
export const options = {
  scenarios: {
    browser_test: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium', // LambdaTest usará el navegador Chrome remoto
        },
      },
    },
  },
  thresholds: {
    // Definir umbrales de Web Vitals para asegurar el rendimiento del frontend
    browser_web_vital_lcp: ['p(95) < 2500'], // Largest Contentful Paint menor a 2.5s (SLA de Google)
    browser_web_vital_cls: ['p(95) < 0.1'],   // Cumulative Layout Shift menor a 0.1
  },
};

export default async function () {
  // Crear un nuevo contexto y página en el navegador remoto de LambdaTest
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    console.log('Navegando a la aplicación del Portal Científico...');
    // 1. Navegar a la página bajo prueba
    await page.goto('https://grupo-investigacion-punh.vercel.app/');

    // 2. Esperar a que el título H1 principal esté visible (garantiza carga de componentes principales)
    const titleHeader = page.locator('h1');
    await titleHeader.waitFor({ state: 'visible', timeout: 15000 });

    console.log('Página cargada. Realizando validaciones...');
    
    // Validar visibilidad del elemento clave
    const isTitleVisible = await titleHeader.isVisible();
    check(page, {
      'El título H1 está visible': () => isTitleVisible === true,
      'El título de la pestaña incluye Portal o Investigación': () => page.title().then(t => t.includes('Portal') || t.includes('Investiga')),
    });

    // 3. Tomar una captura de pantalla de verificación
    await page.screenshot({ path: 'screenshot-k6-lambdatest.png' });
    console.log('Captura de pantalla guardada exitosamente.');

  } catch (error) {
    console.error(`Error durante la ejecución del test: ${error.message}`);
    throw error;
  } finally {
    // Cerrar de forma limpia
    await page.close();
    await context.close();
  }
}
