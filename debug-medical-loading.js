/**
 * Debug script to test medical record loading step by step
 */

// Test if we can open the medical record and see what's happening
console.log('=== Medical Record Loading Debug ===');

// Function to check if all required elements exist
function checkRequiredElements() {
    console.log('\n--- Checking Required Elements ---');
    
    const elements = {
        'LoadingTR': document.getElementById('LoadingTR'),
        'tblOrgList': document.getElementById('tblOrgList'),
        'orgTable': document.getElementById('orgTable'),
        'org2': document.getElementById('org2'),
        'org3': document.getElementById('org3'),
        'DRXML': document.getElementById('DRXML')
    };
    
    for (const [name, element] of Object.entries(elements)) {
        console.log(`${name}:`, element ? '✅ Found' : '❌ Missing');
        if (element && name.includes('Template')) {
            console.log(`  Template content:`, element.innerHTML.substring(0, 100) + '...');
        }
    }
    
    return elements;
}

// Function to test XML parsing
function testXMLParsing() {
    console.log('\n--- Testing XML Parsing ---');
    
    const xmlContent = document.getElementById('DRXML');
    if (!xmlContent) {
        console.error('❌ No DRXML element found');
        return null;
    }
    
    console.log('✅ DRXML element found');
    console.log('XML content length:', xmlContent.innerText.length);
    
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent.innerText, "text/xml");
        
        const orgXML = xmlDoc.getElementsByTagName('org1');
        console.log('Org1 elements found:', orgXML.length);
        
        if (orgXML.length > 0) {
            console.log('First org1 fullname:', orgXML[0].getAttribute('fullname'));
            
            const org2Elements = orgXML[0].getElementsByTagName('org2');
            console.log('Org2 elements in first org1:', org2Elements.length);
            
            for (let i = 0; i < Math.min(3, org2Elements.length); i++) {
                console.log(`  Org2[${i}] name:`, org2Elements[i].getAttribute('name'));
            }
        }
        
        return xmlDoc;
        
    } catch (error) {
        console.error('❌ XML parsing error:', error);
        return null;
    }
}

// Function to manually test wing card creation
function testWingCardCreation() {
    console.log('\n--- Testing Wing Card Creation ---');
    
    const orgContainer = document.getElementById('tblOrgList');
    if (!orgContainer) {
        console.error('❌ No tblOrgList container found');
        return;
    }
    
    // Create test wing cards manually
    const testHTML = `
        <div class="facility-title">Test Facility</div>
        <div class="wing-cards">
            <div class="wing-card active" onclick="toggleWing(this);" data-wing="Test Wing A">
                Test Wing A
                <input type="checkbox" name="chkOrgName2" checked style="display: none;" />
            </div>
            <div class="wing-card active" onclick="toggleWing(this);" data-wing="Test Wing B">
                Test Wing B
                <input type="checkbox" name="chkOrgName2" checked style="display: none;" />
            </div>
        </div>
    `;
    
    orgContainer.innerHTML = testHTML;
    console.log('✅ Test wing cards created');
    
    // Hide loading text
    const loadingElement = document.getElementById('LoadingTR');
    if (loadingElement) {
        loadingElement.style.display = 'none';
        console.log('✅ Loading text hidden');
    }
}

// Main debug function
function debugMedicalLoading() {
    console.log('Starting medical record debug...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', debugMedicalLoading);
        return;
    }
    
    const elements = checkRequiredElements();
    const xmlDoc = testXMLParsing();
    
    if (!elements.tblOrgList) {
        console.error('❌ Cannot proceed - missing org container');
        return;
    }
    
    if (!xmlDoc) {
        console.log('⚠️ XML parsing failed, creating test wing cards instead');
        testWingCardCreation();
        return;
    }
    
    console.log('\n--- Attempting Normal Parsing ---');
    try {
        parseOrgXML(xmlDoc);
        console.log('✅ parseOrgXML completed');
    } catch (error) {
        console.error('❌ parseOrgXML failed:', error);
        console.log('🔧 Creating test wing cards instead');
        testWingCardCreation();
    }
}

// Auto-run debug when script loads
debugMedicalLoading();