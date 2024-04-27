from flask import Blueprint, request, jsonify
from controllers.user import get_user
from middleware.auth import auth_required

user_blueprint = Blueprint('/api/user/', __name__)



@user_blueprint.route('/', methods=['GET'])
@auth_required
def user(role):
    access_token = request.args.get('access_token')
    return jsonify(get_user(access_token))
