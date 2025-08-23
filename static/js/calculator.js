// Comprehensive Health Dashboard JavaScript
class HealthDashboard {
    constructor() {
        this.data = this.loadData();
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.achievements = [];
        
        this.checkFirstTime();
        this.init();
    }
    
    checkFirstTime() {
        const isFirstTime = !localStorage.getItem('healthDashboard') || !this.data.profile.name;
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
                subtitle.textContent = `Hey ${this.data.profile.name}! 👋 Track your wellness journey with calculators, progress charts, and tips that actually work.`;
            }
        }
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.loadAchievements();
        this.generateTips();
        this.requestNotificationPermission();
        this.updateDashboardStats();
        this.startOfDayCheck();
        this.initProgressChart();
    }

    // Data Management
    loadData() {
        const defaultData = {
            profile: { weight: 70, height: 170, age: 25, gender: 'male', activityLevel: 1.375 },
            daily: { 
                water: 0, 
                steps: 0, 
                sleepRating: 0, 
                calories: 0,
                date: new Date().toDateString(),
                waterGoal: 2.5,
                stepsGoal: 10000
            },
            history: [],
            challenges: {
                steps: { active: false, progress: 0, target: 7, startDate: null },
                water: { active: false, progress: 0, target: 30, startDate: null },
                sleep: { active: false, progress: 0, target: 14, startDate: null }
            },
            achievements: [],
            preferences: { darkMode: false, timerInterval: 30, notifications: false }
        };
        
        const stored = localStorage.getItem('healthDashboard');
        return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
    }

    saveData() {
        localStorage.setItem('healthDashboard', JSON.stringify(this.data));
    }

    // Dashboard Functions
    loadDashboard() {
        this.checkNewDay();
        this.updateDashboardStats();
        this.updateProgressBars();
        this.generatePersonalizedTips();
        this.updateChallengeProgress();
        
        // Ensure light mode by default for new users
        document.body.classList.remove('dark-mode');
        document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        
        // Apply dark mode only if explicitly enabled
        if (this.data.preferences.darkMode === true) {
            document.body.classList.add('dark-mode');
            document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }

    checkNewDay() {
        const today = new Date().toDateString();
        if (this.data.daily.date !== today) {
            // Save yesterday's data to history
            this.data.history.push({
                date: this.data.daily.date,
                water: this.data.daily.water,
                steps: this.data.daily.steps,
                sleepRating: this.data.daily.sleepRating,
                waterGoal: this.data.daily.waterGoal,
                stepsGoal: this.data.daily.stepsGoal
            });

            // Reset daily stats
            this.data.daily = {
                water: 0,
                steps: 0,
                sleepRating: 0,
                calories: 0,
                date: today,
                waterGoal: this.data.daily.waterGoal,
                stepsGoal: this.data.daily.stepsGoal
            };
            
            this.updateChallengeProgress();
            this.saveData();
        }
    }

    startOfDayCheck() {
        // Check if it's a new day every minute
        setInterval(() => {
            this.checkNewDay();
        }, 60000);
    }

    updateDashboardStats() {
        document.getElementById('daily-water').textContent = `${this.data.daily.water.toFixed(1)}L`;
        document.getElementById('daily-steps').textContent = this.data.daily.steps.toLocaleString();
        document.getElementById('water-goal').textContent = `${this.data.daily.waterGoal}L`;
        document.getElementById('steps-goal').textContent = this.data.daily.stepsGoal.toLocaleString();
        
        // Calculate health score
        const waterScore = Math.min((this.data.daily.water / this.data.daily.waterGoal) * 50, 50);
        const stepsScore = Math.min((this.data.daily.steps / this.data.daily.stepsGoal) * 50, 50);
        const healthScore = Math.round(waterScore + stepsScore);
        document.getElementById('health-score').textContent = healthScore;
        
        // Calculate streak
        const streak = this.calculateStreak();
        document.getElementById('streak-count').textContent = streak;
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date().toDateString();
        
        // Check today first
        if (this.data.daily.water >= this.data.daily.waterGoal && 
            this.data.daily.steps >= this.data.daily.stepsGoal) {
            streak = 1;
        } else {
            return 0;
        }

        // Check history backwards
        for (let i = this.data.history.length - 1; i >= 0; i--) {
            const day = this.data.history[i];
            if (day.water >= day.waterGoal && day.steps >= day.stepsGoal) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    // Calculator Functions
    calculateWaterSteps() {
        const weight = parseFloat(document.getElementById('weight-input').value);
        if (!weight || weight < 20 || weight > 500) {
            alert('Hmm, that weight seems a bit off. Mind double-checking? Should be between 20-500 kg 🤔');
            return;
        }

        this.data.profile.weight = weight;
        
        const waterIntake = (weight * 0.033).toFixed(1);
        const stepsGoal = 10000;
        
        this.data.daily.waterGoal = parseFloat(waterIntake);
        this.data.daily.stepsGoal = stepsGoal;
        
        document.getElementById('water-steps-result').innerHTML = `
            <div class="result-item-calc">
                <i class="fas fa-tint text-primary"></i>
                <span>Daily Water: <strong>${waterIntake}L</strong></span>
            </div>
            <div class="result-item-calc">
                <i class="fas fa-walking text-success"></i>
                <span>Daily Steps: <strong>${stepsGoal.toLocaleString()}</strong></span>
            </div>
        `;
        
        this.saveData();
        this.updateDashboardStats();
    }

    calculateBMI() {
        const height = parseFloat(document.getElementById('height-input').value);
        const weight = parseFloat(document.getElementById('bmi-weight-input').value);
        
        if (!height || !weight || height < 100 || height > 250 || weight < 20 || weight > 500) {
            alert('Please enter valid height (100-250 cm) and weight (20-500 kg)');
            return;
        }

        this.data.profile.height = height;
        this.data.profile.weight = weight;
        
        const heightInM = height / 100;
        const bmi = (weight / (heightInM * heightInM)).toFixed(1);
        
        let category, color;
        if (bmi < 18.5) {
            category = 'Underweight';
            color = 'text-info';
        } else if (bmi < 25) {
            category = 'Normal weight';
            color = 'text-success';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = 'text-warning';
        } else {
            category = 'Obese';
            color = 'text-danger';
        }
        
        document.getElementById('bmi-result').innerHTML = `
            <div class="bmi-result">
                <h5>Your BMI: <span class="${color}">${bmi}</span></h5>
                <p>Category: <span class="${color}">${category}</span></p>
            </div>
        `;
        
        this.saveData();
    }

    calculateCalories() {
        const age = parseInt(document.getElementById('age-input').value);
        const gender = document.getElementById('gender-input').value;
        const activity = parseFloat(document.getElementById('activity-input').value);
        const weight = this.data.profile.weight;
        const height = this.data.profile.height;
        
        if (!age || !weight || !height || age < 16 || age > 100) {
            alert('Please enter valid age (16-100) and ensure weight/height are set in other calculators');
            return;
        }

        this.data.profile.age = age;
        this.data.profile.gender = gender;
        this.data.profile.activityLevel = activity;
        
        // Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        const tdee = Math.round(bmr * activity);
        
        document.getElementById('calorie-result').innerHTML = `
            <div class="calorie-result">
                <h5>Daily Calories</h5>
                <p><strong>Maintenance:</strong> ${tdee} calories</p>
                <p><strong>Weight Loss:</strong> ${tdee - 500} calories</p>
                <p><strong>Weight Gain:</strong> ${tdee + 500} calories</p>
            </div>
        `;
        
        this.saveData();
    }

    calculateSleep() {
        const age = parseInt(document.getElementById('sleep-age-input').value);
        const wakeupTime = document.getElementById('wakeup-input').value;
        
        if (!age || !wakeupTime || age < 16 || age > 100) {
            alert('Please enter valid age (16-100) and wake up time');
            return;
        }

        let recommendedHours;
        if (age >= 18 && age <= 64) {
            recommendedHours = '7-9';
        } else if (age >= 65) {
            recommendedHours = '7-8';
        } else {
            recommendedHours = '8-10';
        }
        
        // Calculate bedtimes
        const wakeup = new Date(`2024-01-01 ${wakeupTime}`);
        const bedtime7 = new Date(wakeup.getTime() - 7 * 60 * 60 * 1000);
        const bedtime8 = new Date(wakeup.getTime() - 8 * 60 * 60 * 1000);
        const bedtime9 = new Date(wakeup.getTime() - 9 * 60 * 60 * 1000);
        
        document.getElementById('sleep-result').innerHTML = `
            <div class="sleep-result">
                <h5>Recommended Sleep: ${recommendedHours} hours</h5>
                <p><strong>For 7 hours:</strong> Sleep by ${bedtime7.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><strong>For 8 hours:</strong> Sleep by ${bedtime8.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><strong>For 9 hours:</strong> Sleep by ${bedtime9.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
        `;
    }

    // Tracking Functions
    addWater(amount) {
        this.data.daily.water = Math.max(0, this.data.daily.water + amount);
        this.data.daily.water = Math.round(this.data.daily.water * 10) / 10; // Round to 1 decimal
        this.saveData();
        this.updateDashboardStats();
        this.updateProgressBars();
        this.updateProgressChart();
        this.checkAchievements();
    }

    addSteps(amount) {
        this.data.daily.steps = Math.max(0, this.data.daily.steps + amount);
        this.saveData();
        this.updateDashboardStats();
        this.updateProgressBars();
        this.updateProgressChart();
        this.checkAchievements();
    }

    updateProgressBars() {
        // Water progress
        const waterPercent = Math.min((this.data.daily.water / this.data.daily.waterGoal) * 100, 100);
        document.getElementById('water-progress').style.width = waterPercent + '%';
        document.getElementById('water-current').textContent = this.data.daily.water.toFixed(1);
        document.getElementById('water-target').textContent = this.data.daily.waterGoal;
        
        // Steps progress
        const stepsPercent = Math.min((this.data.daily.steps / this.data.daily.stepsGoal) * 100, 100);
        document.getElementById('steps-progress').style.width = stepsPercent + '%';
        document.getElementById('steps-current').textContent = this.data.daily.steps.toLocaleString();
        document.getElementById('steps-target').textContent = this.data.daily.stepsGoal.toLocaleString();
    }

    // Timer Functions
    startWaterTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const intervalMinutes = parseInt(document.getElementById('timer-interval').value);
        this.timerSeconds = intervalMinutes * 60;
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();
            
            if (this.timerSeconds <= 0) {
                this.timerComplete();
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
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        const intervalMinutes = parseInt(document.getElementById('timer-interval').value);
        this.timerSeconds = intervalMinutes * 60;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        document.getElementById('timer-text').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    timerComplete() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        
        // Get a random fun water reminder
        const waterReminders = [
            'Your body is sending thirsty signals! 💧',
            'Time for a water break! Your cells will thank you 😊',
            'Hydration station time! Chug chug chug! 🚂💧',
            'Your plants aren\'t the only thing that needs water 🌱',
            'Quick water break! Your future self will high-five you 🙌',
            'Drink up! Your kidneys are doing a happy dance 💃',
            'Water time! Because you\'re not a cactus 🌵😄',
            'Glug glug time! Stay awesome and hydrated! ✨'
        ];
        
        const randomReminder = waterReminders[Math.floor(Math.random() * waterReminders.length)];
        
        // Show notification
        this.showNotification('💧 Friendly Reminder!', randomReminder);
        
        // Reset timer
        this.resetWaterTimer();
    }

    // Challenge Functions
    joinChallenge(type) {
        this.data.challenges[type] = {
            active: true,
            progress: 0,
            target: this.data.challenges[type].target,
            startDate: new Date().toDateString()
        };
        
        this.saveData();
        this.updateChallengeProgress();
        alert(`🎯 Challenge accepted! Let's do this ${type} thing together! You got this! 💪`);
    }

    updateChallengeProgress() {
        // Steps challenge
        if (this.data.challenges.steps.active) {
            const progress = this.calculateChallengeProgress('steps');
            this.data.challenges.steps.progress = progress;
            document.getElementById('step-challenge-progress').style.width = 
                `${(progress / this.data.challenges.steps.target) * 100}%`;
            document.getElementById('step-challenge-day').textContent = progress;
        }
        
        // Water challenge
        if (this.data.challenges.water.active) {
            const progress = this.calculateChallengeProgress('water');
            this.data.challenges.water.progress = progress;
            document.getElementById('water-challenge-progress').style.width = 
                `${(progress / this.data.challenges.water.target) * 100}%`;
            document.getElementById('water-challenge-day').textContent = progress;
        }
        
        // Sleep challenge
        if (this.data.challenges.sleep.active) {
            const progress = this.calculateChallengeProgress('sleep');
            this.data.challenges.sleep.progress = progress;
            document.getElementById('sleep-challenge-progress').style.width = 
                `${(progress / this.data.challenges.sleep.target) * 100}%`;
            document.getElementById('sleep-challenge-day').textContent = progress;
        }
    }

    calculateChallengeProgress(type) {
        const challenge = this.data.challenges[type];
        if (!challenge.active) return 0;
        
        const startDate = new Date(challenge.startDate);
        const today = new Date();
        const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        
        let consecutiveDays = 0;
        
        // Check today
        let todaySuccess = false;
        if (type === 'steps') {
            todaySuccess = this.data.daily.steps >= this.data.daily.stepsGoal;
        } else if (type === 'water') {
            todaySuccess = this.data.daily.water >= this.data.daily.waterGoal;
        } else if (type === 'sleep') {
            todaySuccess = this.data.daily.sleepRating >= 3;
        }
        
        if (todaySuccess) consecutiveDays = 1;
        
        // Check history
        for (let i = this.data.history.length - 1; i >= 0 && consecutiveDays < challenge.target; i--) {
            const day = this.data.history[i];
            const dayDate = new Date(day.date);
            
            if (dayDate < startDate) break;
            
            let daySuccess = false;
            if (type === 'steps') {
                daySuccess = day.steps >= day.stepsGoal;
            } else if (type === 'water') {
                daySuccess = day.water >= day.waterGoal;
            } else if (type === 'sleep') {
                daySuccess = day.sleepRating >= 3;
            }
            
            if (daySuccess) {
                consecutiveDays++;
            } else {
                break;
            }
        }
        
        return Math.min(consecutiveDays, challenge.target);
    }

    // Tips and Content Functions
    generatePersonalizedTips() {
        const tips = [];
        const weight = this.data.profile.weight;
        const waterGoal = this.data.daily.waterGoal;
        const stepsGoal = this.data.daily.stepsGoal;
        
        // Water tips
        if (this.data.daily.water < waterGoal * 0.5) {
            tips.push({
                icon: 'fas fa-tint',
                title: 'Yo, you need more water! 💧',
                content: `Dude, you're only at ${((this.data.daily.water / waterGoal) * 100).toFixed(0)}% of your goal. Your body is probably sending you thirsty signals right now!`
            });
        }
        
        // Steps tips
        if (this.data.daily.steps < stepsGoal * 0.5) {
            tips.push({
                icon: 'fas fa-walking',
                title: 'Time to move that body! 🏃‍♂️',
                content: 'Your legs are probably getting restless. Maybe dance to your favorite song, take a quick walk, or do some silly jumping jacks?'
            });
        }
        
        // BMI-based tips
        if (this.data.profile.height) {
            const bmi = this.data.profile.weight / Math.pow(this.data.profile.height / 100, 2);
            if (bmi > 25) {
                tips.push({
                    icon: 'fas fa-apple-alt',
                    title: 'Healthy Weight',
                    content: 'Focus on whole foods, portion control, and regular exercise for sustainable weight management.'
                });
            }
        }
        
        this.displayTips(tips, 'personalized-tips-content');
        this.generateSeasonalTips();
    }

    generateSeasonalTips() {
        const month = new Date().getMonth();
        const season = this.getSeason(month);
        const tips = this.getSeasonalTips(season);
        
        this.displayTips(tips, 'seasonal-tips-content');
    }

    getSeason(month) {
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    }

    getSeasonalTips(season) {
        const seasonalTips = {
            spring: [
                { icon: 'fas fa-seedling', title: 'Spring Renewal', content: 'Perfect time to start new healthy habits. Try outdoor activities like hiking or cycling.' },
                { icon: 'fas fa-leaf', title: 'Seasonal Allergies', content: 'Stay hydrated to help your body cope with allergens. Consider indoor workouts on high pollen days.' }
            ],
            summer: [
                { icon: 'fas fa-sun', title: 'Summer Hydration', content: 'Increase water intake during hot weather. Add 500ml-1L extra on very hot days.' },
                { icon: 'fas fa-swimmer', title: 'Beat the Heat', content: 'Try swimming, early morning walks, or indoor activities during peak heat hours.' }
            ],
            fall: [
                { icon: 'fas fa-apple-alt', title: 'Autumn Harvest', content: 'Take advantage of seasonal fruits and vegetables for nutrition and immunity.' },
                { icon: 'fas fa-wind', title: 'Prepare for Winter', content: 'Maintain your exercise routine as daylight decreases. Consider vitamin D supplementation.' }
            ],
            winter: [
                { icon: 'fas fa-snowflake', title: 'Winter Wellness', content: 'Stay active indoors with yoga, bodyweight exercises, or dancing to maintain fitness.' },
                { icon: 'fas fa-mug-hot', title: 'Warm Hydration', content: 'Count herbal teas and warm water towards your daily fluid intake.' }
            ]
        };
        
        return seasonalTips[season] || [];
    }

    displayTips(tips, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = tips.map(tip => `
            <div class="tip-item">
                <h6><i class="${tip.icon}"></i> ${tip.title}</h6>
                <p>${tip.content}</p>
            </div>
        `).join('');
    }

    getNewDailyTip() {
        const tips = [
            "Start your day with a big glass of water - your body just went 8 hours without it! 💧",
            "Stairs are free mini-workouts hiding everywhere. Your future self will thank you! 🏃‍♀️",
            "Set a silly timer name like 'STRETCH TIME HUMAN' - it actually works better 😄",
            "Eat like you're painting with food - the more colors, the prettier (and healthier) your plate! 🎨",
            "5 minutes of deep breathing = instant zen mode. Works better than scrolling social media 🧘‍♂️",
            "Phone calls + walking = secret productivity hack. You'll solve problems faster too! 📞👟",
            "Hide the cookies, display the apples. Your brain falls for this trick every time 🍎",
            "Sleep is when your body does its magic repair work. Don't skip the magic! ✨",
            "Commercial breaks = mini workout time. Your couch won't judge your weird exercises 💪",
            "Water bottle = best friend. Name it if you want - mine's called 'Hydro Helper' 🤝",
            "Post-meal walks help your food digest and give you thinking time. Win-win! 🚶‍♂️",
            "Gratitude is like vitamins for your brain. Take daily doses 🙏",
            "Blue light before bed confuses your brain into thinking it's daytime. Not cool, phone! 📱",
            "Whole grains = steady energy. Refined grains = energy rollercoaster 🎢",
            "Your body whispers before it screams. Listen to the whispers 👂",
            "Dance like nobody's watching, especially when nobody actually is! 💃",
            "If you're reading this, you're already caring about your health. That's awesome! 🌟",
            "Small progress is still progress. Celebrate the tiny wins! 🎉"
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('daily-tip-text').innerHTML = randomTip;
    }

    // Weather-based tips (requires geolocation)
    async getWeatherTips() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                // Note: In a real app, you'd use a weather API
                // For demo purposes, we'll simulate weather-based tips
                const tips = this.generateWeatherTips('sunny'); // Simulated weather
                
                document.getElementById('weather-tips-content').innerHTML = `
                    <div class="weather-tips">
                        <h6>📍 Weather-Based Tips</h6>
                        ${tips.map(tip => `<p><i class="${tip.icon}"></i> ${tip.text}</p>`).join('')}
                    </div>
                `;
            } catch (error) {
                console.error('Weather API error:', error);
                document.getElementById('weather-tips-content').innerHTML = `
                    <p>Unable to fetch weather data. Stay hydrated and active regardless of the weather!</p>
                `;
            }
        }, (error) => {
            alert('Unable to get your location for weather tips.');
        });
    }

    generateWeatherTips(weather) {
        const weatherTips = {
            sunny: [
                { icon: 'fas fa-sun', text: 'Sunny day! Perfect for outdoor activities. Remember extra hydration.' },
                { icon: 'fas fa-tint', text: 'Increase water intake by 25% on hot, sunny days.' }
            ],
            rainy: [
                { icon: 'fas fa-cloud-rain', text: 'Rainy day? Try indoor workouts or mall walking.' },
                { icon: 'fas fa-home', text: 'Perfect weather for yoga, bodyweight exercises, or dancing.' }
            ],
            cold: [
                { icon: 'fas fa-thermometer-half', text: 'Cold weather? Layer up for outdoor activities.' },
                { icon: 'fas fa-fire', text: 'Your body burns more calories in cold weather - fuel appropriately.' }
            ]
        };
        
        return weatherTips[weather] || weatherTips.sunny;
    }

    // Achievement System
    loadAchievements() {
        const achievementDefs = [
            { id: 'first_day', name: 'Getting Started', description: 'Complete your first day', icon: '🌟' },
            { id: 'water_week', name: 'Hydration Hero', description: '7 days of meeting water goals', icon: '💧' },
            { id: 'steps_week', name: 'Step Master', description: '7 days of meeting step goals', icon: '🚶' },
            { id: 'streak_10', name: 'Consistency King', description: '10-day streak', icon: '🔥' },
            { id: 'water_challenge', name: 'Aqua Champion', description: 'Complete 30-day water challenge', icon: '🏆' },
            { id: 'steps_challenge', name: 'Walking Warrior', description: 'Complete 7-day step challenge', icon: '⚡' }
        ];
        
        const container = document.getElementById('achievements-list');
        if (!container) return;
        
        container.innerHTML = achievementDefs.map(achievement => {
            const unlocked = this.data.achievements.includes(achievement.id);
            return `
                <div class="achievement-badge ${unlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <h6>${achievement.name}</h6>
                    <p>${achievement.description}</p>
                </div>
            `;
        }).join('');
    }

    checkAchievements() {
        const newAchievements = [];
        
        // First day achievement
        if (!this.data.achievements.includes('first_day') && 
            (this.data.daily.water > 0 || this.data.daily.steps > 0)) {
            newAchievements.push('first_day');
        }
        
        // Streak achievements
        const streak = this.calculateStreak();
        if (streak >= 10 && !this.data.achievements.includes('streak_10')) {
            newAchievements.push('streak_10');
        }
        
        // Challenge completion achievements
        Object.keys(this.data.challenges).forEach(type => {
            const challenge = this.data.challenges[type];
            const achievementId = `${type}_challenge`;
            
            if (challenge.active && 
                challenge.progress >= challenge.target && 
                !this.data.achievements.includes(achievementId)) {
                newAchievements.push(achievementId);
            }
        });
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            this.data.achievements.push(achievement);
            this.showAchievementNotification(achievement);
        });
        
        if (newAchievements.length > 0) {
            this.saveData();
            this.loadAchievements();
        }
    }

    showAchievementNotification(achievementId) {
        const achievementNames = {
            'first_day': 'Getting Started',
            'water_week': 'Hydration Hero',
            'steps_week': 'Step Master',
            'streak_10': 'Consistency King',
            'water_challenge': 'Aqua Champion',
            'steps_challenge': 'Walking Warrior'
        };
        
        this.showInAppNotification('🏆 Woohoo!', (achievementNames[achievementId] || 'You just crushed a goal') + '! You\'re absolutely killing it! 🎉');
    }

    // Utility Functions
    setupEventListeners() {
        // Dark mode toggle
        document.getElementById('dark-mode-toggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Sleep rating stars
        document.querySelectorAll('.sleep-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.setSleepRating(rating);
            });
        });
        
        // Timer interval change
        document.getElementById('timer-interval').addEventListener('change', () => {
            this.resetWaterTimer();
        });
    }

    toggleDarkMode() {
        this.data.preferences.darkMode = !this.data.preferences.darkMode;
        document.body.classList.toggle('dark-mode');
        
        const button = document.getElementById('dark-mode-toggle');
        if (this.data.preferences.darkMode) {
            button.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            button.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
        
        this.saveData();
    }

    setSleepRating(rating) {
        this.data.daily.sleepRating = rating;
        
        // Update visual feedback
        document.querySelectorAll('.sleep-star').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        this.saveData();
        this.checkAchievements();
    }

    shareProgress() {
        const text = `🏃‍♂️ Today's Progress:\n💧 Water: ${this.data.daily.water}L / ${this.data.daily.waterGoal}L\n👟 Steps: ${this.data.daily.steps.toLocaleString()} / ${this.data.daily.stepsGoal.toLocaleString()}\n❤️ Health Score: ${document.getElementById('health-score').textContent}/100\n\n#HealthyLiving #DailyHealthBuddy`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Health Progress',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('Progress copied to clipboard! Share it on your social media.');
            });
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            // Ask nicely first
            const userWants = confirm('Hey! 👋 Want me to send you friendly reminders to drink water and stay healthy? I promise not to spam you!');
            if (userWants) {
                Notification.requestPermission().then(permission => {
                    this.data.preferences.notifications = permission === 'granted';
                    this.saveData();
                    if (permission === 'granted') {
                        this.showNotification('🎉 Awesome!', 'You\'ll get gentle reminders to stay hydrated. You can always turn these off later!');
                    }
                });
            }
        }
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted' && this.data.preferences.notifications) {
            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxRTkwRkYiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzEzLjEgMiAxNCAyLjkgMTQgNFYxMkMxNCAxMy4xIDEzLjEgMTQgMTIgMTRDMTAuOSAxNCAxMCAxMy4xIDEwIDEyVjRDMTAgMi45IDEwLjkgMiAxMiAyWk0yMSA5VjdIMTlWOUgxN1YxMUgxOVYxM0gyMVYxMUgyM1Y5SDIxWk03IDlWN0g1VjlIM1YxMUg1VjEzSDdWMTFIOVY5SDdaIi8+Cjwvc3ZnPgo8L3N2Zz4K',
                badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzMkNEMzIiLz4KPC9zdmc+',
                requireInteraction: false,
                silent: false
            });
            
            // Auto-close after 5 seconds to be less annoying
            setTimeout(() => {
                notification.close();
            }, 5000);
        } else if (!this.data.preferences.notifications) {
            // Show a gentle in-app notification instead
            this.showInAppNotification(title, body);
        } else {
            // Fallback alert, but make it less jarring
            alert(`${title}\n\n${body}`);
        }
    }

    showInAppNotification(title, body) {
        // Create a gentle notification toast
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="notification-content">
                <strong>${title}</strong>
                <p>${body}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">Got it! ✌️</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 350px;
                    backdrop-filter: blur(10px);
                }
                .notification-content strong {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 16px;
                }
                .notification-content p {
                    margin: 5px 0;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .notification-close {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 5px 12px;
                    border-radius: 15px;
                    cursor: pointer;
                    margin-top: 8px;
                    font-size: 12px;
                    transition: background 0.2s;
                }
                .notification-close:hover {
                    background: rgba(255,255,255,0.3);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 8000);
    }

    generateTips() {
        this.getNewDailyTip();
        this.generatePersonalizedTips();
    }

    // Chart Functions
    initProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        const chartData = this.getWeeklyChartData();
        
        this.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Water (L)',
                        data: chartData.water,
                        borderColor: 'rgb(30, 144, 255)',
                        backgroundColor: 'rgba(30, 144, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Steps (thousands)',
                        data: chartData.steps,
                        borderColor: 'rgb(50, 205, 50)',
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
                    },
                    title: {
                        display: true,
                        text: 'Recent Progress'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    getWeeklyChartData() {
        const labels = [];
        const waterData = [];
        const stepsData = [];
        
        // Get last 4 days including today for shorter chart
        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            // Format label
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            labels.push(dayName);
            
            if (i === 0) {
                // Today's data
                waterData.push(this.data.daily.water);
                stepsData.push(this.data.daily.steps / 1000); // Convert to thousands
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
            const chartData = this.getWeeklyChartData();
            this.progressChart.data.labels = chartData.labels;
            this.progressChart.data.datasets[0].data = chartData.water;
            this.progressChart.data.datasets[1].data = chartData.steps;
            this.progressChart.update();
        }
    }
}

