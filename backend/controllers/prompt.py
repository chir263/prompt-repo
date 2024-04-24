from utils.config import get_prompt_config, load_json, save_json
from uuid import uuid4
import json
from dotenv import load_dotenv
import os

load_dotenv()

def get_tree():
    prompt_config = get_prompt_config()
    base = []

    for key, value in prompt_config.items():
        obj = {}
        obj['id'] = str(uuid4())
        obj["name"] = key
        obj["description"] = value["description"]
        obj["children"] = []
        obj['type'] = 'directory'
        for category in value["category"]:
            child = {}
            child['id'] = str(uuid4())
            child['name'] = category["name"]
            child['children'] = []
            child['type'] = "category"
            child["file"] = category["prompt_file"]
            child["directory"] = key
            for prompt in category["prompt_list"]:
                child['children'].append({
                    'id': str(uuid4()),
                    'name': prompt,
                    "type": "prompt",
                    "file": category["prompt_file"],
                    "category": category["name"],
                    "directory": key
                })
            obj['children'].append(child)
        base.append(obj)

    return base


def get_prompt_(prompt_file, prompt_name):
    prompt = load_json('.' + prompt_file)
    ret_obj = {
        "master_prompt": prompt["master_prompt"],
    }
    for p in prompt["prompts"]:
        if p["name"].lower()  == prompt_name.lower() :
            ret_obj["prompt"] = p
    return ret_obj  

def save_prompt_(prompt, prompt_file, prompt_name):
    try:

        # print(json.dumps(prompt, indent=4))
        prompt_file = '.' + prompt_file
        prompt_json = load_json(prompt_file)
        prompt_json["prompts"] = list(map(lambda p: p if p["name"].lower() != prompt_name.lower() else prompt, prompt_json["prompts"]))
        save_json(prompt_file, prompt_json)
        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prompt: {e}")
        return {"status": "error", "message": str(e)}

def add_prompt_template_(category_file, template_name, dir_name):
    try:
        category_file_l = '.' + category_file
        prompt_json = load_json(category_file_l)
        prompt_json["prompts"].append({
            "name": template_name,
            "placeholders": {},
            "prompt_template": "Hi! I'm a template!" 
        })
        save_json(category_file_l, prompt_json)

        p_config = get_prompt_config()

        for key, value in p_config.items():
            if key.lower() == dir_name.lower():
                for i in range(len(value["category"])):
                    if value["category"][i]["prompt_file"] == category_file:
                        p_config[key]["category"][i]["prompt_list"].append(template_name)
                        break
                save_json(os.environ.get('PROMPT_CONFIG_PATH'), p_config)
                break   

        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prompt: {e}")
        return {"status": "error", "message": str(e)}

def delete_prompt_template_(category_file, template_name, dir_name):
    try:
        category_file_l = '.' + category_file
        prompt_json = load_json(category_file_l)
        prompt_json["prompts"] = list(filter(lambda p: p["name"].lower() != template_name.lower(), prompt_json["prompts"]))
        save_json(category_file_l, prompt_json)

        p_config = get_prompt_config()

        for key, value in p_config.items():
            if key == dir_name:
                for category in value["category"]:

                    if category["prompt_file"] == category_file:
                        category["prompt_list"] = list(filter(lambda p: p.lower() != template_name.lower(), category["prompt_list"]))
                        break
            
                save_json(os.environ.get('PROMPT_CONFIG_PATH'), p_config)
                break

        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prompt: {e}")
        return {"status": "error", "message": str(e)}