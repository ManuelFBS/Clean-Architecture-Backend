Write-Host "▶ Iniciando servidor..." -ForegroundColor Cyan

# Configura entorno
$env:NODE_ENV="development"
$env:DEBUG="*"

# Verifica ts-node
npx ts-node --version

# Ejecuta el servidor
try {
    npx ts-node src/index.ts
} catch {
    Write-Host "❌ Error crítico: $_" -ForegroundColor Red
    Pause
}