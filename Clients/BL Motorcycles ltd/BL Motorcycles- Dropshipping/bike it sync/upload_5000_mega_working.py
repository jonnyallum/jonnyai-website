from dotenv import load_dotenv
import re
import unicodedata

load_dotenv() # Load environment variables from .env file

def clean_unicode_text(text: str) -> str:
    """Advanced Unicode cleaning for Windows compatibility"""
    if not text:
        return ""
    
    # Convert to string if not already
    text = str(text)
    
    # Remove problematic Unicode characters
    text = re.sub(r'[^\x00-\x7F]+', '', text)  # Remove non-ASCII
    text = unicodedata.normalize('NFKD', text)  # Normalize
    text = text.encode('ascii', 'ignore').decode('ascii')  # Force ASCII
    
    # Clean HTML and special chars
    text = re.sub(r'<[\s\S]*?>', '', text)  # Remove HTML tags
    text = re.sub(r'["\'\u201c\u201d\u2018\u2019]', '"', text)  # Normalize quotes
    text = re.sub(r'[\u2013\u2014]', '-', text)  # Normalize dashes
    text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
    
    return text.strip()

# Rest of the code remains the same...