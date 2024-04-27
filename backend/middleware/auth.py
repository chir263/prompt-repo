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
        
        current_user = get_user(access_token)
        users = get_user_config()
        
        valid_user = False
        role = "User"
        for user in users:
            if user["Github Account"] == current_user["login"]:
                role = user["Role"]
                valid_user = True

        if not valid_user:
            return jsonify({'error': 'Unauthorized user'}), 401
        return f(*args, role=role, **kwargs)
    return decorated_function
