# Medical Record Transformer Service

A Node.js service that transforms HTML medical reports into structured JSON data, providing a REST API for accessing resident medical information.

## Features

- **File Monitoring**: Watches for changes in medical report HTML files every 30 minutes
- **Data Transformation**: Converts HTML/XML medical records into structured JSON
- **REST API**: Provides endpoints for accessing resident data
- **Modular Parsers**: Separate parsers for different record types:
  - Facesheet (demographics)
  - Medications (MED data)
  - Treatments (TRE data)  
  - Orders (OTH data - labs, therapies)

## Installation

```bash
npm install
```

## Directory Structure

```
record-transformer/
├── data/
│   ├── raw/                    # Input HTML files
│   │   ├── FACILITY_NAME/
│   │   │   ├── Facesheet_data.html
│   │   │   ├── MED_data.html
│   │   │   ├── TRE_data.html
│   │   │   └── Oth_data.html
│   └── parsed/                 # Output JSON files
│       ├── index.json          # List of all residents
│       └── {ResidentID}.json   # Individual resident data
├── src/
│   ├── parsers/                # HTML/XML parsers
│   ├── services/               # Core services
│   └── server.js               # Main server
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The service will start on port 3001 (configurable via PORT environment variable).

## API Endpoints

### GET /residents
Returns a list of all residents with summary information.

**Response:**
```json
{
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "totalResidents": 25,
  "facilitiesProcessed": 4,
  "residents": [
    {
      "ResidentID": "12345",
      "Name": "John Doe",
      "facility": "RUSSLL_DAY",
      "hasData": {
        "facesheet": true,
        "medications": true,
        "treatments": false,
        "orders": true
      }
    }
  ]
}
```

### GET /residents/:id
Returns detailed information for a specific resident.

**Response:**
```json
{
  "ResidentID": "12345",
  "Name": "John Doe",
  "facility": "RUSSLL_DAY",
  "facesheet": {
    "ResidentName": "John Doe",
    "Age": "78",
    "BirthDate": "01/15/1946",
    "Allergies": "NKDA",
    // ... full demographic data
  },
  "medications": [
    {
      "orderId": "MED001",
      "description": "Lisinopril 10mg",
      "frequency": "Daily",
      "route": "PO",
      // ... detailed medication info
    }
  ],
  "treatments": [
    // ... treatment records
  ],
  "orders": [
    // ... lab/therapy orders
  ]
}
```

### GET /status
Returns processing status and system information.

**Response:**
```json
{
  "status": "running",
  "lastProcessed": "2024-01-15T10:30:00.000Z",
  "totalResidents": 25,
  "facilitiesProcessed": 4,
  "rawFiles": {
    "RUSSLL_DAY": {
      "Facesheet_data.html": {
        "exists": true,
        "lastModified": "2024-01-15T10:25:00.000Z",
        "size": 125840
      }
    }
  },
  "timestamp": "2024-01-15T10:30:15.000Z"
}
```

### GET /health
Health check endpoint.

## Data Processing

The service processes four types of medical record files:

1. **Facesheet_data.html** - Demographics, contact info, diagnoses, allergies
2. **MED_data.html** - Medication orders and administration records  
3. **TRE_data.html** - Treatment orders and schedules
4. **Oth_data.html** - Other orders (labs, therapies, consults)

Files are monitored in the `data/raw/` directory, organized by facility:

```
data/raw/
├── RUSSLL_DAY/
├── RUSSLL_LTC/
├── RUSSLL_OP/
└── RUSSLL_RC/
```

## JSON Output Structure

Each resident's data is combined from all four file types into a unified JSON structure:

```json
{
  "ResidentID": "unique-identifier",
  "Name": "Resident Name",
  "facility": "Facility Name",
  "facesheet": {
    // Demographics, contacts, diagnoses, etc.
  },
  "medications": [
    // Array of medication orders with administration schedules
  ],
  "treatments": [
    // Array of treatment orders with schedules  
  ],
  "orders": [
    // Array of lab/therapy/other orders
  ]
}
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Monitoring & Processing

- Files are processed immediately when detected
- Automatic reprocessing every 30 minutes
- File watcher detects changes and triggers immediate processing
- Processing status available via `/status` endpoint
