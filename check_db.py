import os
import requests

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def get_table(table):
    res = requests.get(f"{SUPABASE_URL}/rest/v1/{table}?select=*", headers=headers)
    print(f"\n--- Table: {table} ---")
    if res.status_code == 200:
        print(res.json())
    else:
        print(f"Error: {res.status_code} - {res.text}")

get_table("users")
get_table("tickets")
get_table("kiosk_settings")
get_table("transactions")
