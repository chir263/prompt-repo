import json
import urllib.request
from dotenv import load_dotenv
import os
from utils.sheet import GoogleSheet
load_dotenv()

sheet = GoogleSheet()

def get_user_config():
    users = sheet.get_all_records(tab_name="Users")
    return users



