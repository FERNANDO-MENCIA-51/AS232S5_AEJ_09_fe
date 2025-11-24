const fs = require('fs');
const path = require('path');

// Leer el archivo .env
const envPath = path.join(__dirname, '.env');
let backendPort = '9090'; // Puerto por defecto

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/BACKEND_PORT=(\d+)/);
    if (match) {
        backendPort = match[1];
    }
}

// Generar config.json
const config = {
    apiUrl: `http://localhost:${backendPort}`
};

const configPath = path.join(__dirname, 'public', 'config.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('✅ config.json generado correctamente');
console.log(`   API URL: ${config.apiUrl}`);
