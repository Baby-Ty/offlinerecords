const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');
const { processFiles } = require('./processor');

const DATA_DIR = path.join(__dirname, '../../data/raw');
const WATCH_PATTERNS = [
    'Facesheet_data.html',
    'MED_data.html', 
    'TRE_data.html',
    'Oth_data.html'
];

let processingInterval;

const startFileWatcher = async () => {
    console.log('Starting file watcher...');
    console.log('Watching directory:', DATA_DIR);
    
    // Check if anonymized data exists - if so, skip real data processing
    const anonymizedIndexPath = path.join(__dirname, '../../data/parsed/anonymized-index.json');
    if (await fs.pathExists(anonymizedIndexPath)) {
        console.log('DEMO MODE: Anonymized data found. Skipping real data processing to preserve demo data.');
        return null; // Don't start file processing
    }
    
    // Process files immediately on startup
    await processFiles();
    
    // Set up file watcher for immediate processing when files change
    const watcher = chokidar.watch(WATCH_PATTERNS.map(pattern => path.join(DATA_DIR, '**', pattern)), {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    });

    watcher.on('change', async (filePath) => {
        console.log(`File changed: ${filePath}`);
        await processFiles();
    });

    watcher.on('add', async (filePath) => {
        console.log(`File added: ${filePath}`);
        await processFiles();
    });

    watcher.on('error', (error) => {
        console.error('File watcher error:', error);
    });

    // Set up 30-minute interval processing
    processingInterval = setInterval(async () => {
        console.log('Running scheduled file processing...');
        await processFiles();
    }, 30 * 60 * 1000); // 30 minutes

    console.log('File watcher started. Processing every 30 minutes.');
    
    return watcher;
};

const stopFileWatcher = () => {
    if (processingInterval) {
        clearInterval(processingInterval);
        processingInterval = null;
    }
};

module.exports = {
    startFileWatcher,
    stopFileWatcher
};
