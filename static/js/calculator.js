// Daily Water Calculator - Optimized JavaScript

class WaterCalculator {
    constructor() {
        this.form = document.getElementById('waterForm');
        this.resultSection = document.getElementById('resultSection');
        this.quickActions = document.getElementById('quickActions');
        this.waterAmount = document.getElementById('waterAmount');
        this.resultDetails = document.getElementById('resultDetails');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input validation
        const weightInput = document.getElementById('weight');
        const activitySelect = document.getElementById('activity');
        
        weightInput.addEventListener('input', () => this.validateInputs());
        activitySelect.addEventListener('change', () => this.validateInputs());
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const weight = parseFloat(document.getElementById('weight').value);
        const activity = document.getElementById('activity').value;
        
        if (!this.validateForm(weight, activity)) {
            return;
        }
        
        // Ads removed
        
        this.showLoading();
        
        // Show results after ad trigger delay
        setTimeout(() => {
            const result = this.calculateWaterIntake(weight, activity);
            this.showResult(result, weight, activity);
        }, 1000);
    }
    
    
    validateForm(weight, activity) {
        let isValid = true;
        const errors = [];
        
        // Validate weight
        if (!weight || weight < 20 || weight > 300) {
            errors.push('Please enter a valid weight between 20-300 kg');
            isValid = false;
        }
        
        // Validate activity level
        if (!activity) {
            errors.push('Please select your activity level');
            isValid = false;
        }
        
        if (!isValid) {
            this.showError(errors.join('. '));
        }
        
        return isValid;
    }
    
    validateInputs() {
        const weight = parseFloat(document.getElementById('weight').value);
        const activity = document.getElementById('activity').value;
        const submitBtn = document.querySelector('.calculate-btn');
        
        const isValid = weight >= 20 && weight <= 300 && activity;
        
        if (submitBtn) {
            submitBtn.disabled = !isValid;
            submitBtn.style.opacity = isValid ? '1' : '0.6';
        }
    }
    
    calculateWaterIntake(weight, activity) {
        // Base water intake: 35ml per kg of body weight
        let baseIntake = weight * 0.035;
        
        // Adjust for activity level
        const activityMultipliers = {
            'low': 1.0,
            'moderate': 1.1,
            'active': 1.2,
            'very_active': 1.3
        };
        
        const multiplier = activityMultipliers[activity] || 1.0;
        const totalIntake = baseIntake * multiplier;
        
        // Round to nearest 0.1L and ensure minimum of 1.5L
        const roundedIntake = Math.max(1.5, Math.round(totalIntake * 10) / 10);
        
        return {
            amount: roundedIntake,
            glasses: Math.ceil(roundedIntake / 0.25), // Assuming 250ml glasses
            activity: activity,
            weight: weight
        };
    }
    
    showResult(result, weight, activity) {
        const activityLabels = {
            'low': 'low activity',
            'moderate': 'moderate activity',
            'active': 'active lifestyle',
            'very_active': 'very active lifestyle'
        };
        
        // Update result display
        this.waterAmount.textContent = result.amount + 'L';
        this.resultDetails.innerHTML = 
            '<p>Based on your ' + weight + 'kg weight and ' + activityLabels[activity] + '</p>' +
            '<p><strong>That\'s about ' + result.glasses + ' glasses per day</strong></p>';
        
        // Generate personalized tips based on weight
        this.updatePersonalizedTips(weight, activity, result);
        
        // Show result section
        this.resultSection.style.display = 'block';
        this.quickActions.style.display = 'block';
        
        // Smooth scroll to result
        setTimeout(() => {
            this.resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
        
        this.hideLoading();
        
        // Store result for sharing
        this.lastResult = result;
    }
    
    showLoading() {
        const submitBtn = document.querySelector('.calculate-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        }
    }
    
    hideLoading() {
        const submitBtn = document.querySelector('.calculate-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }
    
    showError(message) {
        // Create or update error display
        let errorDiv = document.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 
                'background: #FEE2E2;' +
                'color: #DC2626;' +
                'padding: 1rem;' +
                'border-radius: 0.75rem;' +
                'margin-bottom: 1rem;' +
                'border: 1px solid #FECACA;' +
                'font-weight: 500;' +
                'text-align: center;';
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        
        errorDiv.textContent = '⚠️ ' + message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    reset() {
        this.form.reset();
        this.resultSection.style.display = 'none';
        this.quickActions.style.display = 'none';
        this.validateInputs();
        
        // Scroll to top
        document.querySelector('.header').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    shareResult() {
        if (!this.lastResult) return;
        
        const shareData = {
            title: 'Daily Water Calculator Result',
            text: 'My daily water goal is ' + this.lastResult.amount + 'L! Calculate yours at Daily Water Calculator.',
            url: window.location.href
        };
        
        // Use Web Share API if available
        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareData);
            });
        } else {
            this.fallbackShare(shareData);
        }
    }
    
    fallbackShare(data) {
        // Copy to clipboard
        const textToCopy = data.text + ' ' + data.url;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showToast('📋 Copied to clipboard!');
            }).catch(() => {
                this.showShareModal(textToCopy);
            });
        } else {
            this.showShareModal(textToCopy);
        }
    }
    
