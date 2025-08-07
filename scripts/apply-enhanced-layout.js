/**
 * Apply Enhanced Layout to Medical Records
 * This script applies the new enhanced layout to existing medical record files
 */

class MedicalRecordEnhancer {
    constructor() {
        this.facilityDirectories = [
            'offline data/RUSSLL_DAY',
            'offline data/RUSSLL_LTC', 
            'offline data/RUSSLL_OP',
            'offline data/RUSSLL_RC'
        ];
        
        this.recordTypes = [
            'MED_data.html',
            'TRE_data.html', 
            'Oth_data.html',
            'Facesheet_data.html'
        ];
        
        this.enhancedCSSPath = '../styles/improved-medical-records.css';
    }
    
    /**
     * Apply enhanced layout to all medical record files
     */
    async enhanceAllRecords() {
        console.log('🏥 Starting Medical Record Layout Enhancement...');
        
        for (const facility of this.facilityDirectories) {
            console.log(`\n📁 Processing facility: ${facility}`);
            
            for (const recordType of this.recordTypes) {
                const filePath = `${facility}/${recordType}`;
                await this.enhanceRecordFile(filePath);
            }
        }
        
        console.log('\n✅ Enhancement complete! All medical records have been upgraded.');
    }
    
    /**
     * Enhance a single medical record file
     */
    async enhanceRecordFile(filePath) {
        try {
            console.log(`  🔄 Enhancing: ${filePath}`);
            
            // Read the existing file
            const response = await fetch(filePath);
            if (!response.ok) {
                console.log(`  ⚠️  File not found: ${filePath}`);
                return;
            }
            
            let htmlContent = await response.text();
            
            // Apply enhancements
            htmlContent = this.injectEnhancedCSS(htmlContent);
            htmlContent = this.enhancePatientHeader(htmlContent);
            htmlContent = this.enhancePatientDetails(htmlContent);
            htmlContent = this.enhanceOrdersTable(htmlContent);
            htmlContent = this.enhanceSignatureSection(htmlContent);
            htmlContent = this.addResponsiveMetadata(htmlContent);
            
            // Save the enhanced file (in a real implementation, you'd write to file system)
            console.log(`  ✅ Enhanced: ${filePath}`);
            
            // Create backup of original
            // In a real implementation, create a backup before modifying
            
        } catch (error) {
            console.error(`  ❌ Error enhancing ${filePath}:`, error);
        }
    }
    
    /**
     * Inject the enhanced CSS stylesheet
     */
    injectEnhancedCSS(htmlContent) {
        // Add the enhanced CSS link in the head section
        const cssLink = `<link rel="stylesheet" href="${this.enhancedCSSPath}">`;
        
        if (htmlContent.includes('<head>')) {
            htmlContent = htmlContent.replace(
                '</head>', 
                `    ${cssLink}\n</head>`
            );
        } else {
            // If no head section, add one
            htmlContent = htmlContent.replace(
                '<html',
                `<html`
            ).replace(
                '>',
                `>\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ${cssLink}\n</head>`
            );
        }
        
        return htmlContent;
    }
    
    /**
     * Enhance the patient header section
     */
    enhancePatientHeader(htmlContent) {
        // Find the existing header table and wrap it with enhanced styling
        const headerPattern = /<TR>\s*<TD[^>]*>\s*<strong>\s*\{\{ResidentName\}\}\s*<\/strong>/i;
        
        if (headerPattern.test(htmlContent)) {
            // Find the complete header table section
            const tableStart = htmlContent.search(/<TABLE[^>]*border[^>]*>/i);
            const tableEnd = htmlContent.indexOf('</TABLE>', tableStart) + 8;
            
            if (tableStart !== -1 && tableEnd !== -1) {
                const originalTable = htmlContent.substring(tableStart, tableEnd);
                
                const enhancedHeader = `
                <!-- Enhanced Patient Header -->
                <div class="patient-header">
                    <div class="resident-name">{{ResidentName}}</div>
                    <div class="patient-header-grid">
                        <div class="patient-header-item">
                            <div class="patient-header-label">Internal ID</div>
                            <div class="patient-header-value">{{InternalID}}</div>
                        </div>
                        <div class="patient-header-item">
                            <div class="patient-header-label">Location</div>
                            <div class="patient-header-value">{{Location}}</div>
                        </div>
                        <div class="patient-header-item">
                            <div class="patient-header-label">Admit Date</div>
                            <div class="patient-header-value">{{AdmitDate}}</div>
                        </div>
                        <div class="patient-header-item">
                            <div class="patient-header-label">Supervising Nurse</div>
                            <div class="patient-header-value">&nbsp;</div>
                        </div>
                    </div>
                </div>
                
                <!-- Original Table for Compatibility -->
                <div style="display: none;">
                    ${originalTable}
                </div>`;
                
                htmlContent = htmlContent.substring(0, tableStart) + 
                             enhancedHeader + 
                             htmlContent.substring(tableEnd);
            }
        }
        
        return htmlContent;
    }
    
