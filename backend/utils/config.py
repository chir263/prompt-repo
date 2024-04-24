import json
import urllib.request
from dotenv import load_dotenv
import os

load_dotenv()

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
        print(f"Saving JSON file to {file_path}")
        print(data)
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
        return True
    except Exception as e:
        print(f"Error saving JSON file: {e}")
        raise e

def get_user_config():
    return load_json(os.environ.get('USER_CONFIG_PATH') or '../users.config.json')

def get_prompt_config():
    return load_json(os.environ.get('PROMPT_CONFIG_PATH') or '../prompts.config.json')





