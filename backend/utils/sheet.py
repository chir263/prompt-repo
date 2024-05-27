import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
from dotenv import load_dotenv

load_dotenv()

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name('secrets/service-account-secret.json', scope)


class GoogleSheet:
    def __init__(self, sheet_id = os.environ.get("GOOGLE_SHEET_ID"), tab_name="Users"):
        self.client = gspread.authorize(credentials)
        self.spreadsheet = self.client.open_by_key(sheet_id)
        self.worksheet = self.spreadsheet.worksheet(tab_name)

        self.get_all_records(tab_name="Prompt Templates")

    def re_init(self, tab_name=""):
        self.client = gspread.authorize(credentials)
        self.spreadsheet = self.client.open_by_key(self.spreadsheet.id)
        self.worksheet = self.spreadsheet.worksheet(tab_name or "Users")

    def get_all_records(self, tab_name="", range=""):
        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
        if range:
            records = self.worksheet.get(range)
            if len(records) == 0:
                return []
            else:
                required_columns = records[0]
                filtered_data = []
                for row in records[1:]:
                    filtered_row = {required_columns[i]: row[i] for i in range(len(required_columns))}
                    filtered_data.append(filtered_row)

                return filtered_data

        records = self.worksheet.get_all_records()
        rows = []
        for record in records:
            rows.append(record)
        return rows
    
    def if_exists(self, find, tab_name=""):
        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
            records = self.get_all_records(tab_name=tab_name)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
            records = self.get_all_records(tab_name=tab_name)
        
        for record in records:
            flag = 1
            for key, value in find.items():
                if record[key] != value:
                    flag = 0
                    break
            if flag:
                return True
            
        return False
        
    def append_row(self, data, tab_name=""):
        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
            self.worksheet.append_row(data)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
            self.worksheet.append_row(data)

    def get_row(self, find, tab_name=""):
        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
            records = self.get_all_records(tab_name=tab_name)
            # print(records)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
            records = self.get_all_records(tab_name=tab_name)
        
        for record in records:
            flag = 1
            for key, value in find.items():
                if record[key] != value:
                    flag = 0
                    break
            if flag:
                return record
        return None
    
    def update_row(self, find, data, tab_name=""):

        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
            records = self.get_all_records(tab_name=tab_name)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
            records = self.get_all_records(tab_name=tab_name)
        
        row_number = None
        for i, record in enumerate(records, start=2):
            flag = 1
            for key, value in find.items():
                if record[key] != value:
                    flag = 0
                    break
            if flag:
                row_number = i
                break
    
        if row_number:
            columns = [chr(ord('A') + i) for i in range(len(data))]
            row_range = f"{columns[0]}{row_number}:{columns[-1]}{row_number}"
            self.worksheet.update(row_range, [list(data)])
            print("Row updated successfully!")
        else:
            print("No matching record found to update.")

    def delete_row(self, find, tab_name=""):
        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
            records = self.get_all_records(tab_name=tab_name)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
            records = self.get_all_records(tab_name=tab_name)
        
        row_number = None
        for i, record in enumerate(records, start=2):
            flag = 1
            for key, value in find.items():
                if record[key] != value:
                    flag = 0
                    break
            if flag:
                row_number = i
                break
    
        if row_number:
            print("Deleting",row_number)
            self.worksheet.delete_rows(row_number)
            print("Row deleted successfully!")
        else:
            print("No matching record found to delete.")

    def delete_rows(self, find, tab_name=""):
        try:
            if tab_name != "":
                self.worksheet = self.spreadsheet.worksheet(tab_name)
            records = self.get_all_records(tab_name=tab_name)
        except gspread.exceptions.APIError:
            self.re_init(tab_name=tab_name)
            records = self.get_all_records(tab_name=tab_name)
        
        row_numbers = []
        for i, record in enumerate(records, start=2):
            flag = 1
            for key, value in find.items():
                if record[key] != value:
                    flag = 0
                    break
            if flag:
                row_numbers.append(i)
    
        if len(row_numbers):
            print("Deleting",row_numbers)
            for row_index in reversed(row_numbers):
                self.worksheet.delete_rows(row_index)
            print("Rows deleted successfully!")
        else:
            print("No matching record found to delete.")