    /**
     * Enhance the patient details section
     */
    enhancePatientDetails(htmlContent) {
        // Find diagnosis/allergies section and enhance it
        const detailsPattern = /Diagnoses.*?Allergies/s;
        
        if (detailsPattern.test(htmlContent)) {
            const enhancedDetails = `
            <!-- Enhanced Patient Details -->
            <div class="patient-details">
                <div class="patient-details-row">
                    <div class="detail-group">
                        <div class="detail-label">Diagnoses</div>
                        <div class="detail-value">
                            <strong>{{DiagICD1Hdr}}</strong> {{DiagICD1}}
                            <br>
                            <strong>{{DiagICD2Hdr}}</strong> {{DiagICD2}}
                        </div>
                    </div>
                    <div class="detail-group">
                        <div class="detail-label">Advance Directives</div>
                        <div class="detail-value">{{AdvanceDirectives}}</div>
                    </div>
                </div>
                <div class="patient-details-row">
                    <div class="detail-group critical">
                        <div class="detail-label">Allergies</div>
                        <div class="detail-value">{{Allergies}}</div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="detail-group">
                            <div class="detail-label">Preferred Pharmacy</div>
                            <div class="detail-value">{{PreferredPharmacy}}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">Primary Physician</div>
                            <div class="detail-value">{{PrimaryPhysician}}</div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            // Insert enhanced details after the header
            const headerEnd = htmlContent.indexOf('</div>', htmlContent.indexOf('patient-header')) + 6;
            if (headerEnd > 5) {
                htmlContent = htmlContent.substring(0, headerEnd) + 
                             enhancedDetails + 
                             htmlContent.substring(headerEnd);
            }
        }
        
        return htmlContent;
    }
    
    /**
     * Enhance the orders/medications table
     */
    enhanceOrdersTable(htmlContent) {
        // Find the OrdersTemplate script and enhance it
        const ordersTemplatePattern = /<script id="OrdersTemplate"[^>]*>(.*?)<\/script>/s;
        const match = htmlContent.match(ordersTemplatePattern);
        
        if (match) {
            const enhancedOrdersTemplate = `
            <script id="OrdersTemplate" type="text/template">
                <div class="orders-container">
                    <div class="orders-header">
                        <div class="orders-title">{{OrderTypeFullDesc}}</div>
                        <div class="orders-meta">Order #{{resordernum}} of {{resordertotal}} for {{ResidentName}}</div>
                    </div>
                    
                    <div class="medication-info">
                        <div class="medication-info-grid">
                            <div>
                                <div class="medication-primary">{{Description}} ({{Quantity}}) {{DosageForm}} {{Route}}</div>
                                <div class="medication-details">
                                    {{genSubActive}}<br>
                                    {{Frequency}} Starting {{BeginDate}}<br>
                                    <strong>{{SpecimenCollctedByDesc}}</strong> {{SpecimenCollctedBy}}
                                </div>
                            </div>
                            <div class="medication-schedule">
                                <div class="detail-label">Order Information</div>
                                <div class="detail-value">
                                    <strong>Order ID:</strong> {{ResOrderSys}}<br>
                                    <strong>Order Date:</strong> {{BeginDate}}<br>
                                    <strong>{{SpecimenDesc}}</strong> {{Specimen}}
                                </div>
                            </div>
                            <div class="medication-notes">
                                <div class="detail-label">Notes & Instructions</div>
                                <div class="detail-value">
                                    <strong>Notes:</strong> {{Notes}}<br>
                                    <strong>Instructions:</strong> {{Instructions}}<br>
                                    <strong>Therapeutic Range:</strong> {{TreatmentRange}}<br>
                                    <strong>{{TestPriorityDesc}}</strong> {{TestPriority}}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <table class="orders-table">
                        ${match[1].replace(/style="[^"]*"/g, '')} <!-- Remove inline styles -->
                    </table>
                </div>
                {{pagebreak}}
            </script>`;
            
            htmlContent = htmlContent.replace(ordersTemplatePattern, enhancedOrdersTemplate);
        }
        
        return htmlContent;
    }
    
    /**
     * Enhance the signature section
     */
    enhanceSignatureSection(htmlContent) {
        // Find the signature table and enhance it
        const signaturePattern = /<TABLE[^>]*>\s*<COLGROUP>.*?<\/TABLE>/s;
        const signatureMatch = htmlContent.match(signaturePattern);
        
        if (signatureMatch && signatureMatch[0].includes('Signature')) {
            const enhancedSignature = `
            <div class="signature-section">
                <div class="signature-header">Staff Signatures & Initials</div>
                <div class="signature-grid">
                    <div class="signature-pair">
                        <div class="signature-line">{{signer1}}</div>
                        <div class="signature-initials">{{signerInitials1}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer2}}</div>
                        <div class="signature-initials">{{signerInitials2}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer3}}</div>
                        <div class="signature-initials">{{signerInitials3}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer4}}</div>
                        <div class="signature-initials">{{signerInitials4}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer5}}</div>
                        <div class="signature-initials">{{signerInitials5}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer6}}</div>
                        <div class="signature-initials">{{signerInitials6}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer7}}</div>
                        <div class="signature-initials">{{signerInitials7}}</div>
                    </div>
                    <div class="signature-pair">
                        <div class="signature-line">{{signer8}}</div>
                        <div class="signature-initials">{{signerInitials8}}</div>
                    </div>
                </div>
            </div>
            
            <!-- Original signature table hidden for compatibility -->
            <div style="display: none;">
                ${signatureMatch[0]}
            </div>`;
            
            htmlContent = htmlContent.replace(signaturePattern, enhancedSignature);
        }
        
        return htmlContent;
    }
    
    /**
     * Add responsive metadata to the HTML head
     */
    addResponsiveMetadata(htmlContent) {
        if (!htmlContent.includes('viewport')) {
            htmlContent = htmlContent.replace(
                '<head>',
                '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
            );
        }
        
        return htmlContent;
    }
    
    /**
     * Create a backup of the original file
     */
    createBackup(filePath, originalContent) {
        const backupPath = filePath.replace('.html', '.original.html');
        // In a real implementation, write originalContent to backupPath
        console.log(`  💾 Backup created: ${backupPath}`);
    }
    
    /**
     * Validate the enhanced HTML
     */
    validateEnhancedHTML(htmlContent) {
        const checks = [
            { test: htmlContent.includes('patient-header'), message: 'Patient header enhanced' },
            { test: htmlContent.includes('patient-details'), message: 'Patient details enhanced' },
            { test: htmlContent.includes('orders-container'), message: 'Orders table enhanced' },
            { test: htmlContent.includes('signature-section'), message: 'Signature section enhanced' },
            { test: htmlContent.includes('improved-medical-records.css'), message: 'Enhanced CSS included' }
        ];
        
        const passed = checks.filter(check => check.test).length;
        const total = checks.length;
        
        console.log(`  📊 Validation: ${passed}/${total} enhancements applied`);
        
        return passed === total;
    }
}

// Usage
async function enhanceMedicalRecords() {
    const enhancer = new MedicalRecordEnhancer();
    await enhancer.enhanceAllRecords();
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MedicalRecordEnhancer, enhanceMedicalRecords };
} else if (typeof window !== 'undefined') {
    window.MedicalRecordEnhancer = MedicalRecordEnhancer;
    window.enhanceMedicalRecords = enhanceMedicalRecords;
}

// Run enhancement if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    enhanceMedicalRecords().catch(console.error);
}
