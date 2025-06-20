// ResolvIQ Frontend JavaScript

class ResolvIQ {
    constructor() {
        this.initializeEventListeners();
        this.autoSaveInterval = null;
        this.setupAutoSave();
    }

    initializeEventListeners() {
        // Issue form handling
        const issueForm = document.getElementById('issue-form');
        if (issueForm) {
            issueForm.addEventListener('change', () => this.saveIssueInfo());
        }

        // Step form handling
        const stepForm = document.getElementById('step-form');
        if (stepForm) {
            stepForm.addEventListener('submit', (e) => this.handleStepSubmit(e));
        }

        // Resolution form handling
        const resolutionForm = document.getElementById('resolution-form');
        if (resolutionForm) {
            resolutionForm.addEventListener('change', () => this.saveResolution());
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // RCA completion button
        const completeRcaBtn = document.getElementById('complete-rca-btn');
        if (completeRcaBtn) {
            completeRcaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.completeRCA();
            });
        }

        // Initialize dark mode from localStorage
        this.initializeDarkMode();
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveIssueInfo();
            this.saveResolution();
        }, 30000);
    }

    async saveIssueInfo() {
        const form = document.getElementById('issue-form');
        if (!form) return;

        const formData = new FormData(form);
        
        try {
            const response = await fetch('/update_issue', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (!result.success) {
                console.error('Failed to save issue info:', result.error);
            }
        } catch (error) {
            console.error('Error saving issue info:', error);
        }
    }

    async handleStepSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Check if command or output is provided
        const command = formData.get('command').trim();
        const output = formData.get('output').trim();
        
        if (!command && !output) {
            this.showError('Please provide either a command or output before adding the step.');
            return;
        }

        this.setLoading(form, true);
        
        try {
            const response = await fetch('/add_step', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Clear the form
                form.reset();
                
                // Reload the page to show the new step
                window.location.reload();
            } else {
                this.showError(result.error || 'Failed to add step');
            }
        } catch (error) {
            console.error('Error adding step:', error);
            this.showError('Network error occurred');
        } finally {
            this.setLoading(form, false);
        }
    }

    async saveResolution() {
        const form = document.getElementById('resolution-form');
        if (!form) return;

        const formData = new FormData(form);
        
        try {
            const response = await fetch('/update_resolution', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (!result.success) {
                console.error('Failed to save resolution:', result.error);
            }
        } catch (error) {
            console.error('Error saving resolution:', error);
        }
    }

    setLoading(element, loading) {
        if (loading) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    }

    showError(message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 fade-in';
        errorDiv.innerHTML = `
            <span class="block sm:inline">${message}</span>
            <button onclick="this.parentElement.remove()" class="float-right font-bold text-xl">&times;</button>
        `;
        
        // Insert at the top of the main container
        const container = document.querySelector('.max-w-4xl');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        }
    }

    showSuccess(message) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 fade-in';
        successDiv.innerHTML = `
            <span class="block sm:inline">${message}</span>
            <button onclick="this.parentElement.remove()" class="float-right font-bold text-xl">&times;</button>
        `;
        
        // Insert at the top of the main container
        const container = document.querySelector('.max-w-4xl');
        if (container) {
            container.insertBefore(successDiv, container.firstChild);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 3000);
        }
    }

    initializeDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        const html = document.documentElement;
        
        if (isDarkMode) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }

    toggleDarkMode() {
        const html = document.documentElement;
        const isDarkMode = html.classList.contains('dark');
        
        if (isDarkMode) {
            html.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        } else {
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        }
    }

    async completeRCA() {
        // First, save the current resolution data
        await this.saveResolution();
        
        // Check if resolution fields are filled
        const form = document.getElementById('resolution-form');
        if (!form) {
            this.showError('Resolution form not found');
            return;
        }

        const formData = new FormData(form);
        const rootCause = (formData.get('root_cause') || '').trim();
        const solution = (formData.get('solution') || '').trim();
        
        if (!rootCause || !solution) {
            this.showError('Please fill out at least the Root Cause and Solution Applied fields before completing the RCA.');
            return;
        }

        try {
            const response = await fetch('/complete_rca', {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('RCA completed successfully! Generating downloadable report...');
                
                // Trigger download
                if (result.download_url) {
                    window.location.href = result.download_url;
                }
            } else {
                this.showError(result.error || 'Failed to complete RCA');
            }
        } catch (error) {
            console.error('Error completing RCA:', error);
            this.showError('Network error occurred while completing RCA');
        }
    }
}

// Global functions for template use
async function removeStep(stepId) {
    if (!confirm('Are you sure you want to remove this step?')) {
        return;
    }
    
    try {
        const response = await fetch(`/remove_step/${stepId}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Find and remove the step element with animation
            const stepElement = document.querySelector(`[data-step-id="${stepId}"]`);
            if (stepElement) {
                stepElement.classList.add('step-removed');
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        } else {
            app.showError('Failed to remove step');
        }
    } catch (error) {
        console.error('Error removing step:', error);
        app.showError('Network error occurred');
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ResolvIQ();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app && app.autoSaveInterval) {
        clearInterval(app.autoSaveInterval);
    }
});