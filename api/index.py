from flask import Flask, render_template, request
import os

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Serve the main HTML for all routes
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Water Intake & Steps Calculator - Daily Health Buddy</title>
    <meta name="description" content="Free daily water intake calculator. Enter your weight and get recommended hydration and step goals instantly.">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google AdSense Script -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7136012713043150"
     crossorigin="anonymous"></script>
    
    <style>
        /* CSS Variables for Color Scheme */
        :root {
            --primary-blue: #1E90FF;
            --secondary-green: #32CD32;
            --background-gray: #F9FAFB;
            --text-dark: #111827;
            --white: #FFFFFF;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --border-radius: 16px;
            --transition: all 0.3s ease;
        }

        /* Global Styles */
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-gray);
            color: var(--text-dark);
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        /* Hero Section */
        .hero-section {
            padding: 60px 0 40px 0;
            text-align: center;
        }

        .hero-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .hero-subtitle {
            font-size: 1.125rem;
            color: #64748B;
            max-width: 500px;
            margin: 0 auto 3rem auto;
        }

        /* Calculator Card */
        .calculator-section {
            padding: 0 0 60px 0;
        }

        .calculator-card {
            background: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            padding: 2.5rem;
            margin-bottom: 2rem;
        }

        .input-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 600;
            color: var(--text-dark);
        }

        .form-control {
            width: 100%;
            padding: 1rem;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            font-size: 1.125rem;
            transition: var(--transition);
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.1);
        }

        .calculate-btn {
            width: 100%;
            padding: 1rem 2rem;
            background-color: var(--primary-blue);
            color: var(--white);
            border: none;
            border-radius: var(--border-radius);
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: var(--shadow);
        }

        .calculate-btn:hover {
            background-color: #1C7ED6;
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .results-card {
            margin-top: 2rem;
            padding: 1.5rem;
            background: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            opacity: 0;
            transform: translateY(20px);
            transition: var(--transition);
            display: none;
        }

        .results-card.show {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }

        .result-item {
            display: flex;
            align-items: center;
            padding: 1.5rem;
            background-color: #F8FAFC;
            border-radius: var(--border-radius);
            margin-bottom: 1rem;
            border-left: 4px solid var(--primary-blue);
        }

        .result-item:last-child {
            border-left-color: var(--secondary-green);
            margin-bottom: 0;
        }

        .result-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            font-size: 1.5rem;
            color: var(--white);
        }

        .water-icon {
            background-color: var(--primary-blue);
        }

        .steps-icon {
            background-color: var(--secondary-green);
        }

        .result-content h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-dark);
        }

        .result-value {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-blue);
        }

        .result-item:last-child .result-value {
            color: var(--secondary-green);
        }

        .error-message {
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            font-weight: 500;
            display: none;
        }

        .error-message.show {
            display: block;
        }

        /* Personalized Tips */
        .personalized-tips-card {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f4f8 100%);
            border-radius: 16px;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
            margin-top: 20px;
            padding: 25px;
            border-left: 4px solid var(--primary-blue);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }

        .personalized-tips-card.show {
            opacity: 1;
            transform: translateY(0);
        }

        .tips-title {
            color: var(--primary-blue);
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .tips-content {
            display: grid;
            gap: 15px;
        }

        .tip-item {
            background: white;
            padding: 15px 20px;
            border-radius: 12px;
            border-left: 3px solid var(--secondary-green);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .tip-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .tip-item h6 {
            color: var(--text-dark);
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            font-size: 1rem;
        }

        .tip-item h6 i {
            margin-right: 8px;
            color: var(--secondary-green);
        }

        .tip-item p {
            color: #4A5568;
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        .highlight-number {
            color: var(--primary-blue);
            font-weight: 700;
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 2rem;
            }
            .calculator-card {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>

    <!-- Header / Hero Section -->
    <header class="hero-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <h1 class="hero-title">Daily Health Buddy</h1>
                    <p class="hero-subtitle">Calculate your daily water intake and steps goal in seconds.</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Calculator Section -->
    <section class="calculator-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6 col-md-8">
                    <div class="calculator-card">
                        <div class="input-group">
                            <label for="weight-input" class="form-label">Enter your weight (kg)</label>
                            <input type="number" id="weight-input" class="form-control weight-input" placeholder="e.g., 70" min="20" step="0.1">
                            <div class="error-message" id="error-message"></div>
                        </div>
                        
                        <button id="calculate-btn" class="btn btn-primary calculate-btn">
                            <i class="fas fa-calculator me-2"></i>
                            Calculate My Health Goals
                        </button>
                        
                        <!-- Results Card -->
                        <div id="results-card" class="results-card">
                            <div class="result-item">
                                <div class="result-icon water-icon">
                                    <i class="fas fa-tint"></i>
                                </div>
                                <div class="result-content">
                                    <h4>Recommended Daily Water Intake</h4>
                                    <p id="water-result" class="result-value">0 liters</p>
                                </div>
                            </div>
                            
                            <div class="result-item">
                                <div class="result-icon steps-icon">
                                    <i class="fas fa-walking"></i>
                                </div>
                                <div class="result-content">
                                    <h4>Recommended Steps Goal</h4>
                                    <p id="steps-result" class="result-value">10,000 steps</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Personalized Tips Card -->
                        <div id="personalized-tips" class="personalized-tips-card" style="display: none;">
                            <h4 class="tips-title">
                                <i class="fas fa-lightbulb me-2"></i>
                                Your Personalized Health Tips
                            </h4>
                            <div id="tips-content" class="tips-content">
                                <!-- Tips will be dynamically generated here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const weightInput = document.getElementById('weight-input');
            const calculateBtn = document.getElementById('calculate-btn');
            const resultsCard = document.getElementById('results-card');
            const waterResult = document.getElementById('water-result');
            const stepsResult = document.getElementById('steps-result');
            const errorMessage = document.getElementById('error-message');

            calculateBtn.addEventListener('click', calculateHealthGoals);
            
            weightInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateHealthGoals();
                }
            });

            weightInput.addEventListener('input', function(e) {
                let value = e.target.value;
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                
                e.target.value = value;
                hideError();
            });

            function calculateHealthGoals() {
                const weight = parseFloat(weightInput.value);
                
                calculateBtn.classList.remove('loading');
                
                if (!validateInput(weight)) {
                    return;
                }

                calculateBtn.classList.add('loading');
                
                setTimeout(() => {
                    const waterIntake = (weight * 0.033).toFixed(1);
                    const stepsGoal = 10000;
                    
                    waterResult.textContent = waterIntake + ' liters';
                    stepsResult.textContent = stepsGoal.toLocaleString() + ' steps';
                    
                    generatePersonalizedTips(weight, waterIntake);
                    showResults();
                    showPersonalizedTips();
                    
                    calculateBtn.classList.remove('loading');
                    
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

                const avgHeight = 1.7;
                const bmi = weight / (avgHeight * avgHeight);
                
                // Water intake tips
                if (parseFloat(waterIntake) < 2.0) {
                    tips.push({
                        icon: 'fas fa-tint',
                        title: 'Hydration Boost Needed',
                        content: 'At ' + weight + 'kg, you need <span class="highlight-number">' + waterIntake + 'L</span> daily. Try drinking a glass every hour to stay hydrated.'
                    });
                } else if (parseFloat(waterIntake) > 3.0) {
                    tips.push({
                        icon: 'fas fa-tint',
                        title: 'Stay Consistently Hydrated',
                        content: 'Your <span class="highlight-number">' + waterIntake + 'L</span> daily goal is substantial. Spread it throughout the day and drink before you feel thirsty.'
                    });
                } else {
                    tips.push({
                        icon: 'fas fa-tint',
                        title: 'Perfect Hydration Goal',
                        content: 'Your <span class="highlight-number">' + waterIntake + 'L</span> daily water goal is ideal for your weight. Track your intake with a water bottle.'
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

                // Daily routine tips
                const glassesPerDay = Math.round(parseFloat(waterIntake) * 4);
                tips.push({
                    icon: 'fas fa-clock',
                    title: 'Daily Hydration Schedule',
                    content: 'Drink <span class="highlight-number">' + glassesPerDay + ' glasses</span> throughout the day. Start with 2 glasses upon waking, then 1 glass every 2 hours.'
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
                tipsContent.innerHTML = tips.map(tip => 
                    '<div class="tip-item">' +
                    '<h6><i class="' + tip.icon + '"></i>' + tip.title + '</h6>' +
                    '<p>' + tip.content + '</p>' +
                    '</div>'
                ).join('');
            }
        });
    </script>

</body>
</html>'''

# This is required for Vercel
def handler(request):
    return catch_all('')