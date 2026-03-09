def create_ass_subtitles(alignment, output_path):
    """
    Creates a high-impact .ass subtitle file from ElevenLabs alignment data.
    alignment: dict with characters, character_start_times_seconds, character_end_times_seconds
    """
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
            
    # Write ASS Header
    ass_content = [
        "[Script Info]",
        "ScriptType: v4.00+",
        "PlayResX: 1080",
        "PlayResY: 1920",
        "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        # Alignment 5 = Middle-Centered
        "Style: Default,Montserrat,100,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,2,0,1,6,0,5,50,50,960,1",
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
    ]
    
    def format_time(seconds):
        h = int(seconds / 3600)
        m = int((seconds % 3600) / 60)
        s = seconds % 60
        return f"{h:01d}:{m:02d}:{s:05.2f}"

    for w in words:
        start = format_time(w['start'])
        end = format_time(w['end'])
        # Add basic scale effect \t(start,end,scale)
        # Note: ASS effects are complex, starting simple:
        text = "{\\fscx120\\fscy120\\t(0,100,\\fscx100\\fscy100)}" + w['word']
        ass_content.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")
        
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(ass_content))
    print(f"✅ Subtitles saved to {output_path}")

# Example usage (to be integrated)
