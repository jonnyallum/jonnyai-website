import requests

url = "https://n8n.jonnyai.co.uk/mcp-server/http"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjRlZmQ0Ni0xNjdiLTRjYTEtYTA4Ni1iOTY5YTFkNGZkNWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6ImI3OTc5Njg0LWUzMTItNDE4OS05YzhkLTY1ODViZDc0MjlmNSIsImlhdCI6MTc3MjYxMDM5NH0.b7UL4nLWmsLgVwKlPp6KAropodCCVzKsF8G4h5mMe_c"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

try:
    # Just a probe to see if it responds
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
