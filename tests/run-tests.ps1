# Orchestrador de Pruebas de QA - Portal Cientifico
# Este script automatiza la verificacion y ejecucion de todas las pruebas en Windows (PowerShell)

Clear-Host

# Nos aseguramos de ejecutar todo desde la raíz del proyecto
Set-Location "$PSScriptRoot\.."
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "      INICIANDO SUITE DE PRUEBAS QA AUTOMATIZADAS        " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Verificar dependencias de Node.js e instalar si es necesario
Write-Host "[1/4] Verificando dependencias de Node.js..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: No se encontro package.json en el directorio actual." -ForegroundColor Red
    Exit 1
}

# Asegurar que Jest y Playwright esten listos
Write-Host "Instalando dependencias requeridas (Jest, Playwright, etc.)..." -ForegroundColor Gray
npm install --save-dev jest @playwright/test @prisma/client lucide-react dotenv 2>$null

# 2. Ejecutar Pruebas Unitarias y de Seguridad (Jest)
Write-Host "[2/4] Ejecutando Pruebas Unitarias, Base de Datos (Mocks) y Seguridad..." -ForegroundColor Yellow
Write-Host "Comando: npx jest --verbose --colors --runInBand" -ForegroundColor Gray

npx jest --verbose --colors --runInBand
$jestResult = $LASTEXITCODE

if ($jestResult -eq 0) {
    Write-Host "OK: Pruebas unitarias de Jest completadas con exito!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Algunas pruebas unitarias de Jest han fallado." -ForegroundColor Red
}

# 3. Ejecutar Pruebas de Rendimiento (k6)
Write-Host "[3/4] Verificando k6 para Pruebas de Rendimiento..." -ForegroundColor Yellow
$k6Installed = Get-Command k6 -ErrorAction SilentlyContinue

# Fallback: Si no se encuentra en el PATH actual (por ejemplo, recien instalado mediante winget),
# buscar en las rutas comunes de instalacion de Windows y agregarlo dinamicamente al PATH.
if (-not $k6Installed) {
    $defaultPaths = @(
        "$env:ProgramFiles\k6\k6.exe",
        "${env:ProgramFiles(x86)}\k6\k6.exe",
        "C:\Program Files\k6\k6.exe",
        "C:\Program Files (x86)\k6\k6.exe"
    )
    foreach ($path in $defaultPaths) {
        if (Test-Path $path) {
            $k6Dir = Split-Path $path
            $env:Path += ";$k6Dir"
            $k6Installed = Get-Command k6 -ErrorAction SilentlyContinue
            break
        }
    }
}

if ($k6Installed) {
    Write-Host "k6 detectado. Iniciando simulacion de carga..." -ForegroundColor Gray
    Write-Host "Comando: k6 run tests/performance-test.js" -ForegroundColor Gray
    k6 run tests/performance-test.js
    $k6Result = $LASTEXITCODE
    if ($k6Result -eq 0) {
        Write-Host "OK: Pruebas de rendimiento completadas con exito!" -ForegroundColor Green
    } else {
        Write-Host "WARN: La prueba de rendimiento no cumplio con los umbrales (Thresholds)." -ForegroundColor Red
    }
} else {
    Write-Host "WARN: k6 no esta instalado en el sistema." -ForegroundColor Yellow
    Write-Host "Puedes instalarlo en Windows ejecutando: winget install -e --id GrafanaLabs.k6" -ForegroundColor Gray
    Write-Host "Omitiendo pruebas de rendimiento de k6..." -ForegroundColor Gray
    $k6Result = 0
}

# 4. Ejecutar Pruebas de Compatibilidad (LambdaTest / Playwright)
Write-Host "[4/4] Verificando credenciales para Pruebas en la Nube (LambdaTest)..." -ForegroundColor Yellow
$envUser = $env:LT_USERNAME
$envKey = $env:LT_ACCESS_KEY


# 5. Reporte Consolidado
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "                 REPORTE CONSOLIDADO DE QA               " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

if ($jestResult -eq 0) {
    Write-Host "  [APROBADO] Pruebas Funcionales, BD y Seguridad (Jest)" -ForegroundColor Green
} else {
    Write-Host "  [FALLADO]  Pruebas Funcionales, BD y Seguridad (Jest)" -ForegroundColor Red
}

if ($k6Installed) {
    if ($k6Result -eq 0) {
        Write-Host "  [APROBADO] Pruebas de Rendimiento (k6)" -ForegroundColor Green
    } else {
        Write-Host "  [FALLADO]  Pruebas de Rendimiento (k6)" -ForegroundColor Red
    }
} else {
    Write-Host "  [OMITIDO]  Pruebas de Rendimiento (k6 no instalado)" -ForegroundColor Yellow
}


Write-Host "=========================================================" -ForegroundColor Cyan
