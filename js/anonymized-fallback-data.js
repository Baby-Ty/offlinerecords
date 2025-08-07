/**
 * Anonymized Fallback Data for Demo Mode
 * This data uses completely fictional names and information for demonstration purposes
 * All patient information has been anonymized with realistic but fake data
 */

const ANONYMIZED_FALLBACK_DATA = {
    residents: [
        {
            ResidentID: "10001",
            Name: "Anderson, Emily R",
            facility: "DEMO_DAY",
            hasData: {
                facesheet: true,
                medications: true,
                treatments: true,
                orders: true
            }
        },
        {
            ResidentID: "10002", 
            Name: "Williams, Robert J",
            facility: "DEMO_LTC",
            hasData: {
                facesheet: true,
                medications: true,
                treatments: false,
                orders: true
            }
        },
        {
            ResidentID: "10003",
            Name: "Johnson, Maria C",
            facility: "DEMO_OP",
            hasData: {
                facesheet: true,
                medications: false,
                treatments: true,
                orders: false
            }
        },
        {
            ResidentID: "10004",
            Name: "Davis, Michael A",
            facility: "DEMO_RC", 
            hasData: {
                facesheet: true,
                medications: true,
                treatments: true,
                orders: true
            }
        },
        {
            ResidentID: "10005",
            Name: "Brown, Sarah L",
            facility: "DEMO_LTC",
            hasData: {
                facesheet: true,
                medications: true,
                treatments: true,
                orders: false
            }
        },
        {
            ResidentID: "10006",
            Name: "Miller, James K",
            facility: "DEMO_DAY",
            hasData: {
                facesheet: true,
                medications: false,
                treatments: true,
                orders: true
            }
        }
    ],
    
    residentDetails: {
        "10001": {
            ResidentID: "10001",
            Name: "Anderson, Emily R",
            facility: "DEMO_DAY",
            facesheet: {
                ResidentName: "Anderson, Emily R",
                Age: "72",
                BirthDate: "1952-06-18",
                Gender: "Female",
                MaritalStatusDesc: "Widowed",
                Allergies: "Shellfish (anaphylaxis), Latex (mild reaction)",
                AdmittingDiagICD1: "Chronic Heart Failure (I50.9)",
                AdvancedDirectives: "DNR on file, Healthcare proxy designated",
                LevelOfCare: "Skilled Nursing",
                EmergencyContact: "Thompson, Jennifer (Daughter) - (555) 123-4567",
                PrimaryPhysician: "Dr. Martinez, Carlos MD - Cardiology Associates",
                InsuranceInfo: "Medicare Primary, Medicaid Secondary"
            },
            medications: [
                {
                    description: "Lisinopril 10mg Tablet",
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Daily at 08:00",
                    beginDate: "2024-01-15",
                    hasAdmins: true,
                    notes: "Monitor blood pressure, target <140/90"
                },
                {
                    description: "Furosemide 40mg Tablet", 
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Daily in morning",
                    beginDate: "2024-01-15", 
                    hasAdmins: true,
                    notes: "Diuretic for fluid management, monitor I&O"
                },
                {
                    description: "Warfarin 5mg Tablet",
                    quantity: "1",
                    dosageForm: "tablet", 
                    route: "Oral",
                    frequency: "Daily at 17:00",
                    beginDate: "2024-02-01",
                    hasAdmins: true,
                    notes: "Anticoagulation therapy, INR goal 2.0-3.0"
                }
            ],
            treatments: [
                {
                    description: "Physical Therapy - Gait Training",
                    orderType: "Therapy",
                    frequency: "3x weekly",
                    beginDate: "2024-01-20",
                    instructions: "Focus on balance and mobility improvement",
                    notes: "Patient reports improved confidence with walking"
                },
                {
                    description: "Cardiac Monitoring",
                    orderType: "Nursing",
                    frequency: "Daily",
                    beginDate: "2024-01-15",
                    instructions: "Monitor vital signs q8h, daily weights",
                    notes: "Alert for signs of fluid retention"
                }
            ],
            orders: [
                {
                    description: "Basic Metabolic Panel",
                    category: "Laboratory",
                    testPriority: "Routine",
                    beginDate: "2024-02-15",
                    specimen: "Blood",
                    instructions: "Morning draw, fasting not required",
                    notes: "Monitor kidney function and electrolytes"
                },
                {
                    description: "Echocardiogram",
                    category: "Imaging", 
                    testPriority: "Routine",
                    beginDate: "2024-02-20",
                    instructions: "Assess ejection fraction and wall motion",
                    notes: "Follow up on heart failure management"
                }
            ]
        },
        
        "10002": {
            ResidentID: "10002",
            Name: "Williams, Robert J", 
            facility: "DEMO_LTC",
            facesheet: {
                ResidentName: "Williams, Robert J",
                Age: "84",
                BirthDate: "1940-11-03",
                Gender: "Male", 
                MaritalStatusDesc: "Married",
                Allergies: "Penicillin (rash), Sulfa drugs (GI upset)",
                AdmittingDiagICD1: "Alzheimer's Disease (F03.90)",
                AdvancedDirectives: "DNR, Comfort Care Measures",
                LevelOfCare: "Long-term Care",
                EmergencyContact: "Williams, Dorothy (Spouse) - (555) 234-5678",
                PrimaryPhysician: "Dr. Chen, Lisa MD - Geriatric Medicine",
                InsuranceInfo: "Medicare Part A & B, Long-term Care Insurance"
            },
            medications: [
                {
                    description: "Donepezil 10mg Tablet",
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Daily at bedtime", 
                    beginDate: "2024-01-10",
                    hasAdmins: true,
                    notes: "Alzheimer's treatment, monitor for GI side effects"
                },
                {
                    description: "Memantine 10mg Tablet",
                    quantity: "1", 
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Twice daily",
                    beginDate: "2024-01-15",
                    hasAdmins: true,
                    notes: "Moderate-severe Alzheimer's therapy"
                },
                {
                    description: "Quetiapine 25mg Tablet",
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Bedtime PRN agitation",
                    beginDate: "2024-02-01",
                    hasAdmins: false,
                    notes: "For severe behavioral symptoms only"
                }
            ],
            treatments: [
                {
                    description: "Memory Care Activities",
                    orderType: "Activity Therapy",
                    frequency: "Daily",
                    beginDate: "2024-01-10",
                    instructions: "Structured activities for cognitive stimulation",
                    notes: "Responds well to music therapy"
                }
            ],
            orders: [
                {
                    description: "Comprehensive Metabolic Panel", 
                    category: "Laboratory",
                    testPriority: "Routine",
                    beginDate: "2024-02-25",
                    specimen: "Blood",
                    instructions: "Morning draw, baseline labs",
                    notes: "Monitor for medication side effects"
                }
            ]
        }
    },
    
    // Sample staff signatures for demo
    demoStaff: [
        { name: "Johnson, Amanda RN", initials: "AJ" },
        { name: "Martinez, Carlos LPN", initials: "CM" },
        { name: "Thompson, Diana RN", initials: "DT" },
        { name: "Brown, Kevin CNA", initials: "KB" },
        { name: "Wilson, Sarah RN", initials: "SW" },
        { name: "Davis, Michael CNA", initials: "MD" },
        { name: "Garcia, Rosa LPN", initials: "RG" },
        { name: "Anderson, James RN", initials: "JA" }
    ],
    
    // Demo facility information
    facilities: {
        "DEMO_DAY": {
            name: "Sunrise Day Program",
            type: "Day Program",
            address: "123 Healthcare Avenue, Medical City, ST 12345"
        },
        "DEMO_LTC": {
            name: "Meadowbrook Long Term Care",
            type: "Long Term Care",
            address: "456 Wellness Drive, Care Valley, ST 12346"
        },
        "DEMO_OP": {
            name: "Outpatient Services Center",
            type: "Outpatient",
            address: "789 Treatment Street, Health Town, ST 12347"
        },
        "DEMO_RC": {
            name: "Recovery Care Unit",
            type: "Rehabilitation",
            address: "321 Recovery Road, Healing Hills, ST 12348"
        }
    },
    
    status: {
        lastProcessed: "2024-02-20T10:30:00Z",
        totalResidents: 6,
        facilitiesProcessed: 4,
        lastError: null,
        dataType: "DEMO_ANONYMIZED"
    },
    
    residentsList: {
        lastUpdated: "2024-02-20T10:30:00Z",
        totalResidents: 6,
        facilitiesProcessed: 4,
        residents: [
            {
                ResidentID: "10001",
                Name: "Anderson, Emily R",
                facility: "DEMO_DAY",
                hasData: {
                    facesheet: true,
                    medications: true,
                    treatments: true,
                    orders: true
                }
            },
            {
                ResidentID: "10002",
                Name: "Williams, Robert J", 
                facility: "DEMO_LTC",
                hasData: {
                    facesheet: true,
                    medications: true,
                    treatments: true,
                    orders: true
                }
            },
            {
                ResidentID: "10003",
                Name: "Johnson, Maria C",
                facility: "DEMO_OP", 
                hasData: {
                    facesheet: true,
                    medications: false,
                    treatments: true,
                    orders: false
                }
            },
            {
                ResidentID: "10004",
                Name: "Davis, Michael A",
                facility: "DEMO_RC",
                hasData: {
                    facesheet: true,
                    medications: true, 
                    treatments: true,
                    orders: true
                }
            },
            {
                ResidentID: "10005",
                Name: "Brown, Sarah L",
                facility: "DEMO_LTC",
                hasData: {
                    facesheet: true,
                    medications: true,
                    treatments: true,
                    orders: false
                }
            },
            {
                ResidentID: "10006",
                Name: "Miller, James K",
                facility: "DEMO_DAY",
                hasData: {
                    facesheet: true,
                    medications: false,
                    treatments: true,
                    orders: true
                }
            }
        ]
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.ANONYMIZED_FALLBACK_DATA = ANONYMIZED_FALLBACK_DATA;
    // Also replace the original fallback data for demo mode
    window.FALLBACK_DATA = ANONYMIZED_FALLBACK_DATA;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANONYMIZED_FALLBACK_DATA;
}