// Global functions for onclick handlers
let healthDashboard;

window.addWater = (amount) => healthDashboard.addWater(amount);
window.addSteps = (amount) => healthDashboard.addSteps(amount);
window.calculateWaterSteps = () => healthDashboard.calculateWaterSteps();
window.calculateBMI = () => healthDashboard.calculateBMI();
window.calculateCalories = () => healthDashboard.calculateCalories();
window.calculateSleep = () => healthDashboard.calculateSleep();
window.startWaterTimer = () => healthDashboard.startWaterTimer();
window.pauseWaterTimer = () => healthDashboard.pauseWaterTimer();
window.resetWaterTimer = () => healthDashboard.resetWaterTimer();
window.joinChallenge = (type) => healthDashboard.joinChallenge(type);
window.shareProgress = () => healthDashboard.shareProgress();
window.getNewDailyTip = () => healthDashboard.getNewDailyTip();
window.getWeatherTips = () => healthDashboard.getWeatherTips();

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
    const notifications = document.getElementById('setup-notifications').checked;
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
    healthDashboard.data.preferences.notifications = notifications;
    healthDashboard.data.preferences.darkMode = darkMode;
    
    // Calculate personalized goals
    const waterGoal = Math.max(2.0, weight * 0.035); // 35ml per kg
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

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    healthDashboard = new HealthDashboard();
});