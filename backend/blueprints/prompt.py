from flask import Blueprint, request, jsonify
from controllers.prompt import get_tree, get_prompt_, save_prompt_
from middleware.auth import auth_required

prompt_blueprint = Blueprint('/api/prompt/', __name__)

@prompt_blueprint.route('/tree', methods=['GET'])
@auth_required
def tree():
    return jsonify(get_tree())

@prompt_blueprint.route('/get_prompt', methods=['POST'])
@auth_required
def get_prompt():
    req = request.get_json()
    return jsonify(get_prompt_(req['prompt_file'], req['prompt_name']))


@prompt_blueprint.route('/save_prompt', methods=['POST'])
@auth_required
def save_prompt():
    req = request.get_json()
    return jsonify(save_prompt_(req['prompt'], req['prompt_file'], req['prompt_name']))