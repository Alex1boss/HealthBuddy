# replit.md

## Overview

Daily Health Buddy is a health calculator web application built with Flask that helps users calculate their recommended daily water intake and step goals based on their weight. The application now features user authentication via Replit Auth, allowing users to create accounts and save their calculation history. It maintains a clean, modern design with a blue and green color scheme, emphasizing hydration and fitness themes.

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
- **Flask** web framework with PostgreSQL database integration
- **Flask-SQLAlchemy** for database ORM and management
- **Replit Authentication** using OAuth2/OpenID Connect for user management
- **Flask-Login** for session management and user authentication
- **Template-based rendering** using Jinja2 templates with authentication context
- **RESTful API endpoints** for calculation processing and history management
- **Environment-based configuration** for session secrets and database connections

### Design System
- **Color scheme**: Primary blue (#1E90FF) for water/health, secondary green (#32CD32) for fitness
- **Consistent styling**: 16px border radius, subtle shadows, and smooth transitions
- **Responsive design**: Mobile-first approach with Bootstrap breakpoints
- **Accessibility considerations**: Proper form labels and semantic HTML structure

### Calculator Logic
- **Server-side calculations** with database persistence for authenticated users
- **AJAX-based communication** between frontend and backend for seamless UX
- **Input validation** on both client and server sides with comprehensive error handling
- **Animated results display** with fade-in effects and save confirmation feedback
- **Health recommendations** based on weight input using standard formulas (weight × 0.033L for water)
- **Calculation history tracking** with timestamp and user association

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

### Backend Dependencies
- **Flask** - Python web framework for backend development  
- **Flask-SQLAlchemy** - Database ORM for PostgreSQL integration
- **Flask-Login** - User session management and authentication
- **Flask-Dance** - OAuth2/OpenID Connect integration for Replit Auth
- **PostgreSQL** - Production database for user accounts and calculation history
- **PyJWT** - JSON Web Token handling for authentication
- **Psycopg2** - PostgreSQL database adapter

### Database Schema
- **Users table** - Stores user profile information from Replit Auth
- **OAuth table** - Manages authentication tokens and session storage  
- **Calculation History table** - Tracks user calculations with timestamps

### Authentication Features
- **Replit OAuth integration** - Seamless sign-in with Replit accounts
- **Session management** - Persistent user sessions with automatic token refresh
- **Guest mode support** - Calculator works without authentication, with sign-in prompts
- **History tracking** - Authenticated users get persistent calculation history
- **User profile display** - Welcome messages with user's first name from Replit

### New User Interface Features
- **Authentication status** - Clear indication of login state in header
- **Recent calculations** - Quick view of last 5 calculations on home page
- **History page** - Full calculation history with pagination and management tools
- **Navigation** - User-friendly navigation between calculator and history
- **Save confirmations** - Visual feedback when calculations are saved to history

The application now provides a comprehensive user experience with persistent data while maintaining the original lightweight, performance-focused design for guest users.