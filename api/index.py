import os
import sys
sys.path.append('..')

from flask import Flask, render_template

# create the app
app = Flask(__name__, 
           template_folder='../templates',
           static_folder='../static')
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-for-vercel")

@app.route('/')
def index():
    return render_template('index.html')

@app.errorhandler(404)
def not_found_error(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html'), 500

# For Vercel deployment
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)