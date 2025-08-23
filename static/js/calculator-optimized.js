// Optimized Health Dashboard - Performance Focused
class HealthDashboard {
    constructor() {
        this.data = this.loadData();
        this.timerInterval = null;
        this.timerSeconds = 0;
        
        this.checkFirstTime();
        this.init();
    }
    
    checkFirstTime() {
        const isFirstTime = !localStorage.getItem('healthDashboard') || !this.data.profile.setupCompleted;
        if (isFirstTime) {
            document.getElementById('setupModal').style.display = 'flex';
        } else {
            document.getElementById('setupModal').style.display = 'none';
            this.updateWelcomeMessage();
        }
    }
    
    updateWelcomeMessage() {
        if (this.data.profile.name) {
            const subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) {
                subtitle.textContent = `Hey ${this.data.profile.name}! 👋 Track your wellness journey with our simple health tools.`;
            }
        }
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.updateDashboardStats();
        this.initProgressChart();
    }

    // Essential Data Management
    loadData() {
        const defaultData = {
            profile: { name: '', weight: 70, height: 170, age: 25, gender: 'male', activityLevel: 1.375, setupCompleted: false },
            daily: { 
                water: 0, 
                steps: 0, 
                date: new Date().toDateString(),
                waterGoal: 2.5,
                stepsGoal: 10000
            },
            history: [],
            preferences: { darkMode: false, timerInterval: 30 }
        };
        
        const stored = localStorage.getItem('healthDashboard');
        return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
    }

    saveData() {
        localStorage.setItem('healthDashboard', JSON.stringify(this.data));
    }

    // Core Dashboard Functions
    loadDashboard() {
        this.checkNewDay();
        this.updateDashboardStats();
        this.updateProgressBars();
        
        // Ensure light mode by default
        document.body.classList.remove('dark-mode');
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
        
        // Apply dark mode only if explicitly enabled
        if (this.data.preferences.darkMode === true) {
            document.body.classList.add('dark-mode');
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            }
        }
    }

    checkNewDay() {
        const today = new Date().toDateString();
        if (this.data.daily.date !== today) {
            // Save yesterday's data to history
            if (this.data.daily.water > 0 || this.data.daily.steps > 0) {
                this.data.history.push({
                    date: this.data.daily.date,
                    water: this.data.daily.water,
                    steps: this.data.daily.steps
                });
                
                // Keep only last 30 days for performance
                if (this.data.history.length > 30) {
                    this.data.history = this.data.history.slice(-30);
                }
            }
            
            // Reset daily data
            this.data.daily = {
                ...this.data.daily,
                water: 0,
                steps: 0,
                date: today
            };
            
            this.saveData();
        }
    }

    updateDashboardStats() {
        // Update water display
        const dailyWater = document.getElementById('daily-water');
        const waterGoal = document.getElementById('water-goal');
        const waterCurrent = document.getElementById('water-current');
        const waterTarget = document.getElementById('water-target');
        
        if (dailyWater) dailyWater.textContent = `${this.data.daily.water}L`;
        if (waterGoal) waterGoal.textContent = `${this.data.daily.waterGoal}L`;
        if (waterCurrent) waterCurrent.textContent = this.data.daily.water;
        if (waterTarget) waterTarget.textContent = this.data.daily.waterGoal;
        
        // Update steps display
        const dailySteps = document.getElementById('daily-steps');
        const stepsGoal = document.getElementById('steps-goal');
        const stepsCurrent = document.getElementById('steps-current');
        const stepsTarget = document.getElementById('steps-target');
        
        if (dailySteps) dailySteps.textContent = this.data.daily.steps.toLocaleString();
        if (stepsGoal) stepsGoal.textContent = this.data.daily.stepsGoal.toLocaleString();
        if (stepsCurrent) stepsCurrent.textContent = this.data.daily.steps.toLocaleString();
        if (stepsTarget) stepsTarget.textContent = this.data.daily.stepsGoal.toLocaleString();
        
        // Calculate health score (simplified)
        const healthScore = document.getElementById('health-score');
        if (healthScore) {
            const waterProgress = Math.min(100, (this.data.daily.water / this.data.daily.waterGoal) * 100);
            const stepsProgress = Math.min(100, (this.data.daily.steps / this.data.daily.stepsGoal) * 100);
            const score = Math.round((waterProgress + stepsProgress) / 2);
            healthScore.textContent = score;
        }
    }

    updateProgressBars() {
        // Water progress
        const waterProgress = document.getElementById('water-progress');
        if (waterProgress) {
            const percentage = Math.min(100, (this.data.daily.water / this.data.daily.waterGoal) * 100);
            waterProgress.style.width = `${percentage}%`;
        }
        
        // Steps progress
        const stepsProgress = document.getElementById('steps-progress');
        if (stepsProgress) {
            const percentage = Math.min(100, (this.data.daily.steps / this.data.daily.stepsGoal) * 100);
            stepsProgress.style.width = `${percentage}%`;
        }
    }

    setupEventListeners() {
        // Dark mode toggle
        const darkModeBtn = document.getElementById('dark-mode-toggle');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
        
        // Timer interval change
        const timerInterval = document.getElementById('timer-interval');
        if (timerInterval) {
            timerInterval.addEventListener('change', () => {
                this.resetWaterTimer();
            });
        }
    }

    toggleDarkMode() {
        this.data.preferences.darkMode = !this.data.preferences.darkMode;
        document.body.classList.toggle('dark-mode');
        
        const button = document.getElementById('dark-mode-toggle');
        if (button) {
            if (this.data.preferences.darkMode) {
                button.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            } else {
                button.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }
        }
        
        this.saveData();
    }

    // Essential Calculator Functions
    addWater(amount) {
        this.data.daily.water = Math.max(0, this.data.daily.water + amount);
        this.data.daily.water = Math.round(this.data.daily.water * 4) / 4; // Round to 0.25
        this.updateDashboardStats();
        this.updateProgressBars();
        this.updateProgressChart();
        this.saveData();
    }

    addSteps(amount) {
        this.data.daily.steps = Math.max(0, this.data.daily.steps + amount);
        this.updateDashboardStats();
        this.updateProgressBars();
        this.updateProgressChart();
        this.saveData();
    }

    calculateWaterSteps() {
        const weightInput = document.getElementById('weight-input');
        const resultDiv = document.getElementById('water-steps-result');
        
        if (!weightInput || !resultDiv) return;
        
        const weight = parseFloat(weightInput.value);
        if (!weight || weight < 20 || weight > 200) {
            resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a valid weight (20-200 kg)</div>';
            return;
        }
        
        // Calculate water intake (35ml per kg)
        const waterGoal = Math.max(2.0, weight * 0.035);
        const waterRounded = Math.round(waterGoal * 10) / 10;
        
        // Calculate steps goal based on age and weight
        const age = this.data.profile.age || 25;
        let stepsGoal = 10000;
        if (age < 30) stepsGoal = 12000;
        else if (age > 60) stepsGoal = 8000;
        
        // Update user's goals
        this.data.daily.waterGoal = waterRounded;
        this.data.daily.stepsGoal = stepsGoal;
        this.data.profile.weight = weight;
        
        resultDiv.innerHTML = `
            <div class="result-item-calc">
                <strong>💧 Daily Water Goal:</strong> ${waterRounded}L
            </div>
            <div class="result-item-calc">
                <strong>🚶 Daily Steps Goal:</strong> ${stepsGoal.toLocaleString()}
            </div>
            <div class="alert alert-success mt-2">
                Goals updated! Your personalized targets are now active.
            </div>
        `;
        
        this.updateDashboardStats();
        this.updateProgressBars();
        this.saveData();
    }

    calculateBMI() {
        const heightInput = document.getElementById('height-input');
        const weightInput = document.getElementById('bmi-weight-input');
        const resultDiv = document.getElementById('bmi-result');
        
        if (!heightInput || !weightInput || !resultDiv) return;
        
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        
        if (!height || !weight || height < 100 || height > 250 || weight < 20 || weight > 200) {
            resultDiv.innerHTML = '<div class="alert alert-warning">Please enter valid height (100-250 cm) and weight (20-200 kg)</div>';
            return;
        }
        
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        
        let category = '';
        let color = '';
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6';
        } else if (bmi < 25) {
            category = 'Normal weight';
            color = '#10b981';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b';
        } else {
            category = 'Obese';
            color = '#ef4444';
        }
        
        resultDiv.innerHTML = `
            <div class="result-item-calc">
                <strong>BMI:</strong> <span style="color: ${color};">${bmi.toFixed(1)}</span>
            </div>
            <div class="result-item-calc">
                <strong>Category:</strong> <span style="color: ${color};">${category}</span>
            </div>
        `;
    }

    // Simplified Progress Chart
    initProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        const chartData = this.getChartData();
        
        this.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Water (L)',
                        data: chartData.water,
                        borderColor: '#1E90FF',
                        backgroundColor: 'rgba(30, 144, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Steps (k)',
                        data: chartData.steps,
                        borderColor: '#32CD32',
                        backgroundColor: 'rgba(50, 205, 50, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    getChartData() {
        const labels = [];
        const waterData = [];
        const stepsData = [];
        
        // Get last 4 days including today
        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            labels.push(dayName);
            
            if (i === 0) {
                // Today's data
                waterData.push(this.data.daily.water);
                stepsData.push(this.data.daily.steps / 1000);
            } else {
                // Historical data
                const historyEntry = this.data.history.find(entry => entry.date === dateStr);
                if (historyEntry) {
                    waterData.push(historyEntry.water);
                    stepsData.push(historyEntry.steps / 1000);
                } else {
                    waterData.push(0);
                    stepsData.push(0);
                }
            }
        }
        
        return { labels, water: waterData, steps: stepsData };
    }

    updateProgressChart() {
        if (this.progressChart) {
            const chartData = this.getChartData();
            this.progressChart.data.labels = chartData.labels;
            this.progressChart.data.datasets[0].data = chartData.water;
            this.progressChart.data.datasets[1].data = chartData.steps;
            this.progressChart.update();
        }
    }

    // Water Timer Functions
    startWaterTimer() {
        const interval = parseInt(document.getElementById('timer-interval')?.value || 30);
        this.timerSeconds = interval * 60;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();
            
            if (this.timerSeconds <= 0) {
                this.showNotification('💧 Time to drink water!', 'Stay hydrated for better health!');
                this.resetWaterTimer();
            }
        }, 1000);
    }

    pauseWaterTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetWaterTimer() {
        const interval = parseInt(document.getElementById('timer-interval')?.value || 30);
        this.timerSeconds = interval * 60;
        this.updateTimerDisplay();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerText = document.getElementById('timer-text');
        if (timerText) {
            const minutes = Math.floor(this.timerSeconds / 60);
            const seconds = this.timerSeconds % 60;
            timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    }
}

