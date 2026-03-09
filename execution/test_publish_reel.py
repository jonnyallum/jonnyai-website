import os
import sys
from pathlib import Path

# Add execution dir to path
sys.path.insert(0, str(Path(__file__).parent))
import facebook_publisher as fp

def test_publish():
    video_path = "c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/video/REEL_TEST/maestro_pilot_reel.mp4"
    caption = "The speed of the leader is the speed of the Orchestra. The future is agentic. 🎼 #TheMaestro #Antigravity #JaiOS"
    
    if not os.path.exists(video_path):
        print(f"❌ Video not found at {video_path}")
        return

    # Public URL is needed for IG (provided by the generation script)
    # But for FB, we can use local binary upload.
    
    print("🚀 PUBLISHING MAESTRO PILOT...")
    
    # 1. Facebook Reel (Binary Upload)
    fb_ok = fp.post_to_facebook_reel(video_path, caption)
    
    # 2. Instagram Reel (Needs Public URL - I'll need to pass it or re-upload)
    # Since I'm testing, I'll rely on the Supabase URL from the generation output.
    # I'll modify the generation script to SAVE the URL to a file or just manually run the publish step with it.

if __name__ == "__main__":
    test_publish()
