$env:GOOGLE_OAUTH_ACCESS_TOKEN = (Get-Content c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/gcp_tokens.json | ConvertFrom-Json).access_token
terraform import 'module.cs-common.google_folder.folders["Common"]' folders/565180057451 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-0["Department 1"].google_folder.folders["Department 1"]' folders/499659965433 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 1/Team 1"].google_folder.folders["Team 1"]' folders/806038644164 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 1/Development"].google_folder.folders["Development"]' folders/11150629409 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 1/Non-Production"].google_folder.folders["Non-Production"]' folders/737023580351 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 1/Production"].google_folder.folders["Production"]' folders/509930446136 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 1/Team 2"].google_folder.folders["Team 2"]' folders/1073798487103 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 2/Development"].google_folder.folders["Development"]' folders/757128552610 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 2/Non-Production"].google_folder.folders["Non-Production"]' folders/182544180220 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 2/Production"].google_folder.folders["Production"]' folders/607521286535 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 1/Team 3"].google_folder.folders["Team 3"]' folders/51252041260 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 3/Development"].google_folder.folders["Development"]' folders/870349566871 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 3/Non-Production"].google_folder.folders["Non-Production"]' folders/785992370016 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 3/Production"].google_folder.folders["Production"]' folders/314488663874 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 1/Team 4"].google_folder.folders["Team 4"]' folders/576672683740 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 4/Development"].google_folder.folders["Development"]' folders/358203096299 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 4/Non-Production"].google_folder.folders["Non-Production"]' folders/856549269807 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 1/Team 4/Production"].google_folder.folders["Production"]' folders/786597436447 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-0["Department 2"].google_folder.folders["Department 2"]' folders/216194458050 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 2/Team 1"].google_folder.folders["Team 1"]' folders/1041639263292 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 1/Development"].google_folder.folders["Development"]' folders/589298295797 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 1/Non-Production"].google_folder.folders["Non-Production"]' folders/313112663528 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 1/Production"].google_folder.folders["Production"]' folders/417714352507 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 2/Team 2"].google_folder.folders["Team 2"]' folders/66340472101 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 2/Development"].google_folder.folders["Development"]' folders/126239537620 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 2/Non-Production"].google_folder.folders["Non-Production"]' folders/1020839201635 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 2/Production"].google_folder.folders["Production"]' folders/94644295598 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 2/Team 3"].google_folder.folders["Team 3"]' folders/142954625971 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 3/Development"].google_folder.folders["Development"]' folders/344067712390 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 3/Non-Production"].google_folder.folders["Non-Production"]' folders/767868249270 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 3/Production"].google_folder.folders["Production"]' folders/194989524595 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 2/Team 4"].google_folder.folders["Team 4"]' folders/186053533560 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 4/Development"].google_folder.folders["Development"]' folders/1025132281074 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 4/Non-Production"].google_folder.folders["Non-Production"]' folders/897119674015 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 2/Team 4/Production"].google_folder.folders["Production"]' folders/396557146459 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-0["Department 3"].google_folder.folders["Department 3"]' folders/40504279172 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 3/Team 1"].google_folder.folders["Team 1"]' folders/725376491556 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 1/Development"].google_folder.folders["Development"]' folders/453457289519 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 1/Non-Production"].google_folder.folders["Non-Production"]' folders/1080693968999 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 1/Production"].google_folder.folders["Production"]' folders/923304824885 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 3/Team 2"].google_folder.folders["Team 2"]' folders/243626178649 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 2/Development"].google_folder.folders["Development"]' folders/9801665158 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 2/Non-Production"].google_folder.folders["Non-Production"]' folders/906619120567 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 2/Production"].google_folder.folders["Production"]' folders/80955973372 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 3/Team 3"].google_folder.folders["Team 3"]' folders/296271448078 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 3/Development"].google_folder.folders["Development"]' folders/118000010096 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 3/Non-Production"].google_folder.folders["Non-Production"]' folders/1083520874705 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 3/Production"].google_folder.folders["Production"]' folders/406152708263 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-1["Department 3/Team 4"].google_folder.folders["Team 4"]' folders/1026260499280 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 4/Development"].google_folder.folders["Development"]' folders/1010651371809 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 4/Non-Production"].google_folder.folders["Non-Production"]' folders/642274398229 ; Start-Sleep -Milliseconds 100
terraform import 'module.cs-folders-level-2["Department 3/Team 4/Production"].google_folder.folders["Production"]' folders/302565508815 ; Start-Sleep -Milliseconds 100