// Setup Flow Functions
window.nextStep = (step) => {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
};

window.prevStep = (step) => {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
};

window.finishSetup = () => {
    const name = document.getElementById('setup-name').value;
    const age = parseInt(document.getElementById('setup-age').value);
    const gender = document.getElementById('setup-gender').value;
    const weight = parseFloat(document.getElementById('setup-weight').value);
    const height = parseFloat(document.getElementById('setup-height').value);
    const activity = parseFloat(document.getElementById('setup-activity').value);
    const goal = document.getElementById('setup-goal').value;
    const wakeup = document.getElementById('setup-wakeup').value;
    const darkMode = document.getElementById('setup-darkmode').checked;
    
    // Validate required fields
    if (!name || !age || !gender || !weight || !height || !activity || !goal) {
        alert('Please fill in all fields to continue!');
        return;
    }
    
    // Save user data
    healthDashboard.data.profile = {
        name, age, gender, weight, height, activityLevel: activity, goal, wakeup
    };
    
    // Set preferences
    healthDashboard.data.preferences.darkMode = darkMode;
    
    // Calculate personalized goals
    const waterGoal = Math.max(2.0, weight * 0.035);
    const stepsGoal = age < 30 ? 12000 : age < 50 ? 10000 : 8000;
    
    healthDashboard.data.daily.waterGoal = parseFloat(waterGoal.toFixed(1));
    healthDashboard.data.daily.stepsGoal = stepsGoal;
    
    // Apply dark mode if selected
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    healthDashboard.saveData();
    healthDashboard.updateWelcomeMessage();
    healthDashboard.updateDashboardStats();
    
    // Hide setup modal
    document.getElementById('setupModal').style.display = 'none';
    
    // Show success message
    setTimeout(() => {
        alert(`Welcome ${name}! 🎉 Your personalized dashboard is ready. Your daily water goal is ${waterGoal.toFixed(1)}L and steps goal is ${stepsGoal.toLocaleString()}!`);
    }, 500);
};

