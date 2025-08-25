# replit.md

## Overview

Daily Health Buddy is a single-page health calculator web application built with Flask. The application helps users calculate their recommended daily water intake and step goals based on their weight, while providing helpful health tips. It features a clean, modern design with a blue and green color scheme, emphasizing hydration and fitness themes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-page application** design using server-side rendered HTML templates
- **Bootstrap 5** framework for responsive grid system and components
- **Custom CSS** with CSS variables for consistent theming and design system
- **Vanilla JavaScript** for calculator functionality and user interactions
- **Google Fonts (Inter)** for modern typography
- **Font Awesome** icons for visual elements

### Backend Architecture
- **Flask** web framework with minimal configuration
- **Template-based rendering** using Jinja2 templates
- **Environment-based configuration** for session secrets
- **Static file serving** for CSS, JavaScript, and potential assets

### Design System
- **Color scheme**: Primary blue (#1E90FF) for water/health, secondary green (#32CD32) for fitness
- **Consistent styling**: 16px border radius, subtle shadows, and smooth transitions
- **Responsive design**: Mobile-first approach with Bootstrap breakpoints
- **Accessibility considerations**: Proper form labels and semantic HTML structure

### Calculator Logic
- **Client-side calculations** for immediate user feedback
- **Input validation** for weight values with real-time error handling
- **Animated results display** with fade-in effects for better user experience
- **Health recommendations** based on weight input with standard formulas

### Content Strategy
- **SEO optimization** with proper meta tags and descriptions
- **AdSense placeholder integration** for potential monetization
- **Health tips section** providing educational value beyond the calculator

## External Dependencies

### Frontend Libraries
- **Bootstrap 5.3.0** - Responsive CSS framework and components
- **Font Awesome 6.4.0** - Icon library for visual elements
- **Google Fonts (Inter)** - Typography and font rendering

### Potential Integrations
- **Google AdSense** - Advertisement placeholders implemented for monetization
- **Analytics tracking** - Structure ready for Google Analytics integration

### Development Dependencies
- **Flask** - Python web framework for backend development
- **Static file handling** - Built-in Flask static file serving for CSS/JS assets

The application is designed as a lightweight, self-contained health calculator with minimal external dependencies, focusing on performance and user experience while maintaining scalability for future feature additions.

## Recent Changes

### Caffeine & Hydration Article Added (August 25, 2025)
- **Created comprehensive article** "Do Coffee, Tea, and Soda Really Count as Water? The Truth About Hydration and Caffeine" (1,700+ words)
- **Added featured article section** to drinks calculator page with eye-catching design and coffee/tea theme
- **Integrated 5 Google ad spaces** throughout the article for optimal AdSense monetization
- **Science-backed content** debunking caffeine myths and providing practical hydration advice
- **Internal linking** to drinks and sugar calculators for improved user engagement

### Footer Consistency Fix (August 25, 2025)
- **Fixed inconsistent footer styling** across all pages (index.html, drinks.html, sugar.html, privacy.html)
- **Standardized dark footer theme** - Dark background (#1e293b), white text, blue links (#0ea5e9)
- **Added missing CSS** to drinks.html and override styles to index.html
- **Ensured consistent links** - All footer links point to .html files for standalone deployment

### Website Optimization & Performance Boost (August 23, 2025)
- **Fixed dark mode issue** - Website now properly loads in light mode for new users
- **Comprehensive performance optimization** - Removed unnecessary features and complex animations
- **Code cleanup** - Reduced JavaScript from 1036 lines to 400 lines (60% reduction)
- **CSS optimization** - Streamlined styles and removed unused code for faster loading
- **SEO improvements** - Added proper meta tags, Open Graph, and Twitter Cards
- **Removed complex features** - Eliminated challenges, advanced tips, and sleep tracking for simplicity
- **Enhanced user onboarding** - Improved setup flow with better validation
- **Mobile optimization** - Better responsive design and touch interactions
- **Security improvements** - Removed external dependencies and cleaned up code

### Personalized Health Tips Feature (August 18, 2025)
- **Added dynamic personalized health tips** based on user weight input and calculated BMI
- **Implemented weight-based recommendations** for hydration strategies and fitness activities
- **Created daily hydration schedules** with specific glass counts for different water intake levels
- **Added health monitoring guidance** with BMI-based suggestions for different weight categories
- **Enhanced user experience** with animated tip cards and hover effects

### Vercel Deployment Preparation (August 18, 2025)
- **Created Vercel deployment configuration** with `vercel.json` for serverless deployment
- **Added deployment entry point** with `index.py` for Vercel compatibility
- **Prepared deployment documentation** with step-by-step Vercel deployment guide
- **Optimized for static deployment** since the application uses client-side calculations
- **Added deployment requirements** and ignore files for clean deployment