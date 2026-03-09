import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

URL = os.getenv("ANTIGRAVITY_BRAIN_URL")
KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY")

def get_supabase():
    return create_client(URL, KEY)

def upload_video(file_path, bucket_name="video_assets"):
    supabase = get_supabase()
    file_name = os.path.basename(file_path)
    
    with open(file_path, "rb") as f:
        print(f"☁️ Uploading {file_name} to Supabase Storage...")
        supabase.storage.from_(bucket_name).upload(
            path=file_name,
            file=f,
            file_options={"cache-control": "3600", "upsert": "true"}
        )
    
    # Get public URL
    public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
    print(f"✅ Public URL: {public_url}")
    return public_url

if __name__ == "__main__":
    # Test
    # upload_video("path/to/test.mp4")
    pass
