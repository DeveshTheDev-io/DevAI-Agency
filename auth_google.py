import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Scopes needed for Calendar, Gmail (read-only), and Sheets (read-only)
SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]

def authenticate_google():
    creds = None
    token_path = r'd:\Devscosmic.AI\DevAI-Agency\token.pickle'
    
    # Load existing token if available
    if os.path.exists(token_path):
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)
            
    # If no valid credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                r'D:\client_secret_834481755785-nd2rp67d00dt916v7u18sfan0nth2jja.apps.googleusercontent.com.json', SCOPES)
            creds = flow.run_local_server(port=0)
            
        # Save the credentials for the next run
        with open(token_path, 'wb') as token:
            pickle.dump(creds, token)
            
    print("Authentication successful! token.pickle saved.")
    
    # Quick test to verify Calendar API
    service = build('calendar', 'v3', credentials=creds)
    calendar_list = service.calendarList().list().execute()
    print("Calendar API Access: SUCCESS")
    print("Calendars:", [c['summary'] for c in calendar_list.get('items', [])])

if __name__ == '__main__':
    authenticate_google()
