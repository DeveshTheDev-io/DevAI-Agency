import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or Key is missing from .env")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

class DatabaseLayer:
    def __init__(self):
        self.client = get_supabase_client()
    
    def create_record(self, table: str, data: dict):
        response = self.client.table(table).insert(data).execute()
        return response.data

    def read_records(self, table: str, query: dict = None):
        req = self.client.table(table).select("*")
        if query:
            for k, v in query.items():
                req = req.eq(k, v)
        response = req.execute()
        return response.data

    def update_record(self, table: str, record_id: str, data: dict):
        response = self.client.table(table).update(data).eq("id", record_id).execute()
        return response.data

    def delete_record(self, table: str, record_id: str):
        response = self.client.table(table).delete().eq("id", record_id).execute()
        return response.data

db_layer = DatabaseLayer()
