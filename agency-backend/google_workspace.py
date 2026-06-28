import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/spreadsheets']

class GoogleWorkspaceLayer:
    def __init__(self):
        self.creds = None
        cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "credentials.json")
        if os.path.exists(cred_path):
            self.creds = Credentials.from_authorized_user_file(cred_path, SCOPES)
        else:
            print(f"Warning: Google credentials not found at {cred_path}")
            
    def get_gmail_service(self):
        if self.creds:
            return build('gmail', 'v1', credentials=self.creds)
        return None

    def get_sheets_service(self):
        if self.creds:
            return build('sheets', 'v4', credentials=self.creds)
        return None
        
    def log_to_sheet(self, spreadsheet_id: str, range_name: str, values: list):
        service = self.get_sheets_service()
        if not service:
            return None
        body = {'values': [values]}
        result = service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id, range=range_name,
            valueInputOption="RAW", body=body).execute()
        return result

google_layer = GoogleWorkspaceLayer()
