from flask import Blueprint, request, jsonify
from controllers.prompt import get_tree, get_prompt_, save_prompt_, add_prompt_template_, delete_prompt_template_
from middleware.auth import auth_required
from genai.gemeni import generate_response

prompt_blueprint = Blueprint('/api/prompt/', __name__)

@prompt_blueprint.route('/tree', methods=['GET'])
@auth_required
def tree(role):
    return jsonify({"tree": get_tree(), "role": role})

@prompt_blueprint.route('/get_prompt', methods=['POST'])
@auth_required
def get_prompt(role):
    req = request.get_json()
    return jsonify(get_prompt_(req['prompt_file'], req['prompt_name']))


@prompt_blueprint.route('/save_prompt', methods=['POST'])
@auth_required
def save_prompt(role):
    if role != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(save_prompt_(req['prompt'], req['prompt_file'], req['prompt_name']))

@prompt_blueprint.route('/generate', methods=['POST'])
@auth_required
def generate(role):
    req = request.get_json()
    print(req)
    return generate_response(req['prompt'])

@prompt_blueprint.route('/add_prompt_template', methods=['POST'])
@auth_required
def add_prompt_template(role):
    if role != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(add_prompt_template_(req['category_file'], req['template_name'], req["dir_name"]))

@prompt_blueprint.route('/delete_prompt_template', methods=['POST'])
@auth_required
def delete_prompt_template(role):
    if role != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(delete_prompt_template_(req['category_file'], req['template_name'], req["dir_name"]))
