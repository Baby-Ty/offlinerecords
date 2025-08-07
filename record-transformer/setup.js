#!/usr/bin/env node

/**
 * Setup script for Record Transformer Service
 * Initializes directory structure and verifies dependencies
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const PARSED_DIR = path.join(DATA_DIR, 'parsed');

console.log('🔧 Setting up Record Transformer Service...\n');

async function setup() {
    try {
        // Create directories
        console.log('📁 Creating directory structure...');
        await fs.ensureDir(RAW_DIR);
        await fs.ensureDir(PARSED_DIR);
        console.log('✅ Directories created successfully');

        // Check for sample data
        console.log('\n📊 Checking for sample data...');
        const facilities = await fs.readdir(RAW_DIR);
        const validFacilities = facilities.filter(f => 
            fs.statSync(path.join(RAW_DIR, f)).isDirectory()
        );
        
        if (validFacilities.length > 0) {
            console.log(`✅ Found ${validFacilities.length} facility directories:`);
            validFacilities.forEach(facility => {
                console.log(`   • ${facility}`);
            });
        } else {
            console.log('⚠️  No facility data found in data/raw/');
            console.log('   Copy your HTML files to data/raw/FACILITY_NAME/ directories');
        }

        // Check dependencies
        console.log('\n📦 Checking dependencies...');
        const packageJson = await fs.readJson(path.join(BASE_DIR, 'package.json'));
        
        try {
            // Try to require key dependencies
            require('express');
            require('cheerio');
            require('chokidar');
            console.log('✅ All dependencies installed');
        } catch (error) {
            console.log('⚠️  Missing dependencies, installing...');
            execSync('npm install', { stdio: 'inherit', cwd: BASE_DIR });
            console.log('✅ Dependencies installed');
        }

        // Create sample environment file
        const envPath = path.join(BASE_DIR, '.env.example');
        const envContent = `# Record Transformer Configuration
PORT=3001
NODE_ENV=development

# File processing interval (in minutes)
PROCESSING_INTERVAL=30

# CORS settings (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Logging level (error, warn, info, debug)
LOG_LEVEL=info
`;

        if (!(await fs.pathExists(envPath))) {
            await fs.writeFile(envPath, envContent);
            console.log('✅ Created .env.example file');
        }

        console.log('\n🚀 Setup complete! Next steps:');
        console.log('   1. Run: npm start');
        console.log('   2. API will be available at: http://localhost:3001');
        console.log('   3. Test endpoints:');
        console.log('      • GET /residents');
        console.log('      • GET /residents/:id');
        console.log('      • GET /status');
        console.log('\n📚 For more info, see README.md');

        // Show current status
        if (validFacilities.length > 0) {
            console.log('\n📈 Sample data summary:');
            for (const facility of validFacilities) {
                const facilityPath = path.join(RAW_DIR, facility);
                const files = await fs.readdir(facilityPath);
                const htmlFiles = files.filter(f => f.endsWith('.html'));
                console.log(`   ${facility}: ${htmlFiles.length} HTML files`);
            }
        }

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Run setup if called directly
if (require.main === module) {
    setup();
}

module.exports = { setup };