// Global functions for onclick handlers
let healthDashboard;

window.addWater = (amount) => healthDashboard.addWater(amount);
window.addSteps = (amount) => healthDashboard.addSteps(amount);
window.calculateWaterSteps = () => healthDashboard.calculateWaterSteps();
window.calculateBMI = () => healthDashboard.calculateBMI();
window.startWaterTimer = () => healthDashboard.startWaterTimer();
window.pauseWaterTimer = () => healthDashboard.pauseWaterTimer();
window.resetWaterTimer = () => healthDashboard.resetWaterTimer();

// Water goal calculation function for the simplified form
window.calculateWaterGoal = () => {
    // Ensure healthDashboard is initialized
    if (!healthDashboard) {
        console.error('HealthDashboard not initialized');
        alert('App is still loading, please wait a moment and try again.');
        return;
    }
    
    const name = document.getElementById('setup-name').value || 'User';
    const weight = parseFloat(document.getElementById('setup-weight').value);
    const activity = document.getElementById('setup-activity').value;
    const goalPreference = document.querySelector('input[name="goalPreference"]:checked')?.value || 'default';
    
    // Validate required weight field
    if (!weight || weight < 20 || weight > 500) {
        alert('Please enter a valid weight between 20-500 kg 💧');
        return;
    }
    
    // Calculate water goal based on weight and activity level
    let baseWaterGoal = weight * 0.035; // Base 35ml per kg
    
    // Adjust for activity level
    if (activity === 'low') {
        baseWaterGoal *= 0.9; // Reduce by 10% for low activity
    } else if (activity === 'high') {
        baseWaterGoal *= 1.2; // Increase by 20% for high activity
    }
    
    const waterGoal = Math.round(baseWaterGoal * 10) / 10; // Round to 1 decimal
    
    // Save user data with simplified profile
    healthDashboard.data.profile = {
        weight: weight,
        activityLevel: activity,
        goalPreference: goalPreference,
        name: name,
        age: 30, // Default age
        gender: 'user', // Generic
        height: 170, // Default height
        setupCompleted: true // Mark setup as completed
    };
    
    // Set water goal
    healthDashboard.data.daily.waterGoal = waterGoal;
    
    // Set default preferences for better visibility
    healthDashboard.data.preferences.darkMode = false; // Default to light mode
    
    // Save and close modal
    healthDashboard.saveData();
    document.getElementById('setupModal').style.display = 'none';
    
    // Load the dashboard
    healthDashboard.loadDashboard();
    
    // Show custom toast notification with personalized message
    const welcomeMessage = name && name !== 'User' 
        ? `🎉 Perfect ${name}! Your daily water goal is ${waterGoal}L based on your ${weight}kg weight and ${activity} activity level. Start tracking your hydration journey!`
        : `🎉 Perfect! Your daily water goal is ${waterGoal}L based on your ${weight}kg weight and ${activity} activity level. Start tracking your hydration journey!`;
    
    setTimeout(() => {
        showToast(welcomeMessage);
    }, 500);
};

// Custom toast notification function
function showToast(message, duration = 10000) {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-button" onclick="closeApp()">OK</button>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide after duration (longer now since user needs time to click OK)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 350); // Wait for animation to complete
    }, duration);
}

// Function to close the browser tab/window
function closeApp() {
    // Remove the toast first
    const toast = document.querySelector('.toast-notification');
    if (toast) {
        toast.remove();
    }
    
    // Try different methods to close the window
    try {
        window.close(); // Works for popup windows
    } catch (e) {
        // If window.close() doesn't work (main browser tab), try alternative
        try {
            window.open('', '_self', ''); 
            window.close();
        } catch (e2) {
            // If all else fails, show a message
            alert('Please close this browser tab manually.');
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    healthDashboard = new HealthDashboard();
});