from flask import Blueprint, request, jsonify
from controllers.prompt import get_tree, get_prompt_, save_prompt_, add_prompt_template_, delete_prompt_template_, create_prompt_directory_, create_prompt_category_, delete_prompt_category_, delete_prompt_directory_
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
    return jsonify(get_prompt_(req['prompt_dir'], req["prompt_category"], req['prompt_name']))


@prompt_blueprint.route('/save_prompt', methods=['POST'])
@auth_required
def save_prompt(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(save_prompt_(req['prompt'], req['prompt_dir'], req["prompt_category"], req['prompt_name']))

@prompt_blueprint.route('/generate', methods=['POST'])
@auth_required
def generate(role):
    req = request.get_json()
    print(req)
    return generate_response(req['prompt'])

@prompt_blueprint.route('/add_prompt_template', methods=['POST'])
@auth_required
def add_prompt_template(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(add_prompt_template_(req['category_name'], req['template_name'], req["dir_name"], req["template"]))

@prompt_blueprint.route('/delete_prompt_template', methods=['POST'])
@auth_required
def delete_prompt_template(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(delete_prompt_template_(req['category_name'], req['template_name'], req["dir_name"]))

@prompt_blueprint.route('/create_prompt_directory', methods=['POST'])
@auth_required
def create_prompt_directory(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(create_prompt_directory_(req['dir_name']))

@prompt_blueprint.route('/create_prompt_category', methods=['POST'])
@auth_required
def create_prompt_category(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(create_prompt_category_(req['dir_name'], req['category_name']))

@prompt_blueprint.route('/delete_prompt_category', methods=['POST'])
@auth_required
def delete_prompt_category(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(delete_prompt_category_(req['dir_name'], req['category_name']))

@prompt_blueprint.route('/delete_prompt_directory', methods=['POST'])
@auth_required
def delete_prompt_directory(role):
    if role.lower() != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    req = request.get_json()
    return jsonify(delete_prompt_directory_(req['dir_name']))