    showShareModal(text) {
        // Simple fallback for sharing
        prompt('Copy this text to share:', text);
    }
    
    updatePersonalizedTips(weight, activity, result) {
        const tipsGrid = document.querySelector('.tips-grid');
        if (!tipsGrid) return;
        
        const tips = this.getPersonalizedTips(weight, activity, result);
        
        // Clear existing tips and add personalized ones
        tipsGrid.innerHTML = '';
        tips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip-card';
            tipCard.innerHTML = 
                '<div class="tip-emoji">' + tip.emoji + '</div>' +
                '<div class="tip-text">' + tip.text + '</div>';
            tipsGrid.appendChild(tipCard);
        });
    }
    
    getPersonalizedTips(weight, activity, result) {
        let tips = [];
        
        // Calculate BMI for additional insights
        const bmi = weight / (1.7 * 1.7); // Assuming average height for simplicity
        
        // Weight-based tips
        if (weight < 60) {
            tips.push({
                emoji: '🥤',
                text: 'Keep a small water bottle handy - your lighter body needs consistent small sips'
            });
            tips.push({
                emoji: '⏰',
                text: 'Set reminders every 45 minutes to drink 100-150ml of water'
            });
        } else if (weight >= 60 && weight < 80) {
            tips.push({
                emoji: '💧',
                text: 'Drink a full glass (250ml) every hour during waking hours'
            });
            tips.push({
                emoji: '🍎',
                text: 'Include water-rich fruits like watermelon and oranges in your diet'
            });
        } else if (weight >= 80 && weight < 100) {
            tips.push({
                emoji: '🚰',
                text: 'Start each meal with a large glass of water to support hydration'
            });
            tips.push({
                emoji: '💪',
                text: 'Your larger body needs extra hydration - aim for 300ml glasses'
            });
        } else {
            tips.push({
                emoji: '⚡',
                text: 'Your body needs substantial hydration - drink 400ml every 90 minutes'
            });
            tips.push({
                emoji: '🏃',
                text: 'Pre-hydrate 30 minutes before any physical activity'
            });
        }
        
        // Activity-based tips
        if (activity === 'very_active') {
            tips.push({
                emoji: '🥵',
                text: 'Add an extra 500ml for every hour of intense exercise'
            });
            tips.push({
                emoji: '🧂',
                text: 'Consider electrolyte drinks during long workouts (>60 min)'
            });
        } else if (activity === 'active') {
            tips.push({
                emoji: '🏋️',
                text: 'Drink 200-300ml extra water on workout days'
            });
        } else if (activity === 'low') {
            tips.push({
                emoji: '🛋️',
                text: 'Even with low activity, consistent hydration boosts energy levels'
            });
        }
        
        // Return first 4 tips to fit the grid
        return tips.slice(0, 4);
    }
    
    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = 
            'position: fixed;' +
            'bottom: 2rem;' +
            'left: 50%;' +
            'transform: translateX(-50%);' +
            'background: #10B981;' +
            'color: white;' +
            'padding: 1rem 1.5rem;' +
            'border-radius: 0.75rem;' +
            'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);' +
            'font-weight: 600;' +
            'z-index: 1000;';
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => toast.remove(), 3000);
    }
}

// Global functions for onclick handlers
window.recalculate = function() {
    if (window.waterCalculator) {
        window.waterCalculator.reset();
    }
};

window.shareResult = function() {
    if (window.waterCalculator) {
        window.waterCalculator.shareResult();
    }
};

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.waterCalculator = new WaterCalculator();
});
