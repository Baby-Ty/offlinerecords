const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { startFileWatcher } = require('./services/fileWatcher');
const { getResidents, getResident, getStatus } = require('./services/dataService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure directories exist
const ensureDirectories = async () => {
    const dataDir = path.join(__dirname, '../data');
    const rawDir = path.join(dataDir, 'raw');
    const parsedDir = path.join(dataDir, 'parsed');
    
    await fs.ensureDir(rawDir);
    await fs.ensureDir(parsedDir);
    
    console.log('Data directories ensured:', { rawDir, parsedDir });
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'record-transformer'
    });
});

// API Routes
app.get('/residents', async (req, res) => {
    try {
        const residents = await getResidents();
        res.json(residents);
    } catch (error) {
        console.error('Error getting residents:', error);
        res.status(500).json({ error: 'Failed to get residents' });
    }
});

app.get('/residents/:id', async (req, res) => {
    try {
        const resident = await getResident(req.params.id);
        if (!resident) {
            return res.status(404).json({ error: 'Resident not found' });
        }
        res.json(resident);
    } catch (error) {
        console.error('Error getting resident:', error);
        res.status(500).json({ error: 'Failed to get resident' });
    }
});

app.get('/status', async (req, res) => {
    try {
        const status = await getStatus();
        res.json(status);
    } catch (error) {
        console.error('Error getting status:', error);
        res.status(500).json({ error: 'Failed to get status' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
    try {
        await ensureDirectories();
        await startFileWatcher();
        
        app.listen(PORT, () => {
            console.log(`Record Transformer API running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`API endpoints:`);
            console.log(`  GET /residents - List all residents`);
            console.log(`  GET /residents/:id - Get specific resident`);
            console.log(`  GET /status - Get processing status`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
