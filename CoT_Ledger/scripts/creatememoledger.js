const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ✅ Define ledger directory and file paths
const LEDGER_DIR = path.resolve(__dirname, "../ledgerdata");
const LEDGER_FILE = path.join(LEDGER_DIR, "ledger.json");
const CONFIG_FILE = path.resolve(__dirname, "../data/ledger_config.json");

// ✅ Ensure `ledgerdata/` exists
if (!fs.existsSync(LEDGER_DIR)) {
    console.log(`⚠️ Ledger directory '${LEDGER_DIR}' not found. Creating it...`);
    fs.mkdirSync(LEDGER_DIR, { recursive: true });
}

// ✅ Ensure `ledger_config.json` exists before proceeding
if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`❌ Error: Ledger configuration file '${CONFIG_FILE}' not found.`);
    process.exit(1);
}

// ✅ Read `ledger_config.json`
let ledgerConfig;
try {
    ledgerConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
} catch (error) {
    console.error(`❌ Error reading ledger config JSON: ${error.message}`);
    process.exit(1);
}

// ✅ Ensure ledgerConfig has valid values
if (!ledgerConfig.ledger_id || ledgerConfig.block_size <= 0 || !ledgerConfig.fields) {
    console.error(`❌ Error: Ledger configuration file contains invalid values.`);
    process.exit(1);
}

// ✅ Add `created_at` timestamp dynamically
ledgerConfig.created_at = new Date().toISOString();

// ✅ Write ledger.json using the config
fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledgerConfig, null, 2), "utf-8");
console.log(`✅ Ledger successfully created and stored in '${LEDGER_FILE}'`);
