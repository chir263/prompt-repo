from utils.config import get_prompt_config, load_json, save_json
from uuid import uuid4
import json

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


