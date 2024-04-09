from flask import Flask, redirect, url_for, session, request, jsonify
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv
import requests
from flask_cors import CORS, cross_origin
from blueprints.user import user_blueprint
from blueprints.prompt import prompt_blueprint

load_dotenv()

app = Flask(__name__)

CORS(app, support_credentials=True)

app.secret_key = 'myscretkey'
app.url_map.strict_slashes = False

app.register_blueprint(user_blueprint, url_prefix='/api/user')
app.register_blueprint(prompt_blueprint, url_prefix='/api/prompt')

oauth = OAuth(app)
github = oauth.register(
    name='github',
    client_id=os.environ.get('GITHUB_CLIENT_ID'),
    client_secret=os.environ.get('GITHUB_CLIENT_SECRET'),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)


@app.route("/")
def index():
    return f'Prompt Repository'


@app.route('/auth/github/login')
def registro():
    github = oauth.create_client('github')
    redirect_uri = os.environ.get('REDIRECT_URI')
    return github.authorize_redirect(redirect_uri)


@app.route('/auth/github/access_token', methods=['POST'])
def access_token():
    code = request.json.get('code')
    url = "https://github.com/login/oauth/access_token"
    client_id = os.environ.get('GITHUB_CLIENT_ID')
    client_secret = os.environ.get('GITHUB_CLIENT_SECRET')

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code
    }

    response = requests.post(url, json=data, headers=headers)
    access_token = response.json().get("access_token")
    return jsonify({"access_token": access_token})


if __name__ == "__main__":
    app.run(debug=True)
