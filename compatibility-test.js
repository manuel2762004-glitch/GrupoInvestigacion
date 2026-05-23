const { chromium } = require('playwright');

// Credenciales de LambdaTest (configuradas en variables de entorno)
const LT_USERNAME = process.env.LT_USERNAME;
const LT_ACCESS_KEY = process.env.LT_ACCESS_KEY;

if (!LT_USERNAME || !LT_ACCESS_KEY) {
  console.log('Error: LT_USERNAME y LT_ACCESS_KEY son obligatorios para ejecutar pruebas en LambdaTest.');
  process.exit(1);
}

// Configuraciones multiplataforma (Capabilities)
// Configuraciones multiplataforma (Capabilities)
const capabilities = [
  {
    browserName: 'chrome',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'Windows 11',
      user: LT_USERNAME,
      accessKey: LT_ACCESS_KEY,
    }
  },
  {
    browserName: 'Safari',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'macOS Sequoia', // o la versión que estés usando
      project: 'Portal de QA',
      name: 'Prueba de Login - Safari en macOS',
      build: 'Build v1.0.0',
      w3c: true,
      user: LT_USERNAME,
      accessKey: LT_ACCESS_KEY,
    }
  }
];

async function runTest(capability) {
  // Construir el endpoint LIMPIO
  const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capability))}`;

  console.log(`Iniciando prueba en: ${capability.browserName} sobre ${capability['LT:Options'].platformName}`);

  try {
    // -----------------------------------------------------------------
    // EL CAMBIO CLAVE ESTÁ AQUÍ: Añadimos { timeout: 120000 } (2 minutos)
    // -----------------------------------------------------------------
    const browser = await chromium.connectOverCDP(wsEndpoint, { timeout: 120000 });

    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Navegar a la página
    await page.goto('https://demo.playwright.dev/todomvc/');

    // 2. Verificar el título
    const title = await page.title();
    console.log(`Título obtenido: "${title}"`);

    if (!title.includes('Todo')) {
      throw new Error('El título de la página no coincide con el esperado.');
    }

    // Indicar a LambdaTest que la prueba fue exitosa
    await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setFileStatus', arguments: { status: 'passed', remark: 'Prueba de compatibilidad exitosa' } })}`);

    await browser.close();
    console.log(`[OK] Prueba exitosa en ${capability.browserName}`);
  } catch (error) {
    console.error(`[ERROR] Falló en ${capability.browserName}: ${error.message}`);
    // Opcional: No uses process.exit(1) aquí si quieres que intente con el siguiente navegador aunque este falle
  }
}

// Ejecutar el script secuencialmente en las plataformas configuradas
(async () => {
  for (const cap of capabilities) {
    await runTest(cap);
  }
})();