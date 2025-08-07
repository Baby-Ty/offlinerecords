/**
 * Medical Records Enhancement Script
 * Automatically applies professional styling and layout improvements to medical record displays
 * Version 1.0
 */

class MedicalRecordsEnhancer {
    constructor() {
        this.enhancedCSSPath = '../Data/enhanced-medical-records.css';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.enhance());
        } else {
            this.enhance();
        }
    }

    enhance() {
        this.loadEnhancedCSS();
        this.enhanceTableStructure();
        this.addResponsiveFeatures();
        this.improveAccessibility();
        this.addTableInteractivity();
        this.enhanceFormElements();
        console.log('Medical records enhanced with professional styling');
    }

    loadEnhancedCSS() {
        // Check if already loaded
        if (document.querySelector('link[href*="enhanced-medical-records.css"]')) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = this.enhancedCSSPath;
        link.id = 'enhanced-medical-css';
        document.head.appendChild(link);
    }

    enhanceTableStructure() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table, index) => {
            // Add responsive wrapper
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }

            // Add table identification
            if (!table.id) {
                table.id = `medical-table-${index + 1}`;
            }

            // Enhance headers
            this.enhanceTableHeaders(table);
            
            // Enhance medication scheduling cells
            this.enhanceMedicationCells(table);
            
            // Add zebra striping classes if not present
            this.addZebraStriping(table);
            
            // Add hover effects data attributes
            table.setAttribute('data-enhanced', 'true');
        });
    }

    enhanceTableHeaders(table) {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            // Clean up header text and add proper capitalization
            const text = header.textContent.trim();
            if (text && text.length > 0) {
                // Add sort indicator for data columns
                if (this.isDataColumn(text)) {
                    header.setAttribute('data-sortable', 'true');
                    header.style.cursor = 'pointer';
                    header.title = `Click to sort by ${text}`;
                }
            }
        });
    }

    enhanceMedicationCells(table) {
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
            const text = cell.textContent.trim();
            
            // Enhance time cells
            if (this.isTimeFormat(text)) {
                cell.classList.add('medication-time');
            }
            
            // Enhance dose information
            if (this.isDoseFormat(text)) {
                cell.classList.add('medication-dose');
            }
            
            // Enhance status indicators
            if (this.isStatusIndicator(text)) {
                cell.classList.add(this.getStatusClass(text));
            }
            
            // Add data labels for mobile responsiveness
            const headerIndex = this.getCellHeaderIndex(cell);
            if (headerIndex >= 0) {
                const header = this.getTableHeader(table, headerIndex);
                if (header) {
                    cell.setAttribute('data-label', header.textContent.trim());
                }
            }
        });
    }

    addZebraStriping(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.setAttribute('data-row-index', index);
        });
    }

    addResponsiveFeatures() {
        // Add viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(viewport);
        }

        // Make large tables horizontally scrollable on mobile
        const largeTables = document.querySelectorAll('table[style*="width:100%"]');
        largeTables.forEach(table => {
            if (table.offsetWidth > window.innerWidth) {
                table.closest('.table-responsive')?.classList.add('mobile-scroll');
            }
        });
    }

    improveAccessibility() {
        // Add ARIA labels and roles
        const tables = document.querySelectorAll('table');
        tables.forEach((table, index) => {
            table.setAttribute('role', 'table');
            table.setAttribute('aria-label', `Medical Record Table ${index + 1}`);
            
            // Add caption if missing
            if (!table.querySelector('caption')) {
                const caption = document.createElement('caption');
                caption.textContent = `Medical Record Data Table ${index + 1}`;
                caption.className = 'sr-only'; // Screen reader only
                table.insertBefore(caption, table.firstChild);
            }
        });

        // Enhance form accessibility
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.id) {
                input.id = `medical-input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }
            
            // Add ARIA labels where missing
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = this.findAssociatedLabel(input);
                if (label) {
                    input.setAttribute('aria-label', label);
                }
            }
        });
    }

    addTableInteractivity() {
        // Add sortable functionality to data tables
        const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', (e) => this.sortTable(e.target));
        });

        // Add row highlighting on hover
        const tables = document.querySelectorAll('table[data-enhanced="true"]');
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.addEventListener('mouseenter', () => this.highlightRow(row));
                row.addEventListener('mouseleave', () => this.unhighlightRow(row));
            });
        });
    }

    enhanceFormElements() {
        // Enhance checkboxes and radio buttons
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
            });
        });

        // Enhance select dropdowns
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleSelectChange(e.target);
            });
        });
    }

    // Helper methods
    isDataColumn(text) {
        const dataColumns = ['date', 'time', 'dose', 'medication', 'status', 'admin', 'signature'];
        return dataColumns.some(col => text.toLowerCase().includes(col));
    }

    isTimeFormat(text) {
        return /^\d{1,2}:\d{2}\s*(AM|PM)?$/i.test(text) || /^\d{1,2}:\d{2}$/i.test(text);
    }

    isDoseFormat(text) {
        return /\d+\s*(mg|ml|units?|tabs?|capsules?)/i.test(text);
    }

    isStatusIndicator(text) {
        const statusValues = ['✓', '×', 'given', 'held', 'refused', 'na', 'not given', 'administered'];
        return statusValues.some(status => text.toLowerCase().includes(status.toLowerCase()));
    }

    getStatusClass(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('✓') || lowerText.includes('given') || lowerText.includes('administered')) {
            return 'status-active';
        } else if (lowerText.includes('held') || lowerText.includes('refused')) {
            return 'status-warning';
        } else if (lowerText.includes('×') || lowerText.includes('not given')) {
            return 'status-inactive';
        }
        return '';
    }

    getCellHeaderIndex(cell) {
        const row = cell.parentElement;
        return Array.from(row.children).indexOf(cell);
    }

    getTableHeader(table, index) {
        const headerRow = table.querySelector('thead tr, tr');
        return headerRow ? headerRow.children[index] : null;
    }

    findAssociatedLabel(input) {
        // Look for label element
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) return label.textContent.trim();
        
        // Look for parent label
        const parentLabel = input.closest('label');
        if (parentLabel) return parentLabel.textContent.trim();
        
        // Look for sibling text
        const sibling = input.previousElementSibling || input.nextElementSibling;
        if (sibling && sibling.textContent) return sibling.textContent.trim();
        
        return null;
    }

    sortTable(header) {
        const table = header.closest('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headerIndex = Array.from(header.parentElement.children).indexOf(header);
        
        // Determine sort direction
        const isAscending = header.getAttribute('data-sort-direction') !== 'asc';
        header.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');
        
        // Sort rows
        rows.sort((a, b) => {
            const aText = a.children[headerIndex]?.textContent.trim() || '';
            const bText = b.children[headerIndex]?.textContent.trim() || '';
            
            // Try numeric comparison first
            const aNum = parseFloat(aText);
            const bNum = parseFloat(bText);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAscending ? aNum - bNum : bNum - aNum;
            }
            
            // Fall back to string comparison
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        
        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
        
        // Update visual indicator
        this.updateSortIndicator(header, isAscending);
    }

    updateSortIndicator(header, isAscending) {
        // Remove existing indicators
        const allHeaders = header.parentElement.querySelectorAll('th');
        allHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
        
        // Add new indicator
        header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    }

    highlightRow(row) {
        row.style.backgroundColor = 'var(--medical-bg-accent)';
        row.style.transform = 'scale(1.01)';
        row.style.transition = 'all 0.2s ease';
    }

    unhighlightRow(row) {
        row.style.backgroundColor = '';
        row.style.transform = '';
    }

    handleCheckboxChange(checkbox) {
        // Add visual feedback for checkbox changes
        const row = checkbox.closest('tr');
        if (row) {
            if (checkbox.checked) {
                row.classList.add('selected-row');
            } else {
                row.classList.remove('selected-row');
            }
        }
    }

    handleSelectChange(select) {
        // Add visual feedback for select changes
        select.style.backgroundColor = 'var(--medical-bg-accent)';
        setTimeout(() => {
            select.style.backgroundColor = '';
        }, 300);
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    new MedicalRecordsEnhancer();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicalRecordsEnhancer;
}

