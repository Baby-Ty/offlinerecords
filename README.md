# Medical Records Interface Demo

🏥 **DEMO VERSION - CONTAINS ONLY FICTIONAL DATA**

This is a demonstration version of a medical records interface system that uses **completely anonymized and fictional patient data** for privacy protection and compliance purposes.

## ⚠️ Important Privacy Notice

- **NO REAL PATIENT DATA** is included in this repository
- All patient names, IDs, and medical information are **completely fictional**
- Facility names have been changed to clearly fictional alternatives
- This demo is **HIPAA-compliant** and safe for public demonstration

## 🎯 Demo Features

### Anonymized Demo Patients
- **Anderson, Emily R** (ID: 10001) - DEMO_DAY facility
- **Williams, Robert J** (ID: 10002) - DEMO_LTC facility  
- **Johnson, Maria C** (ID: 10003) - DEMO_OP facility
- **Davis, Michael A** (ID: 10004) - DEMO_RC facility
- **Brown, Sarah L** (ID: 10005) - DEMO_LTC facility
- **Miller, James K** (ID: 10006) - DEMO_DAY facility

### Demo Facilities
- **DEMO_DAY** - Sunrise Day Program
- **DEMO_LTC** - Meadowbrook Long Term Care  
- **DEMO_OP** - Outpatient Services Center
- **DEMO_RC** - Recovery Care Unit

## 🚀 Quick Start

### Option 1: Simple Demo
1. Open `demo.html` in your browser
2. Browse the anonymized patient records
3. Test the search and filtering features

### Option 2: Enhanced Layout Demo
1. Open `demo-enhanced-layout.html` in your browser
2. Experience the modern medical records interface
3. View detailed patient information (all fictional)

### Option 3: API Interface Demo
1. Open `api-medical-interface.html` in your browser
2. Test the API-driven interface with anonymized data

## 📁 Demo Files Structure

```
📂 Demo Files (Safe for GitHub)
├── demo.html                          # Main demo page
├── demo-enhanced-layout.html           # Enhanced interface demo  
├── api-medical-interface.html          # API interface demo
├── js/
│   ├── anonymized-fallback-data.js     # Fictional patient data
│   ├── fallback-data.js                # Main data file (anonymized)
│   ├── app.js                          # Main application logic
│   ├── api-client.js                   # API client functionality
│   └── components.js                   # UI components
├── styles/                             # CSS styling files
├── scripts/
│   └── apply-anonymized-data.js        # Anonymization utility
└── record-transformer/
    └── data/parsed/
        └── anonymized-index.json       # Anonymized data index
```

## 🔒 Data Protection

### Excluded from Repository
- All real patient data directories (`offline data/RUSSLL_*/`)
- Real patient parsed data files
- Any files containing actual patient information
- Backup files and logs that might contain sensitive data

### Included in Repository  
- Anonymized demonstration data
- User interface components
- Documentation and guides
- Styling and configuration files

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/Baby-Ty/offlinerecords.git
cd offlinerecords

# Open demo files in your browser
# No build process required - pure HTML/JS/CSS
```

### Record Transformer (Optional)
If you want to work with the record parsing system:
```bash
cd record-transformer
npm install
npm start
```

## 📋 Key Components

- **Medical Records Viewer** - Browse patient records by facility
- **Search & Filter** - Find specific patients or medical information  
- **Wing Cards Interface** - Modern card-based layout for patient data
- **API Integration** - RESTful API for data access
- **Responsive Design** - Works on desktop and mobile devices

## 🎨 Interface Features

- Modern, healthcare-focused UI design
- Intuitive navigation and search
- Mobile-responsive layout
- Accessibility features
- Clear visual indicators for demo mode

## 📚 Documentation

- `ANONYMIZATION_SUMMARY.md` - Details about data anonymization process
- `INTEGRATION_GUIDE.md` - Technical integration instructions  
- `PROJECT_SUMMARY.md` - Overall project overview
- `ENHANCED_LAYOUT_SUMMARY.md` - UI enhancement details

## ⚡ Performance

- Lightweight, client-side application
- No database dependencies for demo mode
- Fast loading with minimal external dependencies
- Offline-capable with fallback data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes (ensure no real data is included)
4. Test with the anonymized demo data
5. Submit a pull request

## 📄 License

This demo interface is provided for educational and demonstration purposes. The fictional patient data is not subject to HIPAA regulations as it contains no real patient information.

## 🔗 Links

- **GitHub Repository**: https://github.com/Baby-Ty/offlinerecords
- **Demo**: Open any of the HTML files in your browser

---

**Remember**: This repository contains ONLY fictional, anonymized data. No real patient information is stored or transmitted by this demo system.
