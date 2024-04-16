from functools import wraps
from flask import request, jsonify
from controllers.user import get_user
from utils.config import get_user_config

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        access_token = request.args.get('access_token')
        if not access_token:
            return jsonify({'error': 'Access token missing'}), 401
        
        user = get_user(access_token)
        users = get_user_config()["users"]


        if user["login"] not in users:
            return jsonify({'error': 'Unauthorized user'}), 401

        return f(*args, **kwargs)
    return decorated_function
