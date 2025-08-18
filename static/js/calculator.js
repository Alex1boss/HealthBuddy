// Health Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('weight-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const errorMessage = document.getElementById('error-message');
    const resultsCard = document.getElementById('results-card');
    const waterResult = document.getElementById('water-result');
    const stepsResult = document.getElementById('steps-result');

    // Add event listeners
    calculateBtn.addEventListener('click', calculateHealthGoals);
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateHealthGoals();
        }
    });

    // Input validation - only allow numbers and decimal point
    weightInput.addEventListener('input', function(e) {
        let value = e.target.value;
        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        e.target.value = value;
        
        // Clear error message when user starts typing
        hideError();
    });

    function calculateHealthGoals() {
        const weight = parseFloat(weightInput.value);
        
        // Reset button state
        calculateBtn.classList.remove('loading');
        
        // Validate input
        if (!validateInput(weight)) {
            return;
        }

        // Show loading state
        calculateBtn.classList.add('loading');
        
        // Simulate calculation delay for better UX
        setTimeout(() => {
            // Calculate water intake: weight (kg) × 0.033 liters
            const waterIntake = (weight * 0.033).toFixed(1);
            
            // Fixed steps goal
            const stepsGoal = 10000;
            
            // Update results
            waterResult.textContent = `${waterIntake} liters`;
            stepsResult.textContent = `${stepsGoal.toLocaleString()} steps`;
            
            // Show results with animation
            showResults();
            
            // Remove loading state
            calculateBtn.classList.remove('loading');
            
            // Smooth scroll to results
            setTimeout(() => {
                resultsCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
            
        }, 800);
    }

    function validateInput(weight) {
        hideError();
        
        if (!weight || isNaN(weight)) {
            showError('Please enter a valid weight in kilograms.');
            return false;
        }
        
        if (weight < 20) {
            showError('Weight must be at least 20 kg for accurate calculations.');
            return false;
        }
        
        if (weight > 500) {
            showError('Please enter a realistic weight value.');
            return false;
        }
        
        return true;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        weightInput.classList.add('is-invalid');
    }

    function hideError() {
        errorMessage.classList.remove('show');
        weightInput.classList.remove('is-invalid');
    }

    function showResults() {
        resultsCard.style.display = 'block';
        resultsCard.classList.add('show', 'fade-in-up');
    }

    // Add smooth hover effects for tip cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add floating animation to emoji icons
    const tipIcons = document.querySelectorAll('.tip-icon');
    tipIcons.forEach((icon, index) => {
        // Add a slight delay for each icon
        setTimeout(() => {
            icon.style.animation = `float 3s ease-in-out infinite`;
            icon.style.animationDelay = `${index * 0.5}s`;
        }, 1000);
    });

    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    // Add focus management for accessibility
    weightInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    weightInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });

    // Preload and optimize performance
    window.addEventListener('load', function() {
        // Focus on the weight input for better UX
        weightInput.focus();
        
        // Add entrance animations to elements
        const animatedElements = document.querySelectorAll('.calculator-card, .tip-card');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 100);
        });
    });
});
