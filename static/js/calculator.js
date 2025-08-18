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
            
            // Generate personalized tips
            generatePersonalizedTips(weight, waterIntake);
            
            // Show results with animation
            showResults();
            showPersonalizedTips();
            
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

    function showPersonalizedTips() {
        const tipsCard = document.getElementById('personalized-tips');
        setTimeout(() => {
            tipsCard.style.display = 'block';
            tipsCard.classList.add('show');
        }, 400);
    }

    function generatePersonalizedTips(weight, waterIntake) {
        const tipsContent = document.getElementById('tips-content');
        const tips = [];

        // Calculate BMI category (assuming average height for recommendations)
        const avgHeight = 1.7; // 170cm average
        const bmi = weight / (avgHeight * avgHeight);
        
        // Water intake tips
        if (parseFloat(waterIntake) < 2.0) {
            tips.push({
                icon: 'fas fa-tint',
                title: 'Hydration Boost Needed',
                content: `At ${weight}kg, you need <span class="highlight-number">${waterIntake}L</span> daily. Try drinking a glass every hour to stay hydrated.`
            });
        } else if (parseFloat(waterIntake) > 3.0) {
            tips.push({
                icon: 'fas fa-tint',
                title: 'Stay Consistently Hydrated',
                content: `Your <span class="highlight-number">${waterIntake}L</span> daily goal is substantial. Spread it throughout the day and drink before you feel thirsty.`
            });
        } else {
            tips.push({
                icon: 'fas fa-tint',
                title: 'Perfect Hydration Goal',
                content: `Your <span class="highlight-number">${waterIntake}L</span> daily water goal is ideal for your weight. Track your intake with a water bottle.`
            });
        }

        // Weight-based activity tips
        if (weight < 60) {
            tips.push({
                icon: 'fas fa-running',
                title: 'Light & Agile Approach',
                content: 'Your lighter frame is great for endurance activities. Consider yoga, pilates, or light jogging for optimal fitness.'
            });
        } else if (weight > 90) {
            tips.push({
                icon: 'fas fa-walking',
                title: 'Build Up Gradually',
                content: 'Start with 30-minute walks and gradually increase intensity. Swimming and cycling are excellent low-impact options.'
            });
        } else {
            tips.push({
                icon: 'fas fa-heartbeat',
                title: 'Balanced Fitness Plan',
                content: 'Your weight supports a variety of activities. Mix cardio, strength training, and flexibility exercises for best results.'
            });
        }

        // Daily routine tips based on water intake
        const glassesPerDay = Math.round(parseFloat(waterIntake) * 4); // Assuming 250ml glasses
        tips.push({
            icon: 'fas fa-clock',
            title: 'Daily Hydration Schedule',
            content: `Drink <span class="highlight-number">${glassesPerDay} glasses</span> throughout the day. Start with 2 glasses upon waking, then 1 glass every 2 hours.`
        });

        // Health monitoring tip
        if (bmi < 18.5) {
            tips.push({
                icon: 'fas fa-user-md',
                title: 'Health Monitoring',
                content: 'Your BMI suggests you may be underweight. Focus on nutrient-dense foods and consult a healthcare provider for personalized advice.'
            });
        } else if (bmi > 30) {
            tips.push({
                icon: 'fas fa-user-md',
                title: 'Health Focus',
                content: 'Consider consulting a healthcare provider for a personalized weight management plan. Small, consistent changes yield the best results.'
            });
        } else {
            tips.push({
                icon: 'fas fa-check-circle',
                title: 'Healthy Range',
                content: 'Your weight appears to be in a healthy range. Maintain your current habits and stay active for continued wellness.'
            });
        }

        // Generate HTML for tips
        tipsContent.innerHTML = tips.map(tip => `
            <div class="tip-item">
                <h6><i class="${tip.icon}"></i>${tip.title}</h6>
                <p>${tip.content}</p>
            </div>
        `).join('');
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
