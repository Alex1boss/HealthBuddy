import os
import secrets
from flask import Flask, render_template, redirect
from werkzeug.middleware.proxy_fix import ProxyFix

# create the app
app = Flask(__name__, 
           template_folder='templates',
           static_folder='static')

# Trust proxy headers for Replit environment
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Secure secret key generation for Replit environment
app.secret_key = os.environ.get("SESSION_SECRET", secrets.token_hex(32))

@app.route('/')
def index():
    with open('index.html', 'r') as f:
        return f.read()

@app.route('/drinks')
def drinks():
    with open('drinks.html', 'r') as f:
        return f.read()

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
    with open('sugar.html', 'r') as f:
        return f.read()

@app.route('/sugar-hydration-guide')
def sugar_hydration_guide():
    with open('sugar-hydration-guide.html', 'r') as f:
        return f.read()

@app.route('/hydration-tips')
def hydration_tips():
    with open('hydration-tips.html', 'r') as f:
        return f.read()

@app.route('/caffeine-hydration-truth')
def caffeine_hydration_truth():
    with open('caffeine-hydration-truth.html', 'r') as f:
        return f.read()

@app.route('/sitemap.xml')
def sitemap():
    with open('sitemap.xml', 'r') as f:
        content = f.read()
    response = app.make_response(content)
    response.headers['Content-Type'] = 'application/xml'
    return response

@app.route('/robots.txt')
def robots():
    with open('robots.txt', 'r') as f:
        content = f.read()
    response = app.make_response(content)
    response.headers['Content-Type'] = 'text/plain'
    return response

@app.route('/ads.txt')
def ads_txt():
    return redirect('https://srv.adstxtmanager.com/19390/waincal.com', code=301)

# Redirect .html versions to clean URLs
@app.route('/index.html')
def index_html():
    return redirect('/', code=301)

@app.route('/drinks.html')
def drinks_html():
    return redirect('/drinks', code=301)

@app.route('/about.html')
def about_html():
    return redirect('/about', code=301)

@app.route('/contact.html')
def contact_html():
    return redirect('/contact', code=301)

@app.route('/privacy.html')
def privacy_html():
    return redirect('/privacy', code=301)

@app.route('/sugar.html')
def sugar_html():
    return redirect('/sugar', code=301)

@app.route('/sugar-hydration-guide.html')
def sugar_hydration_guide_html():
    return redirect('/sugar-hydration-guide', code=301)

@app.route('/hydration-tips.html')
def hydration_tips_html():
    return redirect('/hydration-tips', code=301)

@app.route('/caffeine-hydration-truth.html')
def caffeine_hydration_truth_html():
    return redirect('/caffeine-hydration-truth', code=301)


@app.errorhandler(404)
def not_found_error(error):
    with open('index.html', 'r') as f:
        return f.read(), 404

@app.errorhandler(500)
def internal_error(error):
    with open('index.html', 'r') as f:
        return f.read(), 500

# Vercel requires the app variable to be exposed
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
