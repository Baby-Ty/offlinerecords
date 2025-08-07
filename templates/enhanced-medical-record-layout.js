/**
 * Enhanced Medical Record Layout Templates
 * Provides improved HTML structure for better table layout and readability
 */

// Enhanced patient header template
const ENHANCED_PATIENT_HEADER_TEMPLATE = `
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
`;

// Enhanced patient details template
const ENHANCED_PATIENT_DETAILS_TEMPLATE = `
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
        <div class="patient-details-grid">
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
</div>
`;

// Enhanced orders template with improved table structure
const ENHANCED_ORDERS_TEMPLATE = `
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
        <colgroup>
            <col class="marker-col" />
            <col class="schedule-col" />
            {{#each days}}
            <col class="day-col" />
            {{/each}}
        </colgroup>
        <thead>
            <tr>
                <th class="marker-col">&nbsp;</th>
                <th class="schedule-col">Schedule</th>
                {{#each days}}
                <th>{{this}}</th>
                {{/each}}
            </tr>
        </thead>
        <tbody>
            {{admins}}
        </tbody>
    </table>
</div>
`;

// Enhanced signature section template
const ENHANCED_SIGNATURE_TEMPLATE = `
<div class="signature-section">
    <div class="signature-header">Staff Signatures & Initials</div>
    <div class="signature-grid">
        {{#each signers}}
        <div class="signature-pair">
            <div class="signature-line">{{name}}</div>
            <div class="signature-initials">{{initials}}</div>
        </div>
        {{/each}}
    </div>
</div>
`;

// Enhanced injection sites and legend template
const ENHANCED_LEGEND_TEMPLATE = `
<div class="injection-legend-container">
    <div class="injection-sites">
        <div class="detail-label">Injection Sites</div>
        <div class="injection-sites-grid">
            {{injectionSite}}
        </div>
    </div>
    <div class="medication-legend">
        <div class="detail-label">Legend</div>
        <div class="legend-grid">
            <div class="legend-item">
                <span class="legend-symbol not-scheduled">⬜</span>
                <span class="legend-text">Not Scheduled</span>
            </div>
            <div class="legend-item">
                <span class="legend-symbol previously-scheduled">=</span>
                <span class="legend-text">Previously Scheduled</span>
            </div>
            <div class="legend-item">
                <span class="legend-symbol end-date">E</span>
                <span class="legend-text">End Date Reached</span>
            </div>
        </div>
    </div>
</div>
`;

/**
 * Enhanced layout transformation function
 * Transforms existing medical record HTML to use the enhanced layout
 */
function applyEnhancedLayout(originalHTML) {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    // Extract patient information
    const residentName = extractValue(tempDiv, '{{ResidentName}}') || 'Patient Name';
    const internalID = extractValue(tempDiv, '{{InternalID}}') || 'ID';
    const location = extractValue(tempDiv, '{{Location}}') || 'Location';
    const admitDate = extractValue(tempDiv, '{{AdmitDate}}') || 'Admit Date';
    
    // Extract medical information
    const allergies = extractValue(tempDiv, '{{Allergies}}') || 'None on file';
    const diagnoses1 = extractValue(tempDiv, '{{DiagICD1}}') || '';
    const diagnoses2 = extractValue(tempDiv, '{{DiagICD2}}') || '';
    const pharmacy = extractValue(tempDiv, '{{PreferredPharmacy}}') || 'Not specified';
    const physician = extractValue(tempDiv, '{{PrimaryPhysician}}') || 'Not assigned';
    
    // Build enhanced header
    let enhancedHTML = ENHANCED_PATIENT_HEADER_TEMPLATE
        .replace('{{ResidentName}}', residentName)
        .replace('{{InternalID}}', internalID)
        .replace('{{Location}}', location)
        .replace('{{AdmitDate}}', admitDate);
    
    // Build enhanced details section
    enhancedHTML += ENHANCED_PATIENT_DETAILS_TEMPLATE
        .replace('{{Allergies}}', allergies)
        .replace('{{DiagICD1}}', diagnoses1)
        .replace('{{DiagICD2}}', diagnoses2)
        .replace('{{PreferredPharmacy}}', pharmacy)
        .replace('{{PrimaryPhysician}}', physician);
    
    // Extract and enhance orders section
    const ordersSection = tempDiv.querySelector('#OrdersTemplate');
    if (ordersSection) {
        // Generate day columns (1-31)
        const days = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
        
        enhancedHTML += ENHANCED_ORDERS_TEMPLATE
            .replace('{{#each days}}{{this}}{{/each}}', 
                days.map(day => `<th>${day}</th>`).join(''))
            .replace('{{#each days}}<col class="day-col" />{{/each}}',
                days.map(() => '<col class="day-col" />').join(''));
    }
    
    // Add enhanced legend
    enhancedHTML += ENHANCED_LEGEND_TEMPLATE;
    
    // Generate signature section
    const signers = [];
    for (let i = 1; i <= 20; i++) {
        const name = extractValue(tempDiv, `{{signer${i}}}`) || '';
        const initials = extractValue(tempDiv, `{{signerInitials${i}}}`) || '';
        if (name || initials) {
            signers.push({name, initials});
        } else {
            signers.push({name: '', initials: ''});
        }
    }
    
    enhancedHTML += ENHANCED_SIGNATURE_TEMPLATE
        .replace('{{#each signers}}{{name}}{{initials}}{{/each}}',
            signers.map(signer => 
                `<div class="signature-pair">
                    <div class="signature-line">${signer.name}</div>
                    <div class="signature-initials">${signer.initials}</div>
                 </div>`
            ).join(''));
    
    return enhancedHTML;
}

/**
 * Helper function to extract template values
 */
function extractValue(element, template) {
    const content = element.innerHTML;
    const index = content.indexOf(template);
    if (index === -1) return null;
    
    // Extract the actual value around the template
    // This is a simplified extraction - in practice, you'd need more sophisticated parsing
    return template;
}

/**
 * Apply enhanced layout to existing medical record files
 */
function enhanceExistingRecords() {
    // This function would be called to upgrade existing record files
    // with the new enhanced layout structure
    
    const recordTypes = ['MED_data.html', 'TRE_data.html', 'Oth_data.html', 'Facesheet_data.html'];
    const facilities = ['RUSSLL_DAY', 'RUSSLL_LTC', 'RUSSLL_OP', 'RUSSLL_RC'];
    
    facilities.forEach(facility => {
        recordTypes.forEach(recordType => {
            const filePath = `offline data/${facility}/${recordType}`;
            // Load, transform, and save the enhanced version
            // Implementation would depend on the specific requirements
        });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENHANCED_PATIENT_HEADER_TEMPLATE,
        ENHANCED_PATIENT_DETAILS_TEMPLATE,
        ENHANCED_ORDERS_TEMPLATE,
        ENHANCED_SIGNATURE_TEMPLATE,
        ENHANCED_LEGEND_TEMPLATE,
        applyEnhancedLayout,
        enhanceExistingRecords
    };
}
