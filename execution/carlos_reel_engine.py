"""
carlos_reel_engine.py — Jai.OS 5.0
High-retention, God-tier automated Reels narrated by @marcus.
Features: Word-level timestamps, High-impact ASS subtitles, Pattern interrupts.
"""

import os
import sys
import base64
import json
import requests
import subprocess
import shutil
from pathlib import Path
from datetime import datetime

# --- Configuration ---
ELEVENLABS_API_KEY = "sk_1f8b04ee135d89ed7a60323f403e037d7770fa6e3e9cea83"
MARCUS_VOICE_ID = "ytcsltLTtCHxNn1vC76H" # The "Ricky" voice tuned for Maestro
TMP_DIR = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/video/CARLOS_ENGINE")
LIBRARY_DIR = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/library/visuals")

def get_audio_with_timestamps(text, output_mp3, output_json):
    """Fetches audio and character-level alignment from ElevenLabs."""
    print(f"🎙️ Generating HQ Voiceover with Timestamps (Model: Multilingual v2)...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{MARCUS_VOICE_ID}/with-timestamps"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.55, # Increased for more consistent warmth
            "similarity_boost": 0.9, # Maximize similarity to the cloned voice
            "style": 0.5,
            "use_speaker_boost": True
        }
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        res_data = response.json()
        # Audio is base64 in this endpoint
        audio_content = base64.b64decode(res_data['audio_base64'])
        with open(output_mp3, "wb") as f:
            f.write(audio_content)
        
        with open(output_json, "w") as f:
            json.dump(res_data['alignment'], f)
        
        print(f"✅ Audio and Alignment saved.")
        return True
    else:
        print(f"❌ Error generating voiceover: {response.text}")
        return False

def create_ass_subtitles(alignment_json, output_ass):
    """Converts ElevenLabs alignment data to high-impact ASS subtitles with keyword highlighting."""
    with open(alignment_json, "r") as f:
        alignment = json.load(f)
    
    # Power Words to highlight in Command Gold (HHL: &H004BB9FF - actually &H0000D4FF for gold in BGR)
    # BGR format: &H00[BB][GG][RR]
    GOLD = "&H0027C9FF" # Command Gold
    POWER_WORDS = ["WIN", "PRECISION", "FUTURE", "ORCHESTRA", "MAESTRO", "TRILLION", "COMMAND", "ANTIGRAVITY"]
    
    # Group into words
    words = []
    current_word = ""
    start_time = 0
    chars = alignment['characters']
    starts = alignment['character_start_times_seconds']
    ends = alignment['character_end_times_seconds']
    
    for i, char in enumerate(chars):
        if char == " " or i == len(chars) - 1:
            if current_word:
                if i == len(chars) - 1 and char != " ":
                    current_word += char
                words.append({
                    "word": current_word.upper(),
                    "start": start_time,
                    "end": ends[i]
                })
                current_word = ""
        else:
            if not current_word:
                start_time = starts[i]
            current_word += char

    # Write ASS
    ass_content = [
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        "Style: Default,Arial Black,110,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,2,0,1,10,3,5,50,50,960,1", # Added 3px shadow
        "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
    ]
    
    def format_time(seconds):
        h = int(seconds / 3600)
        m = int((seconds % 3600) / 60)
        s = seconds % 60
        return f"{h:01d}:{m:02d}:{s:05.2f}"

    for w in words:
        start = format_time(w['start'])
        end = format_time(w['end'])
        
        # Color match
        color_tag = f"{{\\1c{GOLD}}}" if any(pw in w['word'] for pw in POWER_WORDS) else ""
        
        # Flashy pop text
        text = f"{color_tag}{{\\fscx120\\fscy120\\t(0,50,\\fscx100\\fscy100)}}" + w['word']
        ass_content.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")
        
    with open(output_ass, "w", encoding="utf-8") as f:
        f.write("\n".join(ass_content))
    print(f"✅ High-Impact v2.0 ASS Subtitles generated.")

def generate_visual_segments(image_paths, total_duration):
    """Creates animated segments with zooming."""
    import static_ffmpeg
    static_ffmpeg.add_paths()
    
    num_images = len(image_paths)
    seg_dur = total_duration / num_images
    segments = []
    
    for i, img in enumerate(image_paths):
        seg_path = TMP_DIR / f"seg_{i:03d}.mp4"
        # Carlos Zoom + Shake
        cmd = [
            "ffmpeg", "-y", "-loop", "1", "-i", str(img),
            "-t", str(seg_dur),
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
                   "zoompan=z='min(zoom+0.0015,1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", str(seg_path)
        ]
        subprocess.run(cmd, capture_output=True)
        segments.append(seg_path)
    return segments

