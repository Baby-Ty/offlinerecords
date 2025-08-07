#!/usr/bin/env node

/**
 * Simple Setup Verification Script
 * Checks file structure without external dependencies
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Medical Records Integration Setup...\n');

function checkFile(filePath, description) {
    const exists = fs.existsSync(filePath);
    console.log(exists ? `✅ ${description}` : `❌ ${description} (missing: ${filePath})`);
    return exists;
}

function checkDirectory(dirPath, description) {
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    console.log(exists ? `✅ ${description}` : `❌ ${description} (missing: ${dirPath})`);
    return exists;
}

let allGood = true;

// Backend Structure
console.log('📁 Backend Structure:');
const backendChecks = [
    ['record-transformer/package.json', 'Backend package.json'],
    ['record-transformer/src/server.js', 'Main server file'],
    ['record-transformer/src/services/fileWatcher.js', 'File watcher service'],
    ['record-transformer/src/services/processor.js', 'Data processor'],
    ['record-transformer/src/services/dataService.js', 'Data service'],
    ['record-transformer/src/parsers/facesheetParser.js', 'Facesheet parser'],
    ['record-transformer/src/parsers/medicationParser.js', 'Medication parser'],
    ['record-transformer/src/parsers/treatmentParser.js', 'Treatment parser'],
    ['record-transformer/src/parsers/orderParser.js', 'Order parser'],
    ['record-transformer/README.md', 'Backend documentation']
];

backendChecks.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) allGood = false;
});

console.log('\n📁 Backend Data Directories:');
const dataDirChecks = [
    ['record-transformer/data', 'Data directory'],
    ['record-transformer/data/raw', 'Raw data directory'],
    ['record-transformer/data/raw/RUSSLL_DAY', 'Sample facility 1'],
    ['record-transformer/data/raw/RUSSLL_LTC', 'Sample facility 2'],
    ['record-transformer/data/raw/RUSSLL_OP', 'Sample facility 3'],
    ['record-transformer/data/raw/RUSSLL_RC', 'Sample facility 4']
];

dataDirChecks.forEach(([dir, desc]) => {
    if (!checkDirectory(dir, desc)) allGood = false;
});

// Frontend Structure
console.log('\n🖥️ Frontend Structure:');
const frontendChecks = [
    ['api-medical-interface.html', 'Main interface HTML'],
    ['js/api-client.js', 'API client'],
    ['js/components.js', 'UI components'],
    ['js/app.js', 'Main application'],
    ['js/fallback-data.js', 'Offline data'],
    ['styles/medical-api-interface.css', 'Interface styles']
];

frontendChecks.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) allGood = false;
});

// Documentation
console.log('\n📚 Documentation:');
const docChecks = [
    ['INTEGRATION_GUIDE.md', 'Integration guide']
];

docChecks.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) allGood = false;
});

// Sample data check
console.log('\n📊 Sample Data:');
try {
    const facilities = ['RUSSLL_DAY', 'RUSSLL_LTC', 'RUSSLL_OP', 'RUSSLL_RC'];
    let totalFiles = 0;
    
    facilities.forEach(facility => {
        const facilityPath = path.join('record-transformer/data/raw', facility);
        if (fs.existsSync(facilityPath)) {
            const files = fs.readdirSync(facilityPath);
            const htmlFiles = files.filter(f => f.endsWith('.html'));
            totalFiles += htmlFiles.length;
            console.log(`✅ ${facility}: ${htmlFiles.length} HTML files`);
        }
    });
    
    console.log(`✅ Total: ${totalFiles} sample files ready for processing`);
} catch (error) {
    console.log(`❌ Error checking sample data: ${error.message}`);
    allGood = false;
}

console.log('\n' + '='.repeat(50));

if (allGood) {
    console.log('🎉 Setup verification complete! All components ready.');
    console.log('\n🚀 Quick Start:');
    console.log('1. Backend: cd record-transformer && npm install && npm start');
    console.log('2. Frontend: Open api-medical-interface.html in browser');
    console.log('3. Test: Backend on :3001, Frontend shows connection status');
    console.log('\n📖 See INTEGRATION_GUIDE.md for detailed instructions');
} else {
    console.log('⚠️  Setup incomplete. Please check missing files above.');
}

console.log('\n📋 Project Summary:');
console.log('• Backend Service: Transforms HTML → JSON API');
console.log('• Frontend Interface: Modern UI with offline support');
console.log('• Sample Data: 4 facilities with medical records');
console.log('• Offline Mode: Works without backend using fallback data');
console.log('• Real-time Updates: 30-minute file monitoring');
