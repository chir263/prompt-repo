import json
import urllib.request

def load_json(file_path_or_url):
    try:
        if file_path_or_url.startswith("http://") or file_path_or_url.startswith("https://"):
            with urllib.request.urlopen(file_path_or_url) as url:
                data = url.read().decode()
        else:
            with open(file_path_or_url) as file:
                data = file.read()

        json_data = json.loads(data)
        return json_data

    except Exception as e:
        print(f"Error loading JSON file: {e}")
        return None
    

def save_json(file_path, data):
    try:
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
        return True
    except Exception as e:
        print(f"Error saving JSON file: {e}")
        raise e

def get_user_config():
    return load_json("../users.config.json")

def get_prompt_config():
    return load_json("../prompts.config.json")