def run_engine(text, custom_images=None):
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    mp3_path = TMP_DIR / "voiceover.mp3"
    json_path = TMP_DIR / "alignment.json"
    ass_path = TMP_DIR / "subtitles.ass"
    final_video = TMP_DIR / f"carlos_reel_{datetime.now().strftime('%H%M%S')}.mp4"
    
    # 1. Audio + Timestamps
    if not get_audio_with_timestamps(text, mp3_path, json_path): return
    
    # 2. Subtitles
    create_ass_subtitles(json_path, ass_path)
    
    # 3. Visuals
    if not custom_images:
        # Default to Library
        custom_images = [
            str(LIBRARY_DIR / "agents/marcus_prime_v1.png"),
            str(LIBRARY_DIR / "backgrounds/hq_v1.png"),
            str(LIBRARY_DIR / "brand/vortex_v1.png"),
            str(LIBRARY_DIR / "agents/marcus_view_v1.png")
        ]
    
    # Get duration
    import static_ffmpeg
    static_ffmpeg.add_paths()
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(mp3_path)]
    dur = float(subprocess.run(cmd, capture_output=True, text=True).stdout.strip())
    
    segments = generate_visual_segments(custom_images, dur + 0.5)
    
    # Concat Visuals
    concat_list = TMP_DIR / "concat.txt"
    with open(concat_list, "w") as f:
        for s in segments: f.write(f"file '{s.name}'\n")
    
    temp_vis = TMP_DIR / "combined_vis.mp4"
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(temp_vis)], capture_output=True)
    
    # 4. Filter Layers (Grain + Vignette)
    print("🎬 APPLYING CINEMATIC FILTERS...")
    cinematic_vis = TMP_DIR / "final_vis.mp4"
    # noise=alls=20:all_flags=t (Temporal Grain), vignette
    filter_cmd = [
        "ffmpeg", "-y", "-i", "combined_vis.mp4",
        "-vf", "noise=alls=20:all_flags=t,vignette=angle=0.5",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "final_vis.mp4"
    ]
    subprocess.run(filter_cmd, capture_output=True, cwd=str(TMP_DIR))

    # 5. Audio Mix (Narration + Loop)
    print("🔊 MIXING GOD-TIER AUDIO...")
    mixed_audio = TMP_DIR / "final_mix.mp3"
    # Copy bg_loop to TMP to ensure FFmpeg can reach it
    shutil.copy("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/bg_loop.mp3", TMP_DIR / "bg_loop.mp3")
    
    amix_str = (
        "[0:a]volume=2.0[voice]; "
        "[1:a]volume=0.3,aloop=loop=-1:size=2e+09[bg]; "
        "[voice][bg]amix=inputs=2:duration=first[out]"
    )
    mix_cmd = [
        "ffmpeg", "-y", "-i", "voiceover.mp3", "-i", "bg_loop.mp3",
        "-filter_complex", amix_str, "-map", "[out]", "final_mix.mp3"
    ]
    subprocess.run(mix_cmd, capture_output=True, cwd=str(TMP_DIR))

    # 6. Final Burn
    print(f"🎬 BURNING SUBTITLES AND FINAL EXPORT...")
    final_cmd = [
        "ffmpeg", "-y", "-i", "final_vis.mp4", "-i", "final_mix.mp3",
        "-vf", f"ass={ass_path.name}", 
        "-c:v", "libx264", "-crf", "28", "-preset", "faster", "-c:a", "aac", "-map", "0:v", "-map", "1:a", "-shortest", final_video.name
    ]
    res = subprocess.run(final_cmd, capture_output=True, text=True, cwd=str(TMP_DIR))
    
    if res.returncode == 0:
        print(f"🏆 GOD-TIER REEL COMPLETE: {final_video}")
        from supabase_storage import upload_video
        url = upload_video(str(final_video))
        print(f"🚀 LIVE URL: {url}")
    else:
        print(f"❌ Final burning failed: {res.stderr}")

if __name__ == "__main__":
    promo_text = (
        "Precision. Creativity. Flair. "
        "The Antigravity Orchestra transforms chaos into conversion. "
        "Every agent. Every mission. Total command. "
        "Visit jonny ai dot co dot uk. Witness the future of work."
    )
    run_engine(promo_text)
