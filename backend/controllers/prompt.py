from uuid import uuid4
import json
from dotenv import load_dotenv
import os
from utils.sheet import GoogleSheet

sheet = GoogleSheet()

load_dotenv()



def get_tree():

    def get_key(dir, category):
        return dir + "$#" + category

    p_tab_name = "Prompt Directories"
    prompt_directories = sheet.get_all_records(p_tab_name)

    t_tab_name = "Prompt Templates"
    prompt_templates = sheet.get_all_records(t_tab_name)

    mp = {}

    for prompt_template in prompt_templates:
        key = get_key(prompt_template["Prompt Directory"], prompt_template["Category"])
        if key in mp:
            mp[key].append(prompt_template)
        else:
            mp[key] = [prompt_template]
    
    base = []
    for prompt_directory in prompt_directories:


        category_list = [category.strip() for category in prompt_directory["Category List"].split(",")]
        obj = {}
        obj['id'] = str(uuid4())
        obj["name"] = prompt_directory["Prompt Directory"]
        obj["children"] = []
        obj['type'] = 'directory'

        if prompt_directory["Category List"].strip() != "":
            for category in category_list:
                child = {}
                child['id'] = str(uuid4())
                child['name'] = category
                child['children'] = []
                child['type'] = "category"
                child["directory"] = prompt_directory["Prompt Directory"]
                for prompt_template in mp.get(get_key(prompt_directory["Prompt Directory"], category), []):
                    child['children'].append({
                        'id': str(uuid4()),
                        'name': prompt_template["Template Name"],
                        "type": "template",
                        "category": category,
                        "directory": prompt_directory["Prompt Directory"]
                    })
                obj['children'].append(child)
        base.append(obj)

    return base


def get_prompt_(dir_name, category_name, prompt_name):
    try:
        row = sheet.get_row({"Prompt Directory": dir_name, "Template Name": prompt_name,"Category": category_name}, "Prompt Templates")

        if row == None:
            return {"status": "error", "message": "Prompt not found"}
        
        return {
            "master_prompt": "",
            "status": "success",
            "prompt": {
                "name": row["Template Name"],
                "prompt_template": row["Prompt Template"],
                "placeholders": json.loads(row["Placeholders"])
            }
        }

    except Exception as e:
        print(f"Error getting prompt: {e}")
        return {"status": "error", "message": str(e)}
    

def save_prompt_(prompt, prompt_dir, prompt_category, prompt_name):
    try:

        tab_name = "Prompt Templates"

        if not check_prompt_template_exists(prompt_dir, prompt_category, prompt_name):
            return {"status": "error", "message": "Template does not exist"}

        sheet.update_row({
            "Prompt Directory": prompt_dir,
            "Category": prompt_category,
            "Template Name": prompt_name
        }, [prompt_dir, prompt_category, prompt_name, prompt["prompt_template"], json.dumps(prompt["placeholders"])], tab_name)
        
        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prompt: {e}")
        return {"status": "error", "message": str(e)}



def check_category_exists_(category_name, dir_name):
    tab_name = "Prompt Directories"
    if sheet.if_exists({"Prompt Directory": dir_name}, tab_name):
        category_obj = sheet.get_row({"Prompt Directory": dir_name}, tab_name)
        category_str = category_obj["Category List"].strip()
        if category_str == "":
            return False, [], {"status": "error", "message": "Category does not exist"}
        else:
            category_list = [category.strip() for category in category_str.split(",")]
            if category_name in category_list:
                return True, category_list, {"status": "success"}
            else:
                return False, category_list, {"status": "error", "message": "Category does not exist"}
    else:
        return False, [], {"status": "error", "message": "Directory does not exist"}
    
def check_directory_exists_(dir_name):
    tab_name = "Prompt Directories"
    return sheet.if_exists({"Prompt Directory": dir_name}, tab_name)

def check_prompt_template_exists(dir_name, category_name, template_name):
    tab_name = "Prompt Templates"
    return sheet.if_exists({"Prompt Directory": dir_name, "Category": category_name, "Template Name": template_name}, tab_name)


def add_prompt_template_(category_name, template_name, dir_name, template):
    try:
        if check_prompt_template_exists(dir_name, category_name, template_name):
            return {"status": "error", "message": "Template already exists"}
        
        tab_name = "Prompt Templates"
        sheet.append_row([dir_name, category_name, template_name, template, "{}"], tab_name)
        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prompt: {e}")
        return {"status": "error", "message": str(e)}

def delete_prompt_template_(category_file, template_name, dir_name):
    try:
        tab_name = "Prompt Templates"

        if not check_prompt_template_exists(dir_name, category_file, template_name):
            return {"status": "error", "message": "Template does not exist"}
        else:
            sheet.delete_row({"Prompt Directory": dir_name, "Category": category_file, "Template Name": template_name}, tab_name)   
        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prompt: {e}")
        return {"status": "error", "message": str(e)}
    

def create_prompt_directory_(dir_name):
    tab_name = "Prompt Directories"
    if sheet.if_exists({"Prompt Directory": dir_name}, tab_name):
        return {"status": "error", "message": "Directory already exists"}
    else:
        sheet.append_row(data=[dir_name, ""], tab_name=tab_name)
        return {"status": "success"}
    
def create_prompt_category_(dir_name, category_name):
    tab_name = "Prompt Directories"

    isCategoryExists, category_list, response = check_category_exists_(category_name, dir_name)

    if isCategoryExists:
        return {"status": "error", "message": "Category already exists"}
    else:
        if response["message"] != "Category does not exist":
            return response
        category_list.append(category_name)
        category_str = ", ".join(category_list)
        sheet.update_row(find={"Prompt Directory": dir_name}, data=[dir_name, category_str], tab_name=tab_name)
        return {"status": "success"}

def delete_prompt_category_(dir_name, category_name):
    tab_name = "Prompt Directories"

    isCategoryExists, category_list, response = check_category_exists_(category_name, dir_name)

    if isCategoryExists:
        category_list.remove(category_name)
        category_str = ", ".join(category_list)
        sheet.update_row(find={"Prompt Directory": dir_name}, data=[dir_name, category_str], tab_name=tab_name)

        tab_name = "Prompt Templates"
        sheet.delete_rows(find={"Prompt Directory": dir_name, "Category": category_name}, tab_name=tab_name)
        return {"status": "success"}
    else:
        return response
    

def delete_prompt_directory_(dir_name):
    tab_name = "Prompt Directories"
    if check_directory_exists_(dir_name):
        sheet.delete_rows(find={"Prompt Directory": dir_name}, tab_name=tab_name)
        tab_name = "Prompt Templates"
        sheet.delete_rows(find={"Prompt Directory": dir_name}, tab_name=tab_name)
        return {"status": "success"}
    else:
        return {"status": "error", "message": "Directory does not exist"}