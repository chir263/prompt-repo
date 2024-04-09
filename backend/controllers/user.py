import requests

def get_user(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get("https://api.github.com/user", headers=headers)
    user = response.json()
    return user