import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

def verify_google_access():
    load_dotenv(r"d:\Devscosmic.AI\DevAI-Agency\.env")
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    
    if not creds_path or not os.path.exists(creds_path):
        print(f"Error: Google credentials file not found at {creds_path}")
        return False
        
    print(f"Found credentials at: {creds_path}")
    
    try:
        SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
        creds = service_account.Credentials.from_service_account_file(
            creds_path, scopes=SCOPES)
        
        # Test Calendar API
        service = build('calendar', 'v3', credentials=creds)
        calendar_list = service.calendarList().list().execute()
        print("Calendar API Access: SUCCESS")
        print("Calendars:", [c['summary'] for c in calendar_list.get('items', [])])
        return True
    except Exception as e:
        print(f"Error accessing Google APIs: {e}")
        return False

if __name__ == "__main__":
    verify_google_access()
