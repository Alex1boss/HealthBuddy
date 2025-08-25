import os
from flask import Flask, render_template

# create the app
app = Flask(__name__, 
           template_folder='templates',
           static_folder='static')
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/drinks')
def drinks():
    return render_template('drinks.html')

@app.route('/about')
def about():
    with open('about.html', 'r') as f:
        return f.read()

@app.route('/contact')
def contact():
    with open('contact.html', 'r') as f:
        return f.read()

@app.route('/privacy')
def privacy():
    with open('privacy.html', 'r') as f:
        return f.read()

@app.route('/sugar')
def sugar():
    return render_template('sugar.html')

@app.route('/sugar-hydration-guide')
def sugar_hydration_guide():
    with open('sugar-hydration-guide.html', 'r') as f:
        return f.read()

@app.errorhandler(404)
def not_found_error(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html'), 500

# Vercel requires the app variable to be exposed
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
