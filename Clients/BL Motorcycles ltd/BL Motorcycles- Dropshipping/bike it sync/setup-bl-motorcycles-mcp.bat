@echo off
echo Setting up BL Motorcycles MCP Configuration...

REM Set environment variables for BL Motorcycles project
set SUPABASE_URL=https://kenaardqwnpeqtwukdnb.supabase.co
set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU
set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw
set SUPABASE_ACCESS_TOKEN=sbp_d37d3bdb31ed3ca50c623e4a2b7cc99c21a241dd
set SUPABASE_PROJECT_ID=kenaardqwnpeqtwukdnb
set SUPABASE_REGION=eu-west-2

echo Environment variables set for BL Motorcycles project
echo URL: %SUPABASE_URL%
echo Project ID: %SUPABASE_PROJECT_ID%
echo Region: %SUPABASE_REGION%

REM Start the MCP server with BL Motorcycles configuration
echo Starting MCP server for BL Motorcycles...
node C:\Users\jonny\Documents\Cline\MCP\supabase-mcp-server\build\index.js

pause