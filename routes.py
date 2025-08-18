from flask import session, render_template, request, jsonify, redirect, url_for, flash
from app import app, db
from replit_auth import require_login, make_replit_blueprint
from flask_login import current_user
from models import CalculationHistory
from datetime import datetime

app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")

# Make session permanent
@app.before_request
def make_session_permanent():
    session.permanent = True

@app.route('/')
def index():
    # Use flask_login.current_user to check if current user is logged in or anonymous.
    user = current_user
    recent_calculations = []
    
    if user.is_authenticated:
        # Get the 5 most recent calculations for the logged-in user
        recent_calculations = CalculationHistory.query.filter_by(
            user_id=user.id
        ).order_by(CalculationHistory.created_at.desc()).limit(5).all()
    
    return render_template('index.html', user=user, recent_calculations=recent_calculations)

@app.route('/calculate', methods=['POST'])
def calculate():
    """Handle calculation requests and save to history if user is logged in"""
    try:
        data = request.get_json()
        weight = float(data.get('weight', 0))
        
        # Validate weight
        if weight < 20 or weight > 500:
            return jsonify({'error': 'Weight must be between 20 and 500 kg'}), 400
        
        # Calculate water intake and steps
        water_intake = round(weight * 0.033, 1)
        steps_goal = 10000
        
        # Save to history if user is logged in
        if current_user.is_authenticated:
            calculation = CalculationHistory(
                user_id=current_user.id,
                weight=weight,
                water_intake=water_intake,
                steps_goal=steps_goal
            )
            db.session.add(calculation)
            db.session.commit()
        
        return jsonify({
            'water_intake': water_intake,
            'steps_goal': steps_goal,
            'saved': current_user.is_authenticated
        })
        
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid weight value'}), 400
    except Exception as e:
        return jsonify({'error': 'Calculation failed'}), 500

@app.route('/history')
@require_login
def calculation_history():
    """Display calculation history for logged-in users"""
    page = request.args.get('page', 1, type=int)
    per_page = 10
    
    calculations = CalculationHistory.query.filter_by(
        user_id=current_user.id
    ).order_by(CalculationHistory.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('history.html', calculations=calculations)

@app.route('/delete_calculation/<int:calc_id>', methods=['POST'])
@require_login
def delete_calculation(calc_id):
    """Delete a specific calculation from history"""
    calculation = CalculationHistory.query.filter_by(
        id=calc_id, user_id=current_user.id
    ).first_or_404()
    
    db.session.delete(calculation)
    db.session.commit()
    flash('Calculation deleted successfully!', 'success')
    
    return redirect(url_for('calculation_history'))

@app.route('/clear_history', methods=['POST'])
@require_login
def clear_history():
    """Clear all calculation history for the current user"""
    CalculationHistory.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    flash('All calculation history cleared!', 'success')
    
    return redirect(url_for('calculation_history'))