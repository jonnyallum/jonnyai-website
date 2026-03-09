import os
import requests
import json
import subprocess
from pathlib import Path

# --- Configuration ---
ELEVENLABS_API_KEY = "sk_1f8b04ee135d89ed7a60323f403e037d7770fa6e3e9cea83"
MARCUS_VOICE_ID = "ytcsltLTtCHxNn1vC76H"
TMP_DIR = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/video/REEL_TEST")

def get_audio_duration(file_path):
    try:
        import static_ffmpeg
        static_ffmpeg.add_paths()
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)]
        res = subprocess.run(cmd, capture_output=True, text=True)
        return float(res.stdout.strip())
    except Exception as e:
        print(f"⚠️ Could not get audio duration: {e}")
        return 20.0 # Fallback estimate

def generate_voiceover(text, output_path):
    print(f"🎙️ Generating voiceover (Model: Multilingual v2) for: {text[:50]}...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{MARCUS_VOICE_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2", # HIGHER QUALITY
        "voice_settings": {
            "stability": 0.45, 
            "similarity_boost": 0.85,
            "style": 0.5,
            "use_speaker_boost": True
        }
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Voiceover saved to {output_path}")
        return True
    else:
        print(f"❌ Error generating voiceover: {response.text}")
        return False

def download_images(image_urls, output_dir):
    paths = []
    import shutil
    for i, url in enumerate(image_urls):
        path = output_dir / f"img_{i:03d}.png"
        if url.startswith("http"):
            print(f"📥 Downloading {url}...")
            resp = requests.get(url)
            if resp.status_code == 200:
                with open(path, "wb") as f:
                    f.write(resp.content)
                paths.append(path)
        else:
            # Local file
            if os.path.exists(url):
                print(f"📦 Copying local image: {url}")
                shutil.copy(url, path)
                paths.append(path)
            else:
                print(f"⚠️ Local image not found: {url}")
    return paths

def create_video_ffmpeg(audio_path, image_paths, output_video):
    try:
        import static_ffmpeg
        static_ffmpeg.add_paths() 
    except ImportError:
        pass

    audio_dur = get_audio_duration(audio_path)
    print(f"⏳ Audio duration: {audio_dur}s")
    
    # Calculate duration per image to fill the whole audio
    num_images = len(image_paths)
    image_duration = (audio_dur / num_images) + 0.5 # Add a tiny buffer
    
    # We'll create individual video segments for each image with a slow zoom
    segments = []
    for i, img in enumerate(image_paths):
        seg_path = TMP_DIR / f"seg_{i:03d}.mp4"
        # Carlos Zoom: slow zoom center
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(img),
            "-t", str(image_duration),
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
                   "zoompan=z='min(zoom+0.0015,1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920",
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-r", "30", # Ensure constant frame rate
            str(seg_path)
        ]
        subprocess.run(cmd, capture_output=True, text=True)
        segments.append(seg_path)

    # Concat segments
    concat_file = TMP_DIR / "concat_list.txt"
    with open(concat_file, "w") as f:
        for seg in segments:
            f.write(f"file '{seg.name}'\n")

    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-i", str(audio_path),
        "-c:v", "copy", "-c:a", "aac", "-map", "0:v", "-map", "1:a", "-shortest",
        str(output_video)
    ]
    
    print(f"🎬 Running Final Assembly: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(TMP_DIR))
    if result.returncode == 0:
        print(f"✅ Enhanced Reel generated at {output_video}")
        return True
    else:
        print(f"❌ Assembly error: {result.stderr}")
        return False

def test_reel_pipeline():
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Script - Maestro Style (Confident, Measured, Authoritative)
    text = (
        "The speed of the leader is the speed of the Orchestra. "
        "We don't build products. We build the teams that build the future. "
        "Right person. Right task. Right time. "
        "The Antigravity Orchestra never sleeps. Coordinate. Execute. Win. "
        "Join us at jonny ai dot co dot uk."
    )
    
    # 2. Images (Using the God-Tier generated visuals from artifacts)
    # Note: These paths are absolute to the brain directory
    images = [
        "C:/Users/jonny/.gemini/antigravity/brain/fb306bb4-9ebe-41a1-88de-db5227d10a67/marcus_cole_portrait_1772656209779.png",
        "C:/Users/jonny/.gemini/antigravity/brain/fb306bb4-9ebe-41a1-88de-db5227d10a67/antigravity_orchestra_command_center_1772656223362.png",
        "https://jonnyai.co.uk/brand/orchestra_visual.png" # Fallback/Mixed
    ]
    
    audio_path = TMP_DIR / "voiceover.mp3"
    video_path = TMP_DIR / "maestro_pilot_reel.mp4"
    
    print("🚀 STARTING FINAL MAESTRO PILOT...")
    if generate_voiceover(text, audio_path):
        img_paths = download_images(images, TMP_DIR)
        if img_paths:
            if create_video_ffmpeg(audio_path, img_paths, video_path):
                print(f"🎉 REEL READY: {video_path}")
                # 3. Upload to Supabase Storage
                from supabase_storage import upload_video
                public_url = upload_video(str(video_path))
                print(f"🚀 PUBLIC URL FOR META: {public_url}")
            else:
                print("❌ Reel generation failed.")

if __name__ == "__main__":
    test_reel_pipeline()
