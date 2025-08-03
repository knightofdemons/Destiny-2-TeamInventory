/*********************************************************************************/
/* Loading Screen Manager                                                        */
/*********************************************************************************/

class LoadingManager {
    constructor() {
        this.loadingFrame = document.getElementById('loadingFrame');
        this.progressBar = document.getElementById('loadingProgressBar');
        this.loadingText = document.getElementById('loadingText');
        this.currentProgress = 0;
        this.totalSteps = 4; // Reduced from 5 to 4 (removed "ready to launch" step)
        this.currentStep = 0;
        this.lastStateText = '';
        this.isUpdating = false; // Add flag to prevent concurrent updates
        this.isInitialized = false; // Add flag to prevent multiple initializations
        

    }

    // Show loading screen
    show() {
        if (this.isInitialized) {
            return;
        }
        
        this.loadingFrame.classList.remove('closed');
        this.currentProgress = 0;
        this.currentStep = 0;
        this.lastStateText = '';
        this.isUpdating = false;
        this.isInitialized = true;
        this.updateProgress(0);
    }

    // Hide loading screen
    hide() {
        if (this.loadingFrame) {
            this.loadingFrame.classList.add('closed');
        }
    }

    // Update progress bar
    updateProgress(progress) {
        this.currentProgress = progress;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }

    // Update loading text with better duplicate prevention
    updateText(text) {
        if (!this.loadingText) {
            return;
        }
        
        // Only update if text is actually different
        if (text !== this.lastStateText) {
            this.loadingText.textContent = text;
            this.lastStateText = text;
        }
    }

    // Set loading state with improved duplicate prevention
    setState(step) {
        // Prevent concurrent updates
        if (this.isUpdating) {
            return;
        }
        
        // Don't update if it's the same state
        if (this.currentStep === step) {
            return;
        }
        
        this.isUpdating = true;
        
        try {
            this.currentStep = step;
            const progress = (step / this.totalSteps) * 100;
            this.updateProgress(progress);
            
            // Update loading state class
            if (this.loadingFrame) {
                this.loadingFrame.className = `loadingFrame loading-state-${step}`;
            }
            
            // Update text based on state (removed step 5 "ready to launch")
            const stateTexts = {
                1: getText ? getText('initializingDatabase') : "Initializing Database...",
                2: getText ? getText('loadingManifestData') : "Loading Manifest Data...",
                3: getText ? getText('fetchingPlayerData') : "Fetching Player Data...",
                4: getText ? getText('processingInventory') : "Processing Inventory..."
            };
            
            const newText = stateTexts[step] || "Loading...";
            this.updateText(newText);
            
        } finally {
            this.isUpdating = false;
        }
    }

    // Animate progress to a specific percentage
    animateProgress(targetProgress, duration = 1000) {
        return new Promise((resolve) => {
            const startProgress = this.currentProgress;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentProgress = startProgress + (targetProgress - startProgress) * this.easeInOutQuad(progress);
                this.updateProgress(currentProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.currentProgress = targetProgress;
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    // Easing function for smooth animations
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Show error state
    showError(message) {
        this.updateText(getText ? `${getText('error')}: ${message}` : `Error: ${message}`);
        if (this.loadingText) {
            this.loadingText.style.color = '#ff6b6b';
        }
        if (this.progressBar) {
            this.progressBar.style.background = '#ff6b6b';
        }
    }

    // Show success state
    showSuccess() {
        this.updateText(getText ? getText('readyToLaunch') : "Ready to Launch!");
        if (this.loadingText) {
            this.loadingText.style.color = '#51cf66';
        }
        if (this.progressBar) {
            this.progressBar.style.background = '#51cf66';
        }
    }

    // Reset to default state
    reset() {
        if (this.loadingText) {
            this.loadingText.style.color = '#ffffff';
        }
        if (this.progressBar) {
            this.progressBar.style.background = 'linear-gradient(90deg, #ff6b35, #f7931e, #ff6b35)';
        }
        this.currentProgress = 0;
        this.currentStep = 0;
        this.lastStateText = '';
        this.isUpdating = false;
        this.isInitialized = false;
    }
}

// Global loading manager instance - create when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.loadingManager = new LoadingManager();
}); 