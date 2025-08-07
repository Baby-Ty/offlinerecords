#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests both backend and frontend components
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Testing Medical Records Integration...\n');

async function testIntegration() {
    const results = {
        backend: { status: '❓', tests: [] },
        frontend: { status: '❓', tests: [] },
        integration: { status: '❓', tests: [] }
    };

    // Test 1: Backend Structure
    console.log('1️⃣ Testing Backend Structure...');
    try {
        const backendPath = path.join(__dirname, 'record-transformer');
        const requiredFiles = [
            'package.json',
            'src/server.js',
            'src/services/fileWatcher.js',
            'src/services/processor.js',
            'src/services/dataService.js',
            'src/parsers/facesheetParser.js',
            'src/parsers/medicationParser.js',
            'src/parsers/treatmentParser.js',
            'src/parsers/orderParser.js'
        ];

        for (const file of requiredFiles) {
            const filePath = path.join(backendPath, file);
            if (await fs.pathExists(filePath)) {
                results.backend.tests.push(`✅ ${file} exists`);
            } else {
                results.backend.tests.push(`❌ ${file} missing`);
                throw new Error(`Missing file: ${file}`);
            }
        }

        // Check data directories
        const dataPath = path.join(backendPath, 'data');
        const rawPath = path.join(dataPath, 'raw');
        if (await fs.pathExists(rawPath)) {
            const facilities = await fs.readdir(rawPath);
            const validFacilities = facilities.filter(f => 
                fs.statSync(path.join(rawPath, f)).isDirectory()
            );
            results.backend.tests.push(`✅ Found ${validFacilities.length} facility directories`);
        }

        results.backend.status = '✅';
        console.log('   ✅ Backend structure valid\n');

    } catch (error) {
        results.backend.status = '❌';
        results.backend.tests.push(`❌ Error: ${error.message}`);
        console.log(`   ❌ Backend structure error: ${error.message}\n`);
    }

    // Test 2: Frontend Structure
    console.log('2️⃣ Testing Frontend Structure...');
    try {
        const frontendFiles = [
            'api-medical-interface.html',
            'js/api-client.js',
            'js/components.js',
            'js/app.js',
            'js/fallback-data.js',
            'styles/medical-api-interface.css'
        ];

        for (const file of frontendFiles) {
            const filePath = path.join(__dirname, file);
            if (await fs.pathExists(filePath)) {
                results.frontend.tests.push(`✅ ${file} exists`);
            } else {
                results.frontend.tests.push(`❌ ${file} missing`);
                throw new Error(`Missing file: ${file}`);
            }
        }

        // Check HTML file has required elements
        const htmlContent = await fs.readFile(path.join(__dirname, 'api-medical-interface.html'), 'utf8');
        const requiredElements = [
            'id="residentCardTemplate"',
            'js/fallback-data.js',
            'js/api-client.js',
            'js/components.js',
            'js/app.js'
        ];

        for (const element of requiredElements) {
            if (htmlContent.includes(element)) {
                results.frontend.tests.push(`✅ HTML contains ${element}`);
            } else {
                results.frontend.tests.push(`❌ HTML missing ${element}`);
                throw new Error(`Missing HTML element: ${element}`);
            }
        }

        results.frontend.status = '✅';
        console.log('   ✅ Frontend structure valid\n');

    } catch (error) {
        results.frontend.status = '❌';
        results.frontend.tests.push(`❌ Error: ${error.message}`);
        console.log(`   ❌ Frontend structure error: ${error.message}\n`);
    }

    // Test 3: Integration Tests
    console.log('3️⃣ Testing Integration Features...');
    try {
        // Check fallback data structure
        const fallbackPath = path.join(__dirname, 'js/fallback-data.js');
        const fallbackContent = await fs.readFile(fallbackPath, 'utf8');
        
        if (fallbackContent.includes('FALLBACK_DATA')) {
            results.integration.tests.push('✅ Fallback data defined');
        } else {
            throw new Error('Fallback data not found');
        }

        if (fallbackContent.includes('residentDetails')) {
            results.integration.tests.push('✅ Sample resident details available');
        }

        // Check backend package.json
        const packagePath = path.join(__dirname, 'record-transformer/package.json');
        const packageContent = await fs.readJson(packagePath);
        
        const requiredDeps = ['express', 'cheerio', 'chokidar', 'cors', 'fs-extra'];
        for (const dep of requiredDeps) {
            if (packageContent.dependencies[dep]) {
                results.integration.tests.push(`✅ Dependency ${dep} configured`);
            } else {
                throw new Error(`Missing dependency: ${dep}`);
            }
        }

        // Check if setup script exists
        if (packageContent.scripts && packageContent.scripts.setup) {
            results.integration.tests.push('✅ Setup script available');
        }

        results.integration.status = '✅';
        console.log('   ✅ Integration features valid\n');

    } catch (error) {
        results.integration.status = '❌';
        results.integration.tests.push(`❌ Error: ${error.message}`);
        console.log(`   ❌ Integration error: ${error.message}\n`);
    }

    // Generate Report
    console.log('📊 Test Results Summary:');
    console.log('========================\n');

    Object.entries(results).forEach(([category, result]) => {
        console.log(`${category.toUpperCase()} ${result.status}`);
        result.tests.forEach(test => console.log(`  ${test}`));
        console.log('');
    });

    const allPassed = Object.values(results).every(r => r.status === '✅');
    
    if (allPassed) {
        console.log('🎉 All tests passed! Integration is ready.');
        console.log('\n📋 Next Steps:');
        console.log('1. Start backend: cd record-transformer && npm start');
        console.log('2. Open frontend: api-medical-interface.html');
        console.log('3. Check connectivity and data loading');
        console.log('\n📚 See INTEGRATION_GUIDE.md for detailed instructions');
    } else {
        console.log('⚠️  Some tests failed. Review errors above.');
        process.exit(1);
    }
}

// Auto-run if called directly
if (require.main === module) {
    testIntegration().catch(console.error);
}

module.exports = { testIntegration };
