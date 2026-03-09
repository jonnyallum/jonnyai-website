$key = 'c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key'

# Fix permissions - remove inheritance, restrict to current user only
$acl = Get-Acl $key
$acl.SetAccessRuleProtection($true, $false)
$acl.Access | ForEach-Object { $acl.RemoveAccessRule($_) }
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
    'Read',
    'Allow'
)
$acl.SetAccessRule($rule)
Set-Acl $key $acl
Write-Output "Key permissions fixed"

# Test SSH
Write-Output "Testing SSH to 34.105.146.38..."
$result = & ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 -i $key info@34.105.146.38 "echo SSH_OK && hostname && python3 --version" 2>&1
Write-Output $result
