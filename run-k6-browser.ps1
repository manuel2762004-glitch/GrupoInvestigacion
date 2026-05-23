# Script para ejecutar pruebas de k6 browser en la nube de LambdaTest
# Este script se encarga de codificar las capabilities y configurar K6_BROWSER_WS_URL automáticamente

Clear-Host
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "     INICIANDO PRUEBA DE k6 BROWSER EN LAMBDATEST        " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Verificar credenciales
$user = $env:LT_USERNAME
$key = $env:LT_ACCESS_KEY

if (-not $user -or -not $key) {
    Write-Host "ERROR: Las variables de entorno LT_USERNAME y LT_ACCESS_KEY no están configuradas." -ForegroundColor Red
    Write-Host "Por favor, configúralas ejecutando:" -ForegroundColor Gray
    Write-Host "  `$env:LT_USERNAME='tu_usuario'" -ForegroundColor Gray
    Write-Host "  `$env:LT_ACCESS_KEY='tu_access_key'" -ForegroundColor Gray
    Exit 1
}

# 2. Configurar Capabilities para LambdaTest
$capabilities = @{
    browserName = "chrome"
    browserVersion = "latest"
    "LT:Options" = @{
        platform = "Windows 10"
        user = $user
        accessKey = $key
        project = "Portal de QA k6"
        name = "Prueba de Rendimiento k6 Browser"
        build = "Build v1.0.0"
    }
} | ConvertTo-Json -Depth 5 -Compress

# 3. URL-encode de las capabilities
$encodedCapabilities = [uri]::EscapeDataString($capabilities)

# 4. Establecer la variable de entorno que lee k6 de forma nativa
$env:K6_BROWSER_WS_URL = "wss://cdp.lambdatest.com/k6?capabilities=$encodedCapabilities"

Write-Host "Conectando al navegador remoto en la nube..." -ForegroundColor Gray
Write-Host "Comando: k6 run browser-performance.js" -ForegroundColor Gray

# 5. Ejecutar la prueba
k6 run browser-performance.js

# Limpiar variable de entorno al finalizar
Remove-Item env:K6_BROWSER_WS_URL -ErrorAction SilentlyContinue
