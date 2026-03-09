import requests

url = "https://n8n.jonnyai.co.uk/mcp-server/http"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTc1NDk5OS0zZjFiLTQyNTMtODRlZi0wMTY1NzgzYTg0MTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQyNjQxMDQ3fQ.CunwVQF87d7I3qNktPVb8jrBUt0"

